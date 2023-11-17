from django.conf.urls import url

from . import views

xui_urlpatterns = [
    url(
        r"^ajax/s3-browser/(?P<resource_id>\d+)/$", views.s3_browser, name="s3_browser"
    ),
    url(r"^ajax/s3-upload/(?P<resource_id>\d+)/", views.upload_item, name="s3_upload"),
    url(
        r"^ajax/s3-upload-new-object/(?P<resource_id>\d+)/",
        views.upload_new_object,
        name="s3_upload_new_object",
    ),
    url(
        r"^ajax/s3-upload-new-folder/(?P<resource_id>\d+)/",
        views.upload_folder,
        name="s3_upload_new_folder",
    ),
    url(
        r"^ajax/s3-create-folder/(?P<resource_id>\d+)/",
        views.create_folder,
        name="s3_create_folder",
    ),
    url(
        r"^ajax/s3-rename-object/(?P<resource_id>\d+)/",
        views.rename_object,
        name="s3_rename_object",
    ),
    url(
        r"^ajax/s3-get-versions/(?P<resource_id>\d+)/",
        views.get_versions,
        name="s3_get_versions",
    ),
    url(
        r"^ajax/s3-enable-versioning/(?P<resource_id>\d+)/",
        views.s3_enable_versioning,
        name="s3_enable_versioning",
    ),
    url(
        r"^ajax/s3-download-file/(?P<resource_id>\d+)/",
        views.download_item,
        name="s3_download",
    ),
    url(
        r"^ajax/s3-delete-file/(?P<resource_id>\d+)/",
        views.delete_item,
        name="s3_delete_file",
    ),
    url(
        r"^ajax/s3-promote-version/(?P<resource_id>\d+)/",
        views.promote_version,
        name="s3_promote_versioned_file",
    ),
    # URLs for JSON response for Cb Applets
    url(
        r"^ajax/s3-list-buckets/",
        views.s3_list_buckets,
        name="s3_list-buckets",
    ),
    url(
        r"^ajax/s3-browser-info/(?P<resource_id>\d+)/",
        views.s3_browser_info,
        name="s3_browser_info",
    ),
]
