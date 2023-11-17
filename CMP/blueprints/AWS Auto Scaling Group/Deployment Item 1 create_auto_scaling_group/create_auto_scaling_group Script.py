"""
This CloudBolt plug-in creates auto-scaling group in VPC selected or created in
a region along with the needed load balancer. Instances will be deployed in only
selected zones. Auto-scaling group is attached to a created Application
Load Balancer. Scaling Policy is also created as per user inputs of
metric type and target value.

This plug-in creates following resources:
- Autoscaling Group
- Launch Template
- Load Balancer
- Target Group
- Listener
- Scaling Policy
"""
import re

import os
import time

from ast import literal_eval
from c2_wrapper import create_custom_field
from common.methods import set_progress
from infrastructure.models import CustomField, Environment
from orders.models import CustomFieldValue
from utilities.logger import ThreadLogger
from resourcehandlers.aws.models import AWSHandler

logger = ThreadLogger(__name__)


def add_name_to_resource(rh, region, resource_id, resource_name):
    ec2_client = get_boto3_client(rh, 'ec2', region)
    response = ec2_client.create_tags(
        Resources=[resource_id, ],
        Tags=[
            {
                'Key': 'Name',
                'Value': resource_name
            },
        ]
    )
    return response


def get_or_create_custom_fields():
    string_cfs = ["aws_launch_template_id", "aws_launch_template_name",
                  "aws_launch_template_ami_id",
                  "aws_launch_template_instance_type", "aws_lb_arn",
                  "aws_lb_name", "aws_lb_dns_name", "aws_target_group_name",
                  "aws_target_group_arn", "aws_listener_arn", "aws_asg_name",
                  "aws_scaling_policy_name", "aws_scaling_policy_metric_type",
                  ]
    int_cfs = ["aws_scaling_policy_min_size", "aws_scaling_policy_max_size",
               "aws_scaling_policy_desired_capacity",
               "aws_asg_health_check_period", "aws_scaling_policy_target_value",
               "aws_asg_environment_id"]
    multi_cfs = ["aws_asg_security_groups", "aws_asg_subnets"]

    create_custom_fields(string_cfs, "STR")
    create_custom_fields(int_cfs, "INT")
    create_custom_fields(multi_cfs, "MULTI")


def create_custom_fields(cfs, cf_type, description="Created by AWS ASG BP"):
    for cf in cfs:
        label = cf.replace("aws_", "").replace("_", " ").title()
        if cf_type != "MULTI":
            create_custom_field(cf, label, cf_type, required=True,
                                description=description, show_as_attribute=True)
        else:
            create_custom_field(cf, label, "STR", required=True,
                                description=description, allow_multiple=True,
                                show_as_attribute=True)


def generate_options_for_metric_type(control_value=None, **kwargs):
    return [
        ('ASGAverageCPUUtilization',
         'Average CPU Utilization (Target Value is in %)'),
        ('ASGAverageNetworkIn', 'Average Network In (Target Value is in %)'),
        ('ASGAverageNetworkOut', 'Average Network Out (Target Value is in %)'),
        ('ALBRequestCountPerTarget',
         'Request Count Per Target (Target Value is multiple of 10)'),
    ]


def get_boto3_client(rh: AWSHandler, service, region=None):
    client = rh.get_boto3_client(region, service)
    return client


def generate_options_for_itype(control_value=None, **kwargs):
    if not control_value:
        return [("", "------First select an Environment------")]
    env = Environment.objects.get(id=control_value)
    cfvs = env.get_cfvs_for_custom_field("instance_type")
    return [cfv.value for cfv in cfvs]


def generate_options_for_key_name(control_value=None, **kwargs):
    if not control_value:
        return [("", "------First select an Environment------")]
    env = Environment.objects.get(id=control_value)
    cfvs = env.get_cfvs_for_custom_field("key_name")
    return [cfv.value for cfv in cfvs]


