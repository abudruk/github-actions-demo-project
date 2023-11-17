from common.methods import set_progress
from infrastructure.models import Environment
from resourcehandlers.aws.models import AWSHandler
from utilities.logger import ThreadLogger

logger = ThreadLogger(__name__)


def get_aws_rh_and_region(resource):
    rh_aws_id = resource.aws_rh_id
    aws_region =  resource.aws_region
    rh_aws = None

    if rh_aws_id != "" or rh_aws_id is not None:
        rh_aws = AWSHandler.objects.get(id=rh_aws_id)

    return aws_region, rh_aws
    

    
def run(job, resource, logger=None, **kwargs):
    # The Environment ID and PostgreSQL database data dict were stored as attributes on
    # this service by a build action.
    postgresql_instance_identifier = resource.db_identifier

    # get aws region and resource handler object
    aws: AWSHandler
    region, aws, = get_aws_rh_and_region(resource)

    if aws is None or aws == "":
        return  "WARNING", f"PostgreSQL database instance {postgresql_instance_identifier} not found, it may have already been deleted", ""

    set_progress('Connecting to Amazon RDS')
    
    # initialize boto3 client
    client = aws.get_boto3_client(region, 'rds')

    job.set_progress('Starting PostgreSQL database instance {0} ...'.format(postgresql_instance_identifier))
    
    try:
        # fetch PostgreSQL database instance
        postgresql_rsp = client.describe_db_instances(DBInstanceIdentifier=postgresql_instance_identifier)['DBInstances'][0]
    except Exception as err:
        raise RuntimeError(err)
    
    if postgresql_rsp['DBInstanceStatus'] not in ["stopped"]:
        return "WARNING", f"PostgreSQL database instance {postgresql_instance_identifier} is not in stopped state, it may have already been started or in-process state.", ""
        
    try:
        client.start_db_instance(
                        DBInstanceIdentifier=postgresql_instance_identifier
                    )
    
    except Exception as err:
        raise RuntimeError(err)
    
    # It takes awhile for the DB to be available.
    waiter = client.get_waiter('db_instance_available')
    waiter.config.max_attempts = 100  # default is 40 seconds.
    waiter.wait(DBInstanceIdentifier=postgresql_instance_identifier)
    
    resource.db_status = "available"
    resource.save()

    job.set_progress('PostgreSQL database instance {0} started successfully.'.format(postgresql_instance_identifier))

    return 'SUCCESS', f'PostgreSQL database instance {postgresql_instance_identifier} started successfully.', ''