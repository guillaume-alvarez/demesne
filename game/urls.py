from django.conf.urls import url, include
from django.views.generic import RedirectView
from django.contrib.auth.views import login,logout
from . import views, rest, form

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='games')),
    url(r'^login/$', login, {'template_name':'game/login.html', 'authentication_form': form.LoginForm}),
    url(r'^logout/$', logout, {'next_page': '/login'}),
    url(r'^createUser/$', views.create_user),

    url(r'^games/(?P<game_id>[0-9]+)/$', views.load_game),

    url(r'^games/$', views.list_games),
    url(r'^api/', include(rest.router.urls)),
]