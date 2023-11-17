import base64
import codecs
import random
import re
from urllib.parse import urlencode

from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.utils.html import conditional_escape, escape, format_html

from accounts.models import UserProfile
from accounts.views import UserListJSONView
from infrastructure.models import CustomField
from extensions.views import admin_extension
from utilities.cb_http import parse_querystring_from_request
from utilities.decorators import dialog_view
from utilities.permissions import cbadmin_required
from xui.mfa import totp
from xui.mfa.forms import MFAForm
from xui.mfa.xui_settings import *


def qrcode(value, alt=None):
    url = conditional_escape(
        "https://chart.apis.google.com/chart?%s"
        % urlencode({"chs": "150x150", "cht": "qr", "chl": value, "choe": "UTF-8"})
    )
    alt = conditional_escape(alt or value)

    return format_html(
        """<img class="qrcode" src="%s" width="150" height="150" alt="%s" />"""
        % (url, alt)
    )


def is_mfa_enabled(request, user_profile=None):
    """
    Check if MFA is enabled for a user.
    """
    if not user_profile:
        user_profile = request.user.userprofile
    mfa = CustomField.objects.get(name="mfa_enabled")
    try:
        mfa_enabled = user_profile.custom_field_values.get(field=mfa).value
        return mfa_enabled
    except:
        user_profile.update_cf_value(mfa, "Enforce")
        return True


@dialog_view
@cbadmin_required
def enable_mfa(request):
    """
    Enable MFA for a user.
    """

    query_dict = parse_querystring_from_request(request)
    profiles = UserProfile.objects.filter(id__in=query_dict.get('profile_id[]', []))
    force = query_dict.get("force", False)
    submit = "Enforce MFA"
    if force:
        submit = "Reset MFA"

    if request.method == "POST":
        form = MFAForm(force=force, mfa="Enforce")

        msg = form.save(profiles)
        messages.success(request, msg)
        return HttpResponseRedirect(request.META.get("HTTP_REFERER", "/"))

    return {
        "title": submit,
        "use_ajax": True,
        "content":  (
            "Once MFA is enabled the user(s) will have to scan a QR code into "
            "a software token generator in order to log into this application. "
            "Are you sure?"),
        "submit": submit,
        "action_url": "/mfa/enable/?" + request.META["QUERY_STRING"]

    }


@dialog_view
@cbadmin_required
def disable_mfa(request):
    """
    Disable MFA for a user.
    """
    query_dict = parse_querystring_from_request(request)
    profiles = UserProfile.objects.filter(id__in=query_dict.get('profile_id[]', []))
    submit = "Disable MFA"

    if request.method == "POST":
        form = MFAForm(mfa="Inactive")
        msg = form.save(profiles)
        messages.success(request, msg)
        return HttpResponseRedirect(request.META.get("HTTP_REFERER", "/"))

    return {
        "title": submit,
        "use_ajax": True,
        "content": (
            "Once MFA is disabled the user(s) will be able to log into this application "
            "without a secondary authentication method. Are you sure?"),
        "submit": submit,
        "action_url": "/mfa/disable/?" + request.META["QUERY_STRING"]

    }


def save_secret_key(request, secret_key):
    """
    Enable MFA for a user.
    """
    mfa = CustomField.objects.get(name="mfa_totp_secret")
    up = request.get_user_profile()
    up.update_cf_value(mfa, secret_key)

    return None


def configure_mfa(request):
    qr_code = None
    base_32_secret_utf8 = None
    try:
        next = request.GET.get("next")
    except:
        next = request.POST.get("next")
    if request.method == "POST":

        next = request.POST.get("next")
        base_32_secret = base64.b32encode(
            codecs.decode(
                codecs.encode("{0:020x}".format(random.getrandbits(80))), "hex_codec"
            )
        )
        base_32_secret_utf8 = base_32_secret.decode("utf-8")
        totp_obj = totp.TOTP(base_32_secret_utf8)

        try:
            issuer_name = MFA_ISSUER_NAME
        except:
            issuer_name = None
        qr_code = re.sub(
            r"=+$",
            "",
            totp_obj.provisioning_uri(request.user.username, issuer_name=issuer_name),
        )
        qr_code = qrcode(qr_code)
        save_secret_key(request, base_32_secret_utf8)
    return render(
        request,
        f"{TEMPLATE_DIR}/configure.html",
        {"qr_code": qr_code, "secret_key": base_32_secret_utf8, "next": next},
    )