def generate_options_for_env_id(field, **kwargs):
    group = kwargs.get("group")
    options = [("", "------Select an Environment------")]
    if group:
        environments = group.get_available_environments()
        for env in environments:
            if env.resource_handler.resource_technology.slug == "aws":
                logger.debug(f'Appending {env.name} with ID: {env.id} to opts')
                options.append((env.id, env.name))
    return options


def generate_options_for_subnets(control_value=None, **kwargs):
    if not control_value:
        return [("", "------First select an Environment------")]
    env = Environment.objects.get(id=control_value)
    options = []
    networks = list(env.networks().keys())
    for network in networks:
        option = (network.network, network.name)
        if option not in options:
            options.append(option)
    return {
        'options': options,
    }


def generate_options_for_ami_image(control_value=None, **kwargs):
    if not control_value:
        return [("", "------First select an Environment------")]
    env = Environment.objects.get(id=control_value)
    options = []
    os_builds = env.os_builds.all()
    for osb in os_builds:
        rh = env.resource_handler
        osba = osb.osba_for_resource_handler(rh, env)
        option = (osba.amazonmachineimage.ami_id, osba.os_build.name)
        if option not in options:
            options.append(option)
    return {
        'options': options,
    }


def generate_options_for_security_groups(control_value=None, **kwargs):
    if not control_value:
        return [("", "------First select an Environment------")]
    env = Environment.objects.get(id=control_value)

    return env.sec_groups


def run(job, *args, **kwargs):
    # Action Inputs gathering
    env_id = "{{env_id}}"
    ec2_key_name = "{{key_name}}"
    instance_type = "{{itype}}"
    subnets = eval_inputs("{{subnets}}")  # Subnets will be passed as a list
    ami_id = "{{ami_image}}"
    sg_names = eval_inputs("{{security_groups}}")  # SGs will be passed as list
    asg_name = "{{ auto_scaling_group_name }}"
    min_size = int('{{ min_size }}')
    max_size = int('{{ max_size }}')
    desired_capacity = int('{{ desired_capacity }}')
    health_check_period = int('{{ health_check_period }}')
    metric_type = '{{ metric_type }}'
    target_value = int('{{ target_value }}')
    logger.debug(f'env_id: {env_id}, ec2_key_name: {ec2_key_name}, '
                 f'instance_type: {instance_type}, subnets: {subnets}, '
                 f'ami_id: {ami_id}, sg_ids: {sg_names}, asg_name: {asg_name}, '
                 f'min_size: {min_size}, max_size: {max_size}, '
                 f'desired_capacity: {desired_capacity}, '
                 f'health_check_period: {health_check_period}, '
                 f'metric_type: {metric_type}, target_value: {target_value}')

    get_or_create_custom_fields()
    resource = kwargs.get('resource')
    env = Environment.objects.get(id=env_id)
    rh = env.resource_handler.cast()
    sg_ids = get_sg_ids_from_names(env, rh, sg_names)
    resource.aws_asg_environment_id = env.id
    resource.save()

    region = env.aws_region

    # Making sure min_size <= desired_capacity < max_size
    min_size = desired_capacity if min_size > desired_capacity else min_size
    max_size = desired_capacity + 1 if max_size < desired_capacity else max_size

    # Create the launch template
    create_launch_template(rh, asg_name, region, ami_id, instance_type, sg_ids,
                           ec2_key_name, resource)

    # Create the load balancer
    create_load_balancer(rh, region, asg_name, env.vpc_id, subnets, sg_ids,
                         resource)

    # Create the auto-scaling group
    create_auto_scaling_group(rh, region, asg_name, min_size, max_size,
                              desired_capacity, health_check_period, subnets,
                              metric_type, target_value, resource)


    return "SUCCESS", ("Auto Scaling Group with scaling Policy is created "
                       "succcessfully "), ""


def eval_inputs(value):
    if isinstance(value, str) and (re.match(r"\[.*]", value) or
                                   re.match(r"(True|False)$", value)):
        value = literal_eval(value)
    return value


