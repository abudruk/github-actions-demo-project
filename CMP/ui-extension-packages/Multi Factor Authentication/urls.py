from django.conf.urls import url
from . import views

xui_urlpatterns = [
    url(r"^mfa/configure/$", views.configure_mfa, name="configure_mfa"),
    url(
        r"^mfa/verify/$",
        views.verify_second_factor_totp,
        name="verify_second_factor_totp",
    ),
    url(r"^mfa/disable/$", views.disable_mfa, name="mfa_disable"),
    url(r"^mfa/enable/$", views.enable_mfa, name="mfa_enable"),
    url(
        r"^mfa/users/json/$",
        views.MFAUserListJSONView.as_view(),
        name="mfa_table_json",
    ),
]
