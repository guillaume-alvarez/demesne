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
            Type(name="Market", slug="market", cost=5, add_building=1, add_node_gold=1, add_buy=1, add_prestige=1),
            Type(name="Blacksmith", slug="blacksmith", cost=4, add_prestige=3),
            Type(name="Militia", slug="militia", cost=4, add_node_gold=2, special_effects="militia",
                 description='Destroy prestige cards producing gold in neighbouring tiles.'),
            Type(name="Moat", slug="moat", cost=2, add_prestige=2, special_effects="moat",
                 description='Protect against militia effects.'),
            Type(name="Council Room", slug="council_room", cost=5, add_buy=1, add_prestige=4),
            Type(name="Lumberjack", slug="lumberjack", cost=3, add_buy=1, add_node_gold=2),
            Type(name="Festival", slug="festival", cost=5, add_building=2, add_buy=1, add_node_gold=2),
            Type(name="Village", slug="village", cost=3, add_building=2, add_prestige=1),

            Type(name="Gold", slug="gold", cost=6, category=Type.PRESTIGE,add_node_gold=3,start_number=10,mandatory=True),
            Type(name="Silver", slug="silver", cost=3, category=Type.PRESTIGE,add_node_gold=2,start_number=20,mandatory=True),
            Type(name="Copper", slug="copper", cost=0, category=Type.PRESTIGE,add_node_gold=1,start_number=30,mandatory=True),

            Type(name="Province", slug="province", cost=8, category=Type.PRESTIGE,add_points=6,start_number=12,mandatory=True,end_game=True),
            Type(name="Duchy", slug="duchy", cost=5, category=Type.PRESTIGE,add_points=3,start_number=12,mandatory=True),
            Type(name="Estate", slug="estate", cost=2, category=Type.PRESTIGE,add_points=1,start_number=12,mandatory=True),
        ])