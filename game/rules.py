
from .models import Game, Player, Type, Node

# contains the basic rules for the game, validating player actions


class RuleIssue(Exception):
    def __init__(self, rule, message):
        self.rule = rule
        self.message = message


def create_game(game):
    players = []
    for p in range(game.nb_players):
        players.append(Player(name=game.name+'/'+str(p), game=game))
    Player.objects.bulk_create(players)
    nodes = []
    for x in range(game.map_width):
        for y in range(game.map_height):
            nodes.append(Node(game=game, x=x, y=y))
    Node.objects.bulk_create(nodes)


def add_type(node, type):
    if not node.places:
        # always possible to add a card to an empty node
        node.places.add(type)
    else:
        # count the number of available slots
        available = 1
        for type in node.places.all():
            available += type.add_slot - 1
        if available < 1:
            raise RuleIssue('There must be an empty slot on a node to add a building.', 'Already placed: %s' % type.places)
        node.places.add(type)

    node.save()
