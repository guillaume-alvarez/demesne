
from .models import Game, Player, Type, Node

# contains the basic rules for the game, validating player actions


class RuleIssue(Exception):
    def __init__(self, rule, message):
        self.rule = rule
        self.message = message


def create_game(game):
    # init players
    players = []
    for p in range(game.nb_players):
        players.append(Player(name='Player%d/%d' % (game.id, p), game=game, gold=7, points=3))
    Player.objects.bulk_create(players)
    game.current_player = Player.objects.get(name='Player%d/0' % game.id)
    # init map (i.e. nodes to play cards on)
    nodes = []
    for x in range(game.map_width):
        for y in range(game.map_height):
            nodes.append(Node(game=game, x=x, y=y))
    Node.objects.bulk_create(nodes)


def add_type(player, node, type):
    # check player can buy the building
    if player.gold < type.cost:
        raise RuleIssue('The player must have enough gold to cover the cost for the new buildings.',
                        '%s costs %s' % (type.name, type.cost))

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
        node.places.add(type)
        node.player = player;
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
        node.places.add(type)

    # if it goes here the node was modified
    player.gold -= type.cost
    player.save()
    node.save()
