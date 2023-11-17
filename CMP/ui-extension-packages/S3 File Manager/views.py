import json
import os
from sre_constants import SUCCESS
from urllib import response

import boto3
from django.shortcuts import HttpResponse, get_object_or_404, render
from django.utils.safestring import mark_safe
from extensions.views import TabExtensionDelegate, dashboard_extension, tab_extension
from infrastructure.models import CustomField
from orders.models import CustomFieldValue
from portals.models import PortalConfig
from resourcehandlers.aws.models import AWSHandler
from resources.models import Resource, ResourceType
from resources.serializers import ResourceSerializer
from utilities.decorators import json_view
from utilities.get_current_userprofile import get_current_userprofile
from utilities.logger import ThreadLogger
from xui.s3_file_manager import operations

# Global Variables
logger = ThreadLogger(__name__)


# Please don't remove this definition
# Adding this piece of code for get boto3 client from AWS Wrapper to 
# add signature_version while creating boto3 session
def get_boto3_client(
        rh, service_name: str, key_id: str, key: str, region_name: str, **kwargs
    ):
        """
        Returns a configured boto3 `Client` object.

        Args:
            service_name (str): AWS Service name (e.g. "ec2", "s3", etc.).
            key_id (str): AWS Access Key ID
            key (str): AWS Access Key
            region_name (str): AWS Region (e.g. "us-east-1").

        Returns:
            boto3 `Client` object.
        """
        session = boto3.session.Session()
        wrapper = rh.get_api_wrapper()
        client_args = wrapper.get_boto3_args(region_name, key_id, key, **kwargs)
        config= boto3.session.Config(
                    signature_version='s3v4',
                    s3={'addressing_style': 'path'},
                    max_pool_connections=25)
        client_args["config"] = config
        return session.client(service_name, **client_args)


class S3ResourceTabDelegate(TabExtensionDelegate):
    def should_display(self):
        return self.instance.resource_type.name == "s3_bucket"


@tab_extension(
    model=Resource, title="Browser", description="", delegate=S3ResourceTabDelegate
)
def browse_bucket(request, obj_id=None):

    resource = get_object_or_404(Resource, pk=obj_id)
    return render(
        request, "s3_file_manager/templates/tab.html", dict(resource=resource)
    )


@dashboard_extension(title="S3 Bucket Widget", description="S3 Bucket Widget")
def show_s3_browser_widget(request):
    """
    Get a list of buckets for the current user
    """
    up = get_current_userprofile()
    group_ids = [group.id for group in up.get_groups()]
    rt = ResourceType.objects.get(name="s3_bucket")
    buckets = (
        Resource.objects.filter(resource_type_id=rt.id)
        .filter(group_id__in=group_ids)
        .filter(lifecycle="ACTIVE")
        .order_by("-created")
    )
    bucket_names = [bucket.name for bucket in buckets]

    context = {"userprofile": up, "buckets": buckets, "bucket_names": bucket_names}

    return render(
        request, template_name="s3_file_manager/templates/widget.html", context=context
    )

@json_view
def s3_list_buckets(request):
    """
    Get a JSON list of buckets for the current user
    """
    up = get_current_userprofile()
    group_ids = [group.id for group in up.get_groups()]
    rt = ResourceType.objects.get(name="s3_bucket")
    buckets = (
        Resource.objects.filter(resource_type_id=rt.id)
        .filter(group_id__in=group_ids)
        .filter(lifecycle="ACTIVE")
        .order_by("-created")
    )
    bucket_info = [{"id":bucket.id, "name":bucket.name} for bucket in buckets]

    return {
        "bucket_info": bucket_info
    }

