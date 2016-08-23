from django.conf.urls import url, include

from . import views, rest

urlpatterns = [
    url(r'^$', views.index),
    url(r'^games/(?P<game_id>[0-9]+)/$', views.load_game),

    url(r'^api/', include(rest.router.urls)),
]