def create_launch_template(rh, asg_name, region, ami_id, instance_type,
                           sg_ids, ec2_key_name, resource):
    launch_template_name = "LT-" + asg_name
    set_progress("Creating EC2 Launch Template")
    ec2_client = get_boto3_client(rh, 'ec2', region)
    response = ec2_client.create_launch_template(
        LaunchTemplateName=launch_template_name,
        LaunchTemplateData={
            'ImageId': ami_id,
            'InstanceType': instance_type,
            'SecurityGroupIds': sg_ids,
            'KeyName': ec2_key_name,
        }
    )
    launch_template_id = response['LaunchTemplate']['LaunchTemplateId']
    resource.aws_launch_template_id = launch_template_id
    resource.aws_launch_template_name = launch_template_name
    resource.aws_launch_template_ami_id = ami_id
    resource.aws_launch_template_instance_type = instance_type
    resource.save()
    add_multi_cfs(resource, sg_ids, "aws_asg_security_groups")
    return


def create_auto_scaling_group(rh, region, asg_name, min_size, max_size,
                              desired_capacity, health_check_period, subnet_ids,
                              metric_type, target_value, resource):
    """
    Creates an auto-scaling group with the given parameters. Also waits for
    instances to be created and then adds names to them. Then creates a scaling
    policy for the auto-scaling group.
    """
    autoscaling_client = get_boto3_client(rh, 'autoscaling', region)
    set_progress(
        "Creating autoscaling group '{}'".format(asg_name))
    response = autoscaling_client.create_auto_scaling_group(
        AutoScalingGroupName=asg_name,
        LaunchTemplate={
            'LaunchTemplateId': resource.aws_launch_template_id
        },
        MinSize=min_size,
        MaxSize=max_size,
        DesiredCapacity=desired_capacity,
        HealthCheckGracePeriod=health_check_period,
        VPCZoneIdentifier=",".join(subnet_ids),
    )

    instance_ids = wait_for_asg_instances(autoscaling_client, asg_name,
                                          desired_capacity)

    add_instance_names(rh, region, asg_name, instance_ids)

    create_auto_scaling_policy(autoscaling_client, asg_name, min_size,
                               max_size, desired_capacity, metric_type,
                               target_value, resource)

    resource.aws_asg_name = asg_name
    resource.aws_asg_health_check_period = health_check_period
    add_multi_cfs(resource, subnet_ids, "aws_asg_subnets")
    autoscaling_client.attach_load_balancer_target_groups(
        AutoScalingGroupName=asg_name,
        TargetGroupARNs=[resource.aws_target_group_arn]
    )


def wait_for_asg_instances(auto_scaling_client, asg_name, desired_capacity):
    time.sleep(3)  # Initial waiting period

    flag = True
    while flag:
        set_progress("Fetching instances from Auto Scaling Group")
        as_resp = auto_scaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[asg_name, ], )
        instance_ids = [inst['InstanceId'] for inst in
                        as_resp['AutoScalingGroups'][0]['Instances']]
        if len(instance_ids) == desired_capacity:  # Making sure all are fetched
            flag = False
            set_progress(
                f"Fetched {len(instance_ids)} instances from ASG...")
        else:
            time.sleep(3)
    return instance_ids


def add_instance_names(rh: AWSHandler, region, asg_name, instance_ids):
    ec2_resource = rh.get_boto3_resource(region, 'ec2')
    instance_number = 1
    for instance_id in instance_ids:
        flag = True
        while flag:
            current_instance = ec2_resource.Instance(instance_id)
            set_progress(
                f"Waiting for instance {instance_id} to start running...")
            time.sleep(5)
            if current_instance.state['Name'] == 'running':
                flag = False
                set_progress(
                    f"Instance {instance_id} is now in running state...")
                time.sleep(5)  # Sleeping for another 5 secs for precaution

        instance_name = f"{asg_name}-instance-{instance_number}"
        add_name_resp = add_name_to_resource(rh, region, instance_id,
                                             instance_name)
        instance_number += 1


