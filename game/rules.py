
from .models import Game, Player, Type, Node, Place

# contains the basic rules for the game, validating player actions


class RuleIssue(Exception):
    def __init__(self, rule, message):
        self.rule = rule
        self.message = message


def create_game(game):
    # init players
    players = []
    for p in range(game.nb_players):
        players.append(Player(name='Player%d/%d' % (game.id, p), game=game, gold=7, turn_gold=4, points=3))
    Player.objects.bulk_create(players)
    game.current_player = Player.objects.get(name='Player%d/0' % game.id)
    game.save()
    # init map (i.e. nodes to play cards on)
    nodes = []
    for x in range(game.map_width):
        for y in range(game.map_height):
            nodes.append(Node(game=game, x=x, y=y))
    Node.objects.bulk_create(nodes)


def add_type(player, node, type):
    # check player can buy the building
    if player.turn_gold < type.cost:
        raise RuleIssue('The player must have enough gold to cover the cost for the new buildings.',
                        '%s costs %s' % (type.name, type.cost))
    if player.turn_buy < 1:
        raise RuleIssue('The player must have at least one buy action.',
                        'Player has %s buy actions.' % player.turn_buy)

    # check there is slot for the building on the node
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
            raise RuleIssue('A player cannot add a building to a node owned by another player.', 'Node belongs to %s' % node.player)
        # count the number of available slots
        available = 1
        for p in node.places.all():
            available += p.add_slot - 1
        if available < 1:
            raise RuleIssue('There must be an empty slot on a node to add a building.', 'Already placed: %s' % node.places)
        Place.objects.create(node=node, type=type)

    # if it goes here the node was modified
    player.turn_gold -= type.cost
    player.turn_buy -= 1
    player.save()
    node.save()


def end_turn(game, player):
    if player != game.current_player or player.game != game:
        raise Exception('%s is not current player %s' % (player.name, game.current_player.name))

    # TODO recompute victory points?

    # recompute gold
    # Current logic is that every turn the player restart with all the gold he paid,
    # minus the cost for his victory points. It means that buying points early will hinder
    # development. However you can't know exactly how long the game will last.
    player.turn_gold = player.gold - player.points

    # recompute rights to buy

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