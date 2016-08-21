from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets, renderers, status
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from . import rules
from .models import Game, Player, Type, Node


# Serializers define the API representation.
class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class NodeSerializer(serializers.ModelSerializer):
    places = TypeSerializer(many=True, read_only=True)

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


# ViewSets define the view behavior.
class GameViewset(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    renderer_classes = (renderers.JSONRenderer, )

    def perform_create(self, serializer):
        game = serializer.save()
        rules.create_game(game)


class PlayerViewset(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    renderer_classes = (renderers.JSONRenderer, )


class TypeViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Type.objects.all()
    lookup_field = 'slug'
    serializer_class = TypeSerializer
    renderer_classes = (renderers.JSONRenderer, )


class NodeViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    renderer_classes = (renderers.JSONRenderer, )

    @detail_route(methods=['post'])
    def add_type(self, request, pk=None):
        node = self.get_object()
        type = Type.objects.get(slug=request.data['type'])
        player = Player.objects.get(id=request.data['player'])
        rules.add_type(player, node, type)
        serializer = self.get_serializer(node)
        return Response(serializer.data)


def custom_exception_handler(exc, context):
    # Now add the specific information to the response
    if isinstance(exc, rules.RuleIssue):
        import json
        return Response(data={'rule': exc.rule, 'text':exc.message},
                        status=status.HTTP_400_BAD_REQUEST)

    # else all REST framework's default exception handler to get the standard error response.
    return exception_handler(exc, context)


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
