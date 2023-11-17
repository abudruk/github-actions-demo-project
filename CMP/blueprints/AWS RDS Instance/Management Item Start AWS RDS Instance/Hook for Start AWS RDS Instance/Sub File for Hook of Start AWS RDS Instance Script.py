from common.methods import set_progress
from infrastructure.models import Environment
from resourcehandlers.aws.models import AWSHandler
from utilities.logger import ThreadLogger

logger = ThreadLogger(__name__)


def get_aws_rh_and_region(resource):
    # The AWS Handler ID and AWS region were stored as attributes
    # this service by a build/sync action.
    rh_aws_id = resource.aws_rh_id
    aws_region =  resource.aws_region
    rh_aws = None

    if rh_aws_id != "" or rh_aws_id is not None:
        rh_aws = AWSHandler.objects.get(id=rh_aws_id)

    if aws_region != "" or aws_region is not None:
        # this is deprecated, will be removed later
        env_id_cfv = resource.attributes.filter(field__name__startswith='aws_environment').first()
        
        if env_id_cfv is None:
            return aws_region, rh_aws
            
        env = Environment.objects.get(id=env_id_cfv.value)
        aws_region = env.aws_region

        if rh_aws is None:
            rh_aws = env.resource_handler.cast()

    return aws_region, rh_aws
    

    
def run(job, resource, logger=None, **kwargs):
    # The Environment ID and RDS Instance data dict were stored as attributes on
    # this service by a build action.
    rds_instance_identifier = resource.db_identifier

    # get aws region and resource handler object
    aws: AWSHandler
    region, aws, = get_aws_rh_and_region(resource)

    if aws is None or aws == "":
        return  "WARNING", f"RDS Instance {rds_instance_identifier} not found, it may have already been deleted", ""

    set_progress('Connecting to Amazon RDS')
    
    # get aws resource handler wrapper object
    wrapper = aws.get_api_wrapper()

    # initialize boto3 client
    client = aws.get_boto3_client(region, 'rds')

    job.set_progress('Starting RDS Instance {0} ...'.format(rds_instance_identifier))
    
    try:
        # fetch RDS Instance
        rds_rsp = client.describe_db_instances(DBInstanceIdentifier=rds_instance_identifier)['DBInstances'][0]
    except Exception as err:
        raise RuntimeError(err)
    
    if rds_rsp['DBInstanceStatus'] not in ["stopped"]:
        return "WARNING", f"RDS Instance {rds_instance_identifier} is not in stopped state, it may have already been started or in-process state.", ""
    
    
    if resource.db_cluster_identifier == "":
        try:
            rds_stop_resp = client.start_db_instance(
                            DBInstanceIdentifier=rds_instance_identifier
                        )['DBInstance']
        
        except Exception as err:
            raise RuntimeError(err)
        
        status = "DBInstanceStatus"
    else:
        try:
            rds_stop_resp = client.start_db_cluster(DBClusterIdentifier=resource.db_cluster_identifier)['DBCluster']
        except Exception as err:
            raise RuntimeError(err)
            
        status = "Status"
        
    # It takes awhile for the DB to be available.
    waiter = client.get_waiter('db_instance_available')
    waiter.config.max_attempts = 100  # default is 40 seconds.
    waiter.wait(DBInstanceIdentifier=rds_instance_identifier)
    
    resource.db_status = "available"
    resource.save()

    job.set_progress('RDS instance {0} started successfully.'.format(rds_instance_identifier))

    return 'SUCCESS', f'RDS instance {rds_instance_identifier} started successfully.', ''