def s3_browser(request, resource_id):
    resource = get_object_or_404(Resource, pk=resource_id)
    aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)

    s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)

    state = {}
    s3_path = ""
    location = ""

    path_dirs = []
    dir_list = []
    folder_path = request.POST.get("path", None)
    flat = request.POST.get("flat", "False")

    flat = flat == "True"

    try:
      location_obj = s3_client.get_bucket_location(Bucket=resource.name)
      location = location_obj['LocationConstraint'] if not location_obj['LocationConstraint'] == None else "us-east-1"
    except Exception as e:
        logger.info(e)

    if folder_path:
        for p in folder_path.split("/"):
            if p:
                s3_path = f"{s3_path}{p}/"
                path_dirs.append({"name": p, "path": s3_path})

    s3_list = operations.get_folder_with_items(s3_client, resource.name, s3_path, location, flat)

    for dir_item in s3_list:
        dir_item["is_file"] = dir_item["key"][-1] != "/"
        if dir_item["is_file"] or not flat:
            dir_list.append(dir_item)
    dir_list = sorted(dir_list, key=lambda i: (i["is_file"], i["name"]))
    state.update(
        {
            "dir_list": dir_list,
            "path_dirs": path_dirs,
            "full_path": folder_path or "",
            "flat": flat,
        }
    )
    
    return render(
        request,
        "s3_file_manager/templates/s3_browser.html",
        dict(state=state, resource=resource, location=location),
    )

@json_view
def s3_browser_info(request, resource_id):
    resource = get_object_or_404(Resource, pk=resource_id)
    aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)

    s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)

    state = {}
    s3_path = ""
    location = ""

    path_dirs = []
    dir_list = []
    folder_path = request.POST.get("path", None)
    flat = request.POST.get("flat", "False")

    flat = flat == "True"

    try:
      location_obj = s3_client.get_bucket_location(Bucket=resource.name)
      location = location_obj['LocationConstraint'] if not location_obj['LocationConstraint'] == None else "us-east-1"
    except Exception as e:
        logger.info(e)

    if folder_path:
        for p in folder_path.split("/"):
            if p:
                s3_path = f"{s3_path}{p}/"
                path_dirs.append({"name": p, "path": s3_path})

    s3_list = operations.get_folder_with_items(s3_client, resource.name, s3_path, location, flat)

    for dir_item in s3_list:
        dir_item["is_file"] = dir_item["key"][-1] != "/"
        if dir_item["is_file"] or not flat:
            dir_list.append(dir_item)
    dir_list = sorted(dir_list, key=lambda i: (i["is_file"], i["name"]))
    state.update(
        {
            "dir_list": dir_list,
            "path_dirs": path_dirs,
            "full_path": folder_path or "",
            "flat": flat,
        }
    )
    
    return {
        "state": state,
        "resource": ResourceSerializer().resource_dict(resource),
        "location": location
    }

@json_view
def upload_item(request, resource_id):
    """
    Upload a single item
    """
    resource = get_object_or_404(Resource, pk=resource_id)
    folder_path = request.POST.get("path", None)
    aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
    s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)

    # Define the configuration rules
    portal = PortalConfig.get_current_portal(request)
    site_url = portal.site_url
    cors_configuration = {
        "CORSRules": [
            {
                "AllowedHeaders": ["Authorization"],
                "AllowedMethods": ["GET", "PUT"],
                "AllowedOrigins": [site_url],
                "ExposeHeaders": ["GET", "PUT"],
                "MaxAgeSeconds": 3000,
            }
        ]
    }

    # Set the CORS configuration
    s3_client.put_bucket_cors(
        Bucket=resource.name, CORSConfiguration=cors_configuration
    )
    key = f"{folder_path}${{filename}}"
    if key.startswith("/"):
        key = key[1:]

    response = s3_client.generate_presigned_post(resource.name, key, ExpiresIn=3600)

    rendered_form = ""
    for key, value in response["fields"].items():
        rendered_form += f'<input type="hidden" name="{key}" value="{value}" />'

    rendered_form += '<input type="file"   name="file" />'

    return {
        "title": "Upload File",
        "rendered_form": mark_safe(rendered_form),
        "action_url": response["url"],
        "use_ajax": True,
        "submit": "Upload to S3",
    }


