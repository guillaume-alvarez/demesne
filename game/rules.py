
from .models import Game, Player, Type, Node

# contains the basic rules for the game, validating player actions

class RuleIssue(Exception):
    def __init__(self, rule, message):
        self.rule = rule
        self.message = message


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
