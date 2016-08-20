
from .models import Game, Player, Type, Node

# contains the basic rules for the game, validating player actions


class RuleIssue(Exception):
    def __init__(self, rule, message):
        self.rule = rule
        self.message = message


def create_game(game):
    players = []
    for p in range(game.nb_players):
        players.append(Player(name='Player%d/%d' % (game.id, p), game=game, gold=7, points=3))
    Player.objects.bulk_create(players)
    nodes = []
    for x in range(game.map_width):
        for y in range(game.map_height):
            nodes.append(Node(game=game, x=x, y=y))
    Node.objects.bulk_create(nodes)


def add_type(player, node, type):
    # check player can buy the building
    if player.gold < type.cost:
        raise RuleIssue('The player must have enough gold to cover the cost for the new buildings.',
                        '%(name)s costs %(cost)s' % type)
    if not node.player:
        # always possible to add a card to an empty node
        node.places.add(type)
        node.player = player;
    else:
        # check it is the correct player
        if node.player is not player:
            raise RuleIssue('A player cannot add a building to a node owned by another player.', 'Node belongs to %s' % node.player)
        # count the number of available slots
        available = 1
        for type in node.places.all():
            available += type.add_slot - 1
        if available < 1:
            raise RuleIssue('There must be an empty slot on a node to add a building.', 'Already placed: %s' % type.places)
        node.places.add(type)
    # if it goes here the node was modified
    node.save()