# Upload a single item
@json_view
def upload_new_object(request, resource_id):
    """
    Upload a single item
    """
    try:
        resource = get_object_or_404(Resource, pk=resource_id)
        file_name = os.path.join(
            request.POST.get("path", None), request.POST.get("file_name", None)
        )
        bucket_name = request.POST.get("bucket_name", None)
        file = request.FILES.get("object_file", None)
        aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
        s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
        s3_client.put_object(Body=file, Bucket=bucket_name, Key=file_name)
        return {"status": True, "message": "Successfully Uploaded"}
    except Exception as e:
        error_message = e.args[0]
        return {"status": False, "message": error_message}


@json_view
def upload_folder(request, resource_id):
    """
    Upload an entire folder

    :param resource_id: The id of the s3 resource object
    """
    try:
        resource = get_object_or_404(Resource, pk=resource_id)
        bucket_name = request.POST.get("bucket_name", None)
        files = request.FILES
        folder_path = request.POST.get("folder_path")
        aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
        s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
        for file in files:
            key = request.POST.get(file + ".path")
            item = request.FILES.get(file)
            if folder_path:
                key = folder_path + key
            s3_client.put_object(Body=item, Bucket=bucket_name, Key=key)

        return {"status": True, "message": "Successfully Uploaded Folder"}

    except Exception as e:
        error_message = e.args[0]
        logger.error("Error occured in S3 XUI module")
        logger.error(error_message)
        return {"status": False, "message": error_message}


@json_view
def create_folder(request, resource_id):
    """
    Create a folder in an S3 bucket
    :param resource_id: the ID of a storage bucket resource object
    """
    try:
        resource = get_object_or_404(Resource, pk=resource_id)
        folder_path = os.path.join(
            request.POST.get("path", None), request.POST.get("folder_name", None)
        )
        bucket_name = request.POST.get("bucket_name", None)
        aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
        s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
        s3_client.put_object(Bucket=bucket_name, Key=(folder_path + "/"))
        return {"status": True, "message": "Successfully Created"}
    except Exception as e:
        error_message = e.args[0]
        return {"status": False, "message": error_message}


@json_view
def rename_object(request, resource_id):
    """
    Rename an object on S3

    :param resource_id: the ID of a storage bucket resource object
    """
    try:
        resource = get_object_or_404(Resource, pk=resource_id)
        old_object_name = os.path.join(
            request.POST.get("path", None), request.POST.get("old_object_name", None)
        )
        new_object_name = os.path.join(
            request.POST.get("path", None), request.POST.get("new_object_name", None)
        )
        bucket_name = request.POST.get("bucket_name", None)
        aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
        s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
        copy_source = {"Bucket": bucket_name, "Key": old_object_name}
        s3_client.copy_object(
            CopySource=copy_source, Bucket=bucket_name, Key=new_object_name
        )
        s3_client.delete_object(Bucket=bucket_name, Key=old_object_name)
        return {"status": True, "message": "Successfully Renamed"}
    except Exception as e:
        error_message = e.args[0]
        return {"status": False, "message": error_message}


@json_view
def get_versions(request, resource_id):
    """
    Get the versions of a given object

    :param resource_id: the ID of a storage bucket resource object
    """

    try:
        resource = get_object_or_404(Resource, pk=resource_id)
        aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
        key = request.POST.get("key")
        location = request.POST.get("location", None)
        s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, location)
        # get the region from the bucket
        s3rcf = CustomField.objects.get(name="s3_bucket_region")
        region = resource.attributes.get(field_id=s3rcf.id).str_value
        # Get a boto3 resource wrapper for "bucket"
        s3_bucket = aws.get_boto3_resource(region_name=region, service_name="s3")

        # Get the versions of an item
        versions = s3_bucket.Bucket(resource.name).object_versions.filter(Prefix=key)
        if s3_bucket.BucketVersioning(resource.name).status == "Enabled":
            response = []
            for version in versions:
                json_data = {
                    "is_latest": version.is_latest,
                    "Key": version.key,
                    "version_id": version.version_id,
                    "type": (version.key.split(".")[1] or "Undefined"),
                    "last_modified": version.last_modified.strftime(
                        "%B %d, %Y, %H:%M:%S"
                    ),
                    "size": round(version.size / 1000, 1) if version.size else 0,
                    "storage_class": version.storage_class.title(),
                    "download_url": s3_client.generate_presigned_url(
                        "get_object",
                        Params={
                            "Bucket": resource.name,
                            "Key": version.key,
                            "VersionId": version.version_id,
                        },
                        ExpiresIn=3600,
                    ),
                }
                response.append(json_data)
            return {"status": True, "message": "Successfully fetched", "data": response}
        return {"status": True, "message": "Versioning disabled", "data": []}

    except Exception as e:
        error_message = e.args[0]
        logger.error(error_message)
        return {"status": False, "message": error_message}