def create_load_balancer(rh, region, base_name, vpc_id, subnet_ids: list,
                         sg_ids: list, resource):
    # Create AWS Load Balancer for region. Also create a target group and
    # listener for the load balancer.
    elbv_client = get_boto3_client(rh, 'elbv2', region)

    load_balancer_name = f'LoadBalancer-{base_name}'
    # Loadbalancer name can only contain Alphnumeric character and hyphen('-')
    load_balancer_name = "".join([alphabet for alphabet in load_balancer_name if
                                  alphabet.isalnum() or alphabet == "-"])
    set_progress(
        f"Creating load balancer '{load_balancer_name}' for region {region}")

    resp_alb = elbv_client.create_load_balancer(
        Name=load_balancer_name,
        Subnets=subnet_ids,
        SecurityGroups=sg_ids,
        Scheme='internet-facing',
        Type='application',
        IpAddressType='ipv4',
    )

    load_balancer_arn = resp_alb['LoadBalancers'][0]['LoadBalancerArn']
    load_balancer_name = resp_alb['LoadBalancers'][0]['LoadBalancerName']
    lb_dns_name = resp_alb['LoadBalancers'][0]['DNSName']

    resource.aws_lb_arn = load_balancer_arn
    resource.aws_lb_name = load_balancer_name
    resource.aws_lb_dns_name = lb_dns_name
    resource.save()

    # Create the target group
    create_target_group(elbv_client, region, base_name, vpc_id, resource)

    # Create the listeners
    create_listeners(elbv_client, resource)
    wait_for_lb_active(elbv_client, load_balancer_arn)


def wait_for_lb_active(elbv_client, load_balancer_arn):
    elbv_client.describe_load_balancers(LoadBalancerArns=[load_balancer_arn])
    flag = True
    while flag:
        set_progress("Waiting for load balancer to be active")
        response = elbv_client.describe_load_balancers(
            LoadBalancerArns=[load_balancer_arn])
        if response['LoadBalancers'][0]['State']['Code'] == 'active':
            flag = False
            set_progress("Load balancer is now active")
        else:
            time.sleep(3)


def create_target_group(elbv_client, region, base_name, vpc_id, resource):
    tg_name = f'TG-{base_name}'
    set_progress(f"Creating target group '{tg_name}' for region '{region}'")
    # TargetGroup name can only contain Alphnumeric character and hyphen('-')
    tg_name = "".join([alphabet for alphabet in tg_name if
                       alphabet.isalnum() or alphabet == "-"])
    resp_tg = elbv_client.create_target_group(Name=tg_name, Port=443,
                                              Protocol='HTTPS', VpcId=vpc_id,
                                              Matcher={'HttpCode': "200,302"})
    target_group_arn = resp_tg['TargetGroups'][0]['TargetGroupArn']
    resource.aws_target_group_name = tg_name
    resource.aws_target_group_arn = target_group_arn
    resource.save()

    return


def create_listeners(elbv_client, resource):
    # Listener for HTTPS port 443
    set_progress("Creating listeners for load balancer")
    """
    443 listener requires SSL cert, commenting out for now. 
    elbv_client.create_listener(
        DefaultActions=[
            {
                'TargetGroupArn': target_group_arn,
                'Type': 'forward',
            },
        ],
        LoadBalancerArn=load_balancer_arn,
        Port=443,
        Protocol='HTTPS',
        Certificates=[
        ],
    )
    """
    # Listener for HTTP port 80 Note:- Forwarding HTTP traffic to  HTTPS URL
    response = elbv_client.create_listener(
        DefaultActions=[
            {
                'Type': 'redirect',
                'RedirectConfig': {
                    'Protocol': 'HTTPS',
                    'Port': '443',
                    'Host': '#{host}',
                    'Path': '/#{path}',
                    'Query': '#{query}',
                    'StatusCode': 'HTTP_302'
                },
            },
        ],
        LoadBalancerArn=resource.aws_lb_arn,
        Port=80,
        Protocol='HTTP',
    )
    resource.aws_listener_arn = response['Listeners'][0]['ListenerArn']
    resource.save()


