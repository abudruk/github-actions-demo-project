from infrastructure.models import Environment

def connect_to_redshift(env):
    """
    Return boto connection to the redshift in the specified environment's region.
    """
    rh: AWSHandler = env.resource_handler.cast()

    # get aws client object
    client = rh.get_boto3_client(env.aws_region, 'redshift')
    return client


def run(resource, *args, **kwargs):
    cf_value = resource.get_cf_values_as_dict()
    env_id = cf_value.get("env_id", "")

    if env_id == "":
        return "SUCCESS", f"Redshift cluster {resource.name} deleted successfully", ""
        
    env = Environment.objects.get(id=env_id)
    client = connect_to_redshift(env)

    try:
        client.delete_cluster(ClusterIdentifier=resource.name,SkipFinalClusterSnapshot=True)
    except Exception as error:
        return "FAILURE", "", f"{error}"
    
    return "SUCCESS", f"Redshift cluster {resource.name} deleted successfully", ""