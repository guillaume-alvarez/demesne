from django.forms.formsets import INITIAL_FORM_COUNT
from django.conf import settings

from .models import Game, Player, Type, Node, Place, Deck

from random import shuffle

import logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


# contains the basic rules for the game, validating player actions


class RuleIssue(Exception):
    def __init__(self, rule, message):
        self.rule = rule
        self.message = message


def create_game(game):
    # generate starting decks for the game (random selection of optional cards)
    decks = []
    nb_optional = 10
    available = list(Type.objects.all())
    shuffle(available)
    for type in available:
        if type.mandatory or --nb_optional >= 0:
            decks.append(Deck(game=game, type=type, nb=type.start_number))
    Deck.objects.bulk_create(decks)

    # init map (i.e. nodes to play cards on)
    nodes = []
    for x in range(game.map_width):
        for y in range(game.map_height):
            nodes.append(Node(game=game, x=x, y=y))
    Node.objects.bulk_create(nodes)

    # init players
    players = []
    for p in range(game.nb_players):
        if game.multiplayer:
            if p == 0:
                players.append(Player(name='%s' % (game.owner.get_username()), game=game, user=game.owner))
            else:
                players.append(Player(name='Player%d' % (p), game=game, user=None))
        else:
            players.append(Player(name='%s%d' % (game.owner.get_username(), p), game=game, user=game.owner))
    Player.objects.bulk_create(players)
    game.current_player = Player.objects.filter(game_id=game.id).first()
    game.save()

def add_type(player, node, type):
    # check game is not finished
    if player.game.winner:
        raise RuleIssue('The game is ended',
                        '%s already won the game' % player.game.winner.name)

    # check player can buy the building
    if player.turn_gold + (node.turn_gold if node else 0) < type.cost:
        raise RuleIssue('The player must have enough gold to cover the cost for the new buildings.',
                        '%s costs %s' % (type.name, type.cost))
    if player.turn_buy < 1:
        raise RuleIssue('The player must have at least one buy action.',
                        'Player has %s buy actions.' % player.turn_buy)
    deck = player.game.decks.get(type=type)
    if not deck or deck.nb < 1:
        raise RuleIssue('The type must be available in game',
                        'Type %s is not available in game.' % type.name)

    # check if there is a node
    if not node:
        if type.need_slot:
            raise RuleIssue('This card must be placed on a node.',
                            '%s must be placed on the map.' % (type.name))
        # TODO may be removed now that gold and points types are placed on map
        player.gold += type.add_gold
        player.points += type.add_points

    # else check there is slot for the building on the node
    else:
        if not node.player:
            # check the building is near a player node, if player already has one
            if player.node_set.exists():
                has_neighbour = False
                for neighbour in node.neighbours():
                    if neighbour.player == player:
                        has_neighbour = True
                        break
                if not has_neighbour:
                    raise RuleIssue('New nodes must be contiguous to at least another one from the player.',
                                    'No neighbour owned by %s for %s' % (player, node))

            # always possible to add a card to an empty node
            Place.objects.create(node=node, type=type)
            node.player = player

        else:
            # check it is the correct player
            if node.player != player:
                raise RuleIssue('A player cannot add a building to a node owned by another player.',
                                'Node belongs to %s' % node.player)
            player = node.player
            # count the number of available slots
            available = 1
            for p in node.places.all():
                    available += p.add_slot_for(type)
                    if p.category == type.category:
                        available -= 1
            if available < 1:
                raise RuleIssue('There must be an empty slot on a node to add a building.',
                                'Already placed: %s' % node.places.all())
            Place.objects.create(node=node, type=type)

    # if it goes here the node was modified
    if node:
        payed_by_node = min(node.turn_gold, type.cost)
        node.turn_gold -= payed_by_node
        player.turn_gold -= max(type.cost - payed_by_node, 0)
    else:
        player.turn_gold -= type.cost
    player.turn_buy -= 1
    player.save()
    deck.nb -= 1
    deck.save()
    if node:
        node.save()

    # check for special effects
    if type.special_effects and 'militia' in type.special_effects:
        for neighbour in node.neighbours():
            if neighbour != node and neighbour.player and neighbour.player != node.player:
                if not neighbour.places.filter(special_effects__contains='moat').exists():
                    changed = False
                    for p in neighbour.place_set.all():
                        if p.type.category == Type.PRESTIGE and p.type.add_gold > 0:
                            neighbour.player.gold -= p.type.add_gold
                            neighbour.player.turn_gold -= p.type.add_gold
                            neighbour.player.turn_buy -= p.type.add_buy
                            neighbour.player.points -= p.type.add_points
                            p.delete()
                            changed = True
                    if changed:
                        neighbour.player.save()
                        if not neighbour.place_set.exists():
                            neighbour.player = None
                            neighbour.save()


def is_game_finished(game):
    finished_decks = 0
    for deck in game.decks.filter(nb__lte=0):
        finished_decks += 1
        if deck.type.mandatory:
            return True
    return finished_decks >= 3


def end_turn(request, game, player):
    if player != game.current_player or player.game != game:
        raise Exception('%s is not current player %s' % (player.name, game.current_player.name))

    # check game is not finished
    if game.winner:
        raise RuleIssue('The game is ended',
                        '%s already won the game' % player.game.winner.name)

    # recompute victory points from cards
    player.points = Player.INITIAL_POINTS
    for node in player.node_set.all():
        if node.active:
            for p in node.places.all():
                player.points += p.add_points

    # recompute gold from cards
    player.gold = Player.INITIAL_GOLD
    for node in player.node_set.all():
        if node.active:
            node.turn_gold = 0
            for p in node.places.all():
                player.gold += p.add_gold
                node.turn_gold += p.add_node_gold
            node.save()
    player.turn_gold = player.gold

    # recompute rights to buy from cards
    player.turn_buy = Player.INITIAL_BUY
    for node in player.node_set.all():
        if node.active:
            for p in node.places.all():
                player.turn_buy += p.add_buy

    # detect game is finished
    if is_game_finished(game):
        game.current_player = None
        game.winner = game.player_set.order_by('-points', '-gold', 'id').first()
        game.save()
        player.save()
        return

    # set game to next player
    players = Player.objects.filter(game_id=player.game_id).order_by('id')
    next_player = None
    for p in players:
        if p.id > player.id:
            next_player = p
            break
    if not next_player:
        # current player is the last one, loop to first
        next_player = players[0]
    game.current_player = next_player
    game.save()
    player.save()

    if game.multiplayer and next_player.user_id and next_player.user_id != player.user_id and next_player.user.email:
        from django.core.mail import send_mail
        from textwrap import dedent
        from django.core.urlresolvers import reverse
        try:
            send_mail('New turn on game ' + game.name,
                      dedent('''\
                      Greetings %s!

                      Your new turn is ready to be played at %s

                      Regards,
                      The Demesne team
                      ''' % (next_player.user.username,
                             request.build_absolute_uri(reverse('load_game', kwargs={'game_id': game.id})))),
                      settings.EMAIL_DEFAULT_FROM,
                      [next_player.user.email])
        except Exception as e:
            log.exception('Cannot send email to %s: %s', next_player.user.username, e)
