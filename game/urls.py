from django.conf.urls import url, include

from django.views.generic import RedirectView

from . import views, rest

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='games')),
    url(r'^games/(?P<game_id>[0-9]+)/$', views.load_game),

    url(r'^games/$', views.list_games),
    url(r'^api/', include(rest.router.urls)),
]