@json_view
def s3_enable_versioning(request, resource_id):
    """
    Enable versioning on a bucket

    :param resource_id: The ID of the resource with the file
    """
    try:
        resource = get_object_or_404(Resource, pk=resource_id)
        aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
        s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
        s3_client.put_bucket_versioning(
            Bucket=resource.name, VersioningConfiguration={"Status": "Enabled"}
        )
        return {"status": True, "message": "Successfully enabled"}
    except Exception as e:
        error_message = e.args[0]
        return {"status": False, "message": error_message}


@json_view
def download_item(request, resource_id):
    """
    Download a single item

    :param resource_id: The ID of the resource with the file
    """
    resource = get_object_or_404(Resource, pk=resource_id)
    aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
    location = request.POST.get("location", "")
    s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, location)
    file_path = request.POST.get("path", None)
    
    url = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": resource.name, "Key": f"{file_path}"},
        ExpiresIn=3600,
    )
    return {"url": mark_safe(f"{url}")}


# Delete a specific item
# There is an error occuring here
@json_view
def delete_item(request, resource_id):
    """
    Delete a given item

    :param resource_id: The ID of the resource with the file
    """
    resource = get_object_or_404(Resource, pk=resource_id)
    aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
    s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
    file_path = request.POST.get("all_files_path", [])
    jd = json.dumps(file_path)
    all_files_path = eval(json.loads(jd))
    files_to_delete = []
    for file_path in all_files_path:
        if not file_path["object_type"] == "Folder":
            files_to_delete.append(file_path["file_path"])
        else:
            all_folder_objects = s3_client.list_objects(
                Bucket=resource.name, Prefix=file_path["file_path"]
            )
            [
                files_to_delete.append(key)
                for key in [
                    obj["Key"] for obj in all_folder_objects.get("Contents", [])
                ]
            ]
    s3_client.delete_objects(
        Bucket=resource.name,
        Delete={"Objects": [{"Key": name} for name in files_to_delete]},
    )
    return s3_browser(request, resource_id)


@json_view
def promote_version(request, resource_id):
    """
    Promotes a specific version of a file to the latest.

    Copies the verision, then deletes the old refernced version.

    :param resource_id: The ID of the resource with the file
    """
    resource = get_object_or_404(Resource, pk=resource_id)
    aws = get_object_or_404(AWSHandler, pk=resource.aws_rh_id)
    s3_client = get_boto3_client(aws, "s3", aws.serviceaccount, aws.servicepasswd, None)
    key = request.POST.get("key")
    version_id = request.POST.get("version_id")
    bucket = resource.name
    copy_source = {"Bucket": resource.name, "Key": key, "VersionId": version_id}
    try:
        s3_client.copy_object(
            Bucket=bucket,
            CopySource=copy_source,
            Key=key,
        )
        s3_client.delete_object(Bucket=bucket, Key=key, VersionId=version_id)

        json_data = {
            "key": request.POST.get("key"),
            "version_id": request.POST.get("version_id"),
        }
        return {
            "status": True,
            "message": "Successfully promoted version",
            "data": json_data,
        }

    except Exception:
        logger.error(
            "An error occured in S3 XUI when attempting to promote a versioned item"
        )
        logger.error(Exception)
        raise Exception