def verify_second_factor_totp(request):
    """
    Verify a OTP request
    """

    ctx = {}
    if request.method == "GET":
        ctx["next"] = request.GET.get("next")
        return render(request, f"{TEMPLATE_DIR}/verify_second_factor_totp.html", ctx)

    if request.method == "POST":

        verification_code = request.POST.get("verification_code")
        ctx["next"] = request.POST.get("next")

        if verification_code is None:
            ctx["error_message"] = "Missing verification code."

        else:
            cf = CustomField.objects.get(name="mfa_totp_secret")
            up = request.get_user_profile()
            otp_ = up.custom_field_values.get(field=cf).value
            totp_ = totp.TOTP(otp_)

            is_verified = totp_.verify(verification_code)

            if is_verified:
                request.session["verified_mfa"] = True
                up.mfa_enabled = "Active"
                return redirect(request.POST.get("next"))
        ctx["error_message"] = "Your code is expired or invalid."
    else:
        ctx["next"] = request.GET.get("next")

    return render(
        request, f"{TEMPLATE_DIR}/verify_second_factor_totp.html", ctx, status=400
    )


@admin_extension(title='MFA Management', description='For MFA user management.')
def admin_page(request):
    up = UserProfile.objects.all()
    mfa_enabled = [user for user in up if user.custom_field_values.filter(str_value="Active")]
    mfa_enforced = [user for user in up if user.custom_field_values.filter(str_value="Enforce")]
    mfa_disabled = [user for user in up if user not in mfa_enforced and user not in mfa_enabled]

    admin_context = {
        "title": ADMIN_PAGE_TITLE,
    }
    return render(request, f"{TEMPLATE_DIR}/admin_page.html", admin_context)


class MFAUserListJSONView(UserListJSONView):

    def get_field_names_for_table_columns(self):
        return [
            None,  # checkbox
            None, # MFA
            "user__email",
            ["user__last_name", "user__first_name"],
            "ldap",
            None
        ]

    def get_row(self, profile):
        row = []
        user = profile.user

        row.append(
            format_html(
                '<input class="pull-left selector" type="checkbox" name="profile_id" value="{}"/>',
                profile.id,
            )
        )

        mfa = profile.mfa_enabled
        icon_class = "fa-shield"
        if mfa == "Inactive":
            icon_class = "fa-ban"
        elif not mfa or mfa == "Enforce":
            icon_class = "fa-exclamation-circle"
        row.append(
            format_html("<span class=\"fas {}\"></span>", icon_class)
        )
        row.append(escape(user.email))
        row.append(format_html("{}, {}", user.last_name, user.first_name))

        domain = "<i>Local</i>"
        if profile.ldap:
            domain = profile.domain.ldap_domain
        row.append(format_html(domain))

        reset = """
            <a class="js-dialog-link btn btn-default"
              data-toggle="tooltip" title="Reset MFA"
              href="/mfa/enable/?force=1&profile_id[]={profile_id}">
              <span class="fa fa-exclamation-circle"/>
            </a>"""

        enable = """
            <a class="js-dialog-link btn btn-default"
              data-toggle="tooltip" title="Enable MFA"
              href="/mfa/enable/?profile_id[]={profile_id}">
              <span class="fa fa-shield"/>
            </a>"""

        disable  = """
            <a class="js-dialog-link btn btn-default"
              data-toggle="tooltip" title="Disable MFA"
              href="/mfa/disable/?profile_id[]={profile_id}">
              <span class="fa fa-ban"/>
            </a>"""

        if not mfa or mfa == "Inactive":
            row.append(
                format_html(
                    """<div class="nowrap">""" + enable + "</div>", profile_id=profile.id
                )
            )
        else:
            row.append(
                format_html(
                    """<div class="nowrap">""" + reset + disable + "</div<",
                    profile_id=profile.id,
                )
            )

        return row
