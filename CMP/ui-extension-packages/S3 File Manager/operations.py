import sys
import math

try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO


def get_folder_with_items(s3client, bucket_name, main_folder, bucket_location, flat=True):
    return_list = []
    delimiter = "/"
    try:
        if flat:
            delimiter = ""
        result = s3client.list_objects(
            Bucket=bucket_name, Prefix=main_folder, Delimiter=delimiter
        )
        result_files = (
            get_files(bucket_name, main_folder, result.get("Contents"), bucket_location, flat)
            if result.get("Contents")
            else []
        )
        result_folders = (
            get_folders(main_folder, result.get("CommonPrefixes"), True)
            if result.get("CommonPrefixes")
            else []
        )
        return_list.extend(result_files)  # return files and folders
        return_list.extend(result_folders)
    except Exception as e:
        print(
            "Error on line {}".format(
                sys.exc_info()[-1].tb_lineno), type(e).__name__, e
        )
    return return_list


def get_files(bucket_name, main_folder, result, bucket_location, flat, sort_a_z=True):
    try:
        files_list = []
        for obj in result:
            key = obj.get("Key")
            if key == main_folder:
                continue
            if key != None and "." in key:
                item_type = key.split(".")[-1]
            else:
                item_type = "Unknown"
            file_size = get_file_size(obj.get("Size"))
            file_dict = {
                "key": key,
                "url": key,
                "name": key,
                "last_modified": obj.get("LastModified").strftime("%B %d, %Y, %H:%M:%S"),
                "actual_last_modified": int(round(obj.get("LastModified").timestamp())),
                "size": file_size,
                "actual_size": obj.get("Size"),
                "storage_class": obj.get("StorageClass").title(),
                "item_type": item_type,
                "e_tag": obj.get('ETag'),
                "owner_name": obj['Owner'].get('DisplayName') if obj['Owner'].get('DisplayName') else obj['Owner'].get('ID'),
                "object_url": "https://{0}.s3.{1}.amazonaws.com/{2}".format(bucket_name, bucket_location,key.replace(" ", "+")),
                "s3_uri": "s3://{0}/{1}".format(bucket_name, key),
                "arn": "arn:aws:s3:::{0}/{1}".format(bucket_name, key),
            }
            file_name = key.split("/")[-1]
            if file_name and not flat:
                file_dict["name"] = file_name
            file_dict["path"] = key.replace(file_name, "")

            files_list.append(file_dict)
        return sorted(
            files_list, key=lambda k: str(k["key"]).lower(), reverse=not sort_a_z
        )
    except Exception as e:
        print(
            "Error on line {}".format(
                sys.exc_info()[-1].tb_lineno), type(e).__name__, e
        )


def get_folders(main_folder, result, sort_a_z):
    try:
        files_list = []
        for obj in result:
            item_type = "Folder"  # for show template
            url = obj.get("Prefix")
            files_list.append(
                {
                    "key": obj.get("Prefix"),
                    "url": url,
                    "name": obj.get("Prefix").split("/")[-2],
                    "item_type": item_type
                }
            )
        return sorted(
            files_list, key=lambda k: str(k["key"]).lower(), reverse=not sort_a_z
        )
    except Exception as e:
        print(
            "Error on line {}".format(
                sys.exc_info()[-1].tb_lineno), type(e).__name__, e
        )


def get_file_size(size_bytes):
   if size_bytes == 0:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 1)
   return "%s %s" % (s, size_name[i])
