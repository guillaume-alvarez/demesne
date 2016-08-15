from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets, renderers

from .models import Game, Player, Type


# Serializers define the API representation.
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


# ViewSets define the view behavior.
class GameViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    renderer_classes = (renderers.JSONRenderer, )


class PlayerViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    renderer_classes = (renderers.JSONRenderer, )


class TypeViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Type.objects.all()
    lookup_field = 'slug'
    serializer_class = TypeSerializer
    renderer_classes = (renderers.JSONRenderer, )


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'games', GameViewset, base_name='game')
router.register(r'players', PlayerViewset, base_name='player')
router.register(r'types', TypeViewset, base_name='type')

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^', include(router.urls)),
]
