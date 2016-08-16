from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets, renderers
from rest_framework.response import Response

from .models import Game, Player, Type, Node


# Serializers define the API representation.
class NodeSerializer(serializers.ModelSerializer):
    partial = True

    class Meta:
        model = Node
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    node_set = NodeSerializer(many=True, read_only=True)
    player_set = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = '__all__'


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


# ViewSets define the view behavior.
class GameViewset(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    renderer_classes = (renderers.JSONRenderer, )

    def perform_create(self, serializer):
        '''At creation make sure we declare all the nodes.'''
        game = serializer.save()
        players = []
        for p in range(game.nb_players):
            players.append(Player(name=game.name+'/'+str(p), game=game))
        Player.objects.bulk_create(players)
        nodes = []
        for x in range(game.map_width):
            for y in range(game.map_height):
                nodes.append(Node(game=game, x=x, y=y))
        Node.objects.bulk_create(nodes)


class PlayerViewset(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    renderer_classes = (renderers.JSONRenderer, )


class TypeViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Type.objects.all()
    lookup_field = 'slug'
    serializer_class = TypeSerializer
    renderer_classes = (renderers.JSONRenderer, )


class NodeViewset(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    renderer_classes = (renderers.JSONRenderer, )


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'games', GameViewset, base_name='game')
router.register(r'players', PlayerViewset, base_name='player')
router.register(r'types', TypeViewset, base_name='type')
router.register(r'nodes', NodeViewset, base_name='node')

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^', include(router.urls)),
]
