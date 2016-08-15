from django.conf.urls import url, include

from . import views, rest

urlpatterns = [
    url(r'^$', views.index),

    url(r'^api/', include(rest.router.urls)),
]