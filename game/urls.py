from django.conf.urls import url, include
from django.views.generic import RedirectView
from django.contrib.auth.views import login,logout
from . import views, rest, form

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='games')),
    url(r'^login/$', login, {'template_name':'game/login.html'}),
    url(r'^logout/$', logout, {'next_page': '/login'}),
    url(r'^register/$', views.register, name='register'),

    url(r'^games/(?P<game_id>[0-9]+)/join_game$', views.join_game),
    url(r'^games/(?P<game_id>[0-9]+)/$', views.load_game, name="load_game"),

    url(r'^games/$', views.list_games, name='list_games'),
    url(r'^api/', include(rest.router.urls)),
]