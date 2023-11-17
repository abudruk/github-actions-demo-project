from django.conf.urls import url
from xui.onefuse import views

xui_urlpatterns = [
    url(r'^onefuse_admin', views.onefuse_admin, name='onefuse_admin'),
    url(r'^setup_onefuse', views.setup_onefuse, name='setup_onefuse')
]