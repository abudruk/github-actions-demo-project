from django.conf.urls import url
from xui.service_now_approval.views import (
    get_workflow_choices,
    save_snow_workflow,
    delete_snow_workflow,
    get_field_choices,
    get_service_now_tables,
    get_field_value_choices,
    add_service_now_approval_connection,
    make_default_snow_workflow,
    change_default_snow_workflow,
    add_default_data
)

xui_urlpatterns = [
    url(r"^xui/service_now_approval/get_workflow_choices/$",
        get_workflow_choices, name="get_workflow_choices"),

    url(r"^xui/service_now_approval/get_field_choices/$",
        get_field_choices, name="get_field_choices"),

    url(r"^xui/service_now_approval/get_field_value_choices/$",
        get_field_value_choices, name="get_field_value_choices"),

    url(r"^xui/service_now_approval/get_service_now_tables/$",
        get_service_now_tables, name="get_service_now_tables"),

    url(r"^xui/service_now_approval/add_service_now_approval_connection/$",
        add_service_now_approval_connection, name="add_service_now_approval_connection"),

    url(r"^xui/service_now_approval/save_snow_workflow/$",
        save_snow_workflow, name="save_snow_workflow"),
    
    url(r"^xui/service_now_approval/delete_snow_workflow/$",
        delete_snow_workflow, name="delete_snow_workflow"),

    url(r"^xui/service_now_approval/make_default_snow_workflow/$",
        make_default_snow_workflow, name="make_default_snow_workflow"),

    url(r"^xui/service_now_approval/change_default_snow_workflow/$",
        change_default_snow_workflow, name="change_default_snow_workflow"),

    url(r"^xui/service_now_approval/add_default_data/$",
        add_default_data, name="add_default_data"),
]
