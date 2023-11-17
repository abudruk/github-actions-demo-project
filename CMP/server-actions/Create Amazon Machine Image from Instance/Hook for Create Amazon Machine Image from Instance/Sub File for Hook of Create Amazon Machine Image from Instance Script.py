"""
Plugin creates an Amazon Machine Image from an EC2 instance. Server must be
powered off.  This action is intended to be a Server Action and the name of the
new AMI is specified at run time.
"""
from common.methods import set_progress
from infrastructure.models import Server


def run(job, logger=None):
    server = job.server_set.first()
    instance_id = server.resource_handler_svr_id
    env = server.environment
    aws = server.resource_handler.cast()

    set_progress("Preparing to create an AMI from EC2 instance {}"
                 .format(instance_id), logger, job)

    # Power off VM (optional)
    if server.power_status != "POWEROFF":
        return "FAILURE", "", "Server must be powered off first."

    # Connect to AWS
    set_progress("Connecting to EC2 region {}.".format(env.aws_region), logger, job)
    aws.connect_ec2(e.aws_region)
    ec2 = aws.resource_technology.work_class.ec2

    # Create AMI from instance
    # http://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/Creating_EBSbacked_WinAMI.html
    ec2.create_image(instance_id, name='{{ name_of_new_ami }}', description='Created via CloudBolt')
    return "","",""