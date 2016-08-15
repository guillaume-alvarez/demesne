from django.core.management.base import BaseCommand, CommandError
from game.models import Type

import logging

log = logging.getLogger(__name__)

# Register some types that are pretty standard

class Command(BaseCommand):
    help = 'Register some types that are pretty standard'

    def add_arguments(self, parser):
        # Named (optional) arguments
        pass

    def handle(self, *args, **options):
        """Just call the actions required by user."""
        Type.objects.all().delete()
        Type.objects.bulk_create([
            Type(name="Market", slug="market", cost=5, add_slot=1, add_gold=1, add_buy=1, add_move=1),
            Type(name="Blacksmith", slug="blacksmith", cost=4, add_move=3),
            Type(name="Militia", slug="militia", cost=4, add_gold=2, special_effects="militia"),
            Type(name="Moat", slug="moat", cost=2, add_move=2, special_effects="moat"),
            Type(name="Council Room", slug="council_room", cost=5, add_buy=1, add_move=4),
            Type(name="Lumberjack", slug="lumberjack", cost=3, add_buy=1, add_gold=2),
            Type(name="Festival", slug="festival", cost=5, add_slot=2, add_buy=1, add_gold=2),
            Type(name="Village", slug="village", cost=3, add_slot=2, add_move=1),
        ])