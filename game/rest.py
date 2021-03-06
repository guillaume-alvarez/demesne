from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets, renderers, status
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from . import rules
from .models import Game, Player, Type, Node, Deck


# Serializers define the API representation.
class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    active = serializers.SerializerMethodField()
    winner = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Player
        fields = '__all__'

    def get_active (self, obj):
        return obj.game.current_player == obj

    def get_winner (self, obj):
        return obj.game.winner == obj


class NodeSerializer(serializers.ModelSerializer):
    places = TypeSerializer(many=True, read_only=True)
    player = PlayerSerializer(read_only=True)

    class Meta:
        model = Node
        fields = '__all__'


class DeckSerializer(serializers.ModelSerializer):
    type = TypeSerializer(read_only=True)

    class Meta:
        model = Deck
        fields = ('type', 'nb')


class GameSerializer(serializers.ModelSerializer):
    node_set = NodeSerializer(many=True, read_only=True)
    player_set = PlayerSerializer(many=True, read_only=True)
    decks = DeckSerializer(many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Game
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

# ViewSets define the view behavior.
class GameViewset(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    renderer_classes = (renderers.JSONRenderer, )

    def perform_create(self, serializer):
        game = serializer.save(owner=self.request.user)
        rules.create_game(game)

    @detail_route(methods=['post'])
    def end_turn(self, request, pk=None):
        game = self.get_object()
        player = Player.objects.get(id=request.data['player'])
        check_login(self.request, player.user)
        rules.end_turn(request, game, player)
        serializer = self.get_serializer(game)
        return Response(serializer.data)

class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    renderer_classes = (renderers.JSONRenderer,)
    queryset = User.objects.all()


class PlayerViewset(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    renderer_classes = (renderers.JSONRenderer, )

    @detail_route(methods=['post'])
    def end_turn(self, request, pk=None):
        player = self.get_object()
        check_login(self.request, player.user)
        rules.end_turn(request, player.game, player)
        serializer = self.get_serializer(player)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def add_type(self,request, pk=None):
        player = self.get_object()
        check_login(self.request, player.user)
        type = Type.objects.get(slug=request.data['type'])
        rules.add_type(player,None,type)
        serializer = self.get_serializer(player)
        return Response(serializer.data)


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
        check_login(self.request, player.user)
        rules.add_type(player, node, type)
        serializer = self.get_serializer(node)
        return Response(serializer.data)


def check_login(request, expected_user):
    if expected_user is None:
        raise rules.RuleIssue(rule='This is not a valid player yet.',
                              message='No user has join yet.')
    elif request.user.id != expected_user.id:
        raise rules.RuleIssue(rule='Only a logged player can perform an action.',
                              message='Expected ' + expected_user.get_username())


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
router.register(r'users', UserViewset, base_name='user')

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^', include(router.urls)),
]