def create_auto_scaling_policy(autoscaling_client, asg_name, min_size,
                               max_size, desired_capacity, metric_type,
                               target_value, resource):
    scaling_policy_name = "SP-" + asg_name

    temp_target_value = int(target_value) * 10 if metric_type in [
        "ALBRequestCountPerTarget"] else target_value

    if metric_type == "ALBRequestCountPerTarget":
        lb_arn = resource.aws_lb_arn
        target_group_arn = resource.aws_target_group_arn
        resource_label = f'''{"/".join(lb_arn.split("/")[1:])}
        /targetgroup/{"/".join(target_group_arn.split("/")[1:])}'''
        # optimal average request cnt per instance during any 1 minute interval
        target_value = target_value * 10
        predefined_metric_specification = {'PredefinedMetricType': metric_type,
                                           'ResourceLabel': resource_label}
        set_progress("finally attaching Load Balancer with Auto Scaling Group")
        resp = autoscaling_client.attach_load_balancer_target_groups(
            AutoScalingGroupName=asg_name,
            TargetGroupARNs=[target_group_arn], )
    else:
        predefined_metric_specification = {'PredefinedMetricType': metric_type}

    autoscaling_client.put_scaling_policy(
        AutoScalingGroupName=asg_name,
        PolicyName=scaling_policy_name,
        PolicyType='TargetTrackingScaling',
        AdjustmentType='ChangeInCapacity',
        TargetTrackingConfiguration={
            'PredefinedMetricSpecification': predefined_metric_specification,
            'TargetValue': target_value
        },
    )

    set_progress("Target Value is set as '{}'".format(temp_target_value))
    set_progress(
        f"Scaling Configuration is set as Minimum Size : {min_size}, "
        f"Maximum Size : {max_size}, Desired Capacity : {desired_capacity}"
    )

    resource.aws_scaling_policy_name = scaling_policy_name
    resource.aws_scaling_policy_metric_type = metric_type
    resource.aws_scaling_policy_min_size = min_size
    resource.aws_scaling_policy_max_size = max_size
    resource.aws_scaling_policy_desired_capacity = desired_capacity
    resource.aws_scaling_policy_target_value = temp_target_value
    resource.save()


def add_multi_cfs(resource, values: list, field_name):
    cfv_manager = resource.get_cfv_manager()
    field = CustomField.objects.get(name=field_name)
    for value in values:
        cfv, _ = CustomFieldValue.objects.get_or_create(field=field,
                                                        value=value)
        cfv_manager.add(cfv)


def get_sg_ids_from_names(env, rh, sg_names: list):
    ec2_client = get_boto3_client(rh, 'ec2', env.aws_region)
    sg_ids = []
    for sg_name in sg_names:
        sg_resp = ec2_client.describe_security_groups(
            Filters=[
                {
                    'Name': 'group-name',
                    'Values': [sg_name, ]
                },
            ],
        )
        sg_ids.append(sg_resp['SecurityGroups'][0]['GroupId'])
    return sg_ids


def get_aws_tags(resource):
    """
    A helper function to get the tags from the resource to pass to the Boto3
    calls.

    Usage:
    - Create Parameters in CloudBolt where the name starts with "aws_tag_"
    - Add these parameters to the Blueprint
    - Call this method to get the AWS tags, and pass them to the Boto3 calls.
    """
    cfv_manager = resource.get_cfv_manager()
    cfvs = cfv_manager.filter(field__name__startswith="aws_tag_")
    tags = []
    for cfv in cfvs:
        tag = {'Key': cfv.field.label, 'Value': cfv.value}
        tags.append(tag)
    return tags