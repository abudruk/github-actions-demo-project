"""
This CloudBolt plug-in creates auto scaling group in VPC selected or created in a region
Instances will be deployed in only selected zones.
Auto scaling group is also attached with the existing Application Load Balancer provided.
Scaling Policy is also created as per user inputs of metric type and target value.
"""
from common.methods import set_progress
from resourcehandlers.aws.models import AWSHandler
from infrastructure.models import Server,CustomField
from django.conf import settings
from servicecatalog.models import BlueprintServiceItem,ServiceBlueprint
from resources.models import Resource
import ast,time,boto3,base64,json,os,random

def add_name_to_resource(**kwargs):
    client = kwargs.get('client')
    res_id = str(kwargs.get('resource_id'))
    res_name = kwargs.get('resource_name')
    response = client.create_tags(
    Resources=[res_id,],
    Tags=[ 
        {
            'Key': 'Name',
            'Value': res_name
        },
    ]
    )
    return response
    
def get_or_create_custom_fields():
    CustomField.objects.get_or_create(
        name='scaling_policy_name',
        defaults={
            "label": 'Scaling Policy Name',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the AWS Auto Scaling Groups blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='metric_type',
        defaults={
            "label": 'Metric type of Auto Scaling Group',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the AWS Auto Scaling Groups blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='target_value',
        defaults={
            "label": 'Target Value of Metric',
            "type": 'INT',
            'show_as_attribute': True,
            "description": 'Used by the AWS Auto Scaling Groups blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='launch_template_name',
        defaults={
            "label": 'Launch template name',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the AWS Auto Scaling Groups blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='scaling_properties',
        defaults={
            "label": 'Scaling properties',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the AWS Auto Scaling Groups blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='health_check_period',
        defaults={
            "label": 'Health Check Grace Period',
            "type": 'INT',
            'show_as_attribute': True,
            "description": 'Used by the AWS Auto Scaling Groups blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='auto_scaling_group_name',
        defaults={
            "label": 'Auto Scaling Group Name',
            "type": 'STR',
            'show_as_attribute': False,
            "description": 'Used by the HA Architecture blueprint'
        }
    )
    CustomField.objects.get_or_create(
    name='asg_metric_type',
    defaults={
        "label": 'Metric Type of Auto Scaling Group',
        "type": 'STR',
        'show_as_attribute': False,
        "description": 'Used by the HA Architecture blueprint'
    }
    )
    CustomField.objects.get_or_create(
    name='asg_policy_targetvalue',
    defaults={
        "label": 'Target Value of Scaling Policy',
        "type": 'STR',
        'show_as_attribute': False,
        "description": 'Used by the HA Architecture blueprint'
    }
    )
    CustomField.objects.get_or_create(
    name='launch_template_id',
    defaults={
        "label": 'Launch Template Id',
        "type": 'STR',
        'show_as_attribute': False,
        "description": 'Used by the HA Architecture blueprint'
    }
    )
    CustomField.objects.get_or_create(
        name='key_name',
        defaults={
            "label": 'Key Name',
            "type": 'STR',
            'show_as_attribute': True,
            "description": "Used by the AWS Auto Scaling Group"
        }
    )
    CustomField.objects.get_or_create(
        name='key_file_name',
        defaults={
            "label": 'PEM filename',
            "type": 'STR',
            'show_as_attribute': True,
            "description": "Used by the AWS Auto Scaling Group"
        }
    )
    CustomField.objects.get_or_create(
        name='ha_instance_type',
        defaults={
            "label": 'Instance Type',
            "type": 'STR',
            'show_as_attribute': True,
            "description": "Used by the AWS Auto Scaling Group"
        }
    )
    CustomField.objects.get_or_create(
        name='ec2_key_name',
        defaults={
            "label": 'EC2 Key Name',
            "type": 'STR',
            'show_as_attribute': True,
            "description": "Used by the HA Architecture blueprint"
        }
    )
    CustomField.objects.get_or_create(
        name='ami_id',
        defaults={
            "label": 'Ami id',
            "type": 'STR',
            'show_as_attribute': True,
            "description": "Used by the HA Architecture blueprint"
        }
    )
    CustomField.objects.get_or_create(
        name='instance_type',
        defaults={
            "label": 'Instance Type',
            "type": 'STR',
            'show_as_attribute': True,
            "description": "Used by the HA Architecture blueprint"
        }
    )

def get_parent_bp(**kwargs):
    current_bp = kwargs.get('current_bp')
    bp_service_item = BlueprintServiceItem.objects.filter(sub_blueprint=current_bp, blueprint__status="ACTIVE").prefetch_related("blueprint").last()
    if bp_service_item:
        return ServiceBlueprint.objects.get(id=bp_service_item.blueprint_id) 
    return ServiceBlueprint.objects.filter(name__icontains = "CloudBolt HA Deployment on AWS").first()
    
def generate_options_for_metric_type(control_value=None, **kwargs):
    return [
            ('ASGAverageCPUUtilization', 'Average CPU Utilization (Target Value is in %)'),
            ('ASGAverageNetworkIn', 'Average Network In (Target Value is in %)'),
            ('ASGAverageNetworkOut', 'Average Network Out (Target Value is in %)'),
            ('ALBRequestCountPerTarget', 'Request Count Per Target (Target Value is multiple of 10)'),
        ]


def get_boto3_client(aws_id, service, region=None):
    try:
        rh = AWSHandler.objects.get(id=aws_id)
        wrapper = rh.get_api_wrapper()
    except Exception:
        return

    # See http://boto3.readthedocs.io/en/latest/guide/configuration.html#method-parameters
    client = wrapper.get_boto3_client(
        service,
        rh.serviceaccount,
        rh.servicepasswd,
        region
    )
    return client

def match_version_for_image(**kwargs):
    version = kwargs.get("Version")
    data = kwargs.get("data")
    pattern = r"^([v2022]+[\.]+[0-9]+[\.]+[0-9])$"
    version_list = []
    for item in data.split(" "):
        val = re.match(pattern,item)
        if val:
            if val.group() == version:
                return True
    return False

def get_key_names(**kwargs):
    """
        This funtions returns all key name in the provided region
    """
    region = kwargs.get("region")
    rh_id = kwargs.get("rh_id")
    rh = AWSHandler.objects.get(id=rh_id)
    wrapper = rh.get_api_wrapper()
    client = wrapper.get_boto3_client('ec2', rh.serviceaccount, rh.servicepasswd , region)
    key_resp = client.describe_key_pairs()
    kp_list = []
    for key in key_resp['KeyPairs']:
        kp_list.append(key['KeyName'])
    return kp_list
    
def generate_options_for_version(server=None, **kwargs):
    return [("","-- Select Cloudbolt Application Version --"),("v2022.3.1","CloudBolt v2022.3.1")] #,("v2022.2.4","CloudBolt v2022.2.4")] #,("2022.2.3","CloudBolt 2022.2.3")]
    
def get_ami_id(**kwargs):
    """
        This function returns AMI ID of image for provided version in respective region
    """
    CB_images = kwargs.get("CB_images")
    Version = kwargs.get("Version")
    for cb_img in CB_images:
            data1 = cb_img['Name']
            data2 = cb_img['ImageLocation']
            if match_version_for_image(data=data1,Version=Version) or match_version_for_image(data=data2,Version=Version):
                Ami_ID = cb_img['ImageId']
                return Ami_ID
    return ""

def get_ami_id_of_version_for_region(**kwargs):
    """
        This function returns AMI ID for the selected cloudbolt version
    """
    region = kwargs.get("region")
    version = kwargs.get("Version")
    region_version_amiid_dict = {
        'af-south-1': {'v2022.3.1': 'ami-03719d1fbeb9da755'},
        'ap-east-1': {'v2022.3.1': 'ami-03719d1fbeb9da755'},
        'ap-northeast-1': {'v2022.2.4': 'ami-0725bcc3474c926ba','v2022.3.1': 'ami-03bc3591f7fd91d8d'},
        'ap-northeast-2': {'v2022.2.4': 'ami-09d89e30483e1080e','v2022.3.1': 'ami-0be13f15d4f651507'},
        'ap-south-1': {'v2022.2.4': 'ami-0cc424ce0ddf2d285','v2022.3.1': 'ami-03719d1fbeb9da755'},
        'ap-southeast-1': {'v2022.2.4': 'ami-0df34fbd924a62263','v2022.3.1': 'ami-0a3b02d4b77cc5161'},
        'ap-southeast-2': {'v2022.2.4': 'ami-01215893fc036adb7','v2022.3.1': 'ami-0edee907b004736fc'},
        'ca-central-1': {'v2022.2.4': 'ami-09ee342874e7ae963','v2022.3.1': 'ami-06f850e16039b5296'},
        'eu-central-1': {'v2022.2.4': 'ami-037468687dd008ae3','v2022.3.1': 'ami-0aaeb417b1034a534'},
        'eu-north-1': {'v2022.2.4': 'ami-09ff07cb2c3174ba3','v2022.3.1': 'ami-02e1d0b0f4bdb0c0e'},
        'eu-south-1': {'v2022.3.1': 'ami-03719d1fbeb9da755'},
        'eu-west-1': {'v2022.2.4': 'ami-028a2fa63d28976d1','v2022.3.1': 'ami-08556166e6ae44760'},
        'eu-west-2': {'v2022.2.4': 'ami-0740c6fdcb52c614f','v2022.3.1': 'ami-0c82691c7f5251c89'},
        'eu-west-3': {'v2022.2.4': 'ami-0bc9af189339278f2','v2022.3.1': 'ami-02ef466f89cc54e0c'},
        'me-south-1': {'v2022.3.1': 'ami-03719d1fbeb9da755'},
        'sa-east-1': {'v2022.2.4': 'ami-04657337e9cbf4d99','v2022.3.1': 'ami-08bad52c29afc802c'},
        'us-east-1': {'v2022.2.4': 'ami-0f724ad3af1e421ed','v2022.3.1': 'ami-09402de1ae92de195'},
        'us-east-2': {'v2022.2.4': 'ami-0096152d5f12aeaef','v2022.3.1': 'ami-0d2e8d0c58ea3f3a8'},
        'us-west-1': {'v2022.2.4': 'ami-0230e6843f029ed11','v2022.3.1': 'ami-02046625782448d1f'},
        'us-west-2': {'v2022.2.4': 'ami-01269d45b274013a9','v2022.3.1': 'ami-0e3d6b40df655742b'}
    }
    return region_version_amiid_dict[region][version]
    """
    # Following pieces of code dynamically generates "region_version_amiid_dict". But as it iterartes through all the images in the provided region, it adds overhead load to order page.
    # This code may need fix as there are changes in code over period of developement
    region_list = [region]
    rh_id = kwargs.get("rh_id")
    rh = AWSHandler.objects.get(id=rh_id)
    region_version_amiid_dict = {}
    version_list = ["v2022.3.1","v2022.2.4","2022.2.3"]
    for region in region_list:
        client = boto3.client('ec2',aws_access_key_id=rh.serviceaccount,aws_secret_access_key=rh.servicepasswd,region_name=region)
        try:
            images = client.describe_images(Filters=[{"Name": "architecture", "Values": ["x86_64"]}, {"Name": "state", "Values": ["available"]}, ] )
            CB_images = [img for img in images["Images"] if "CloudBolt" in img['ImageLocation']]
            if len(CB_images) != 0:
         	    temp = {}
         	    for version in version_list:
         	        ami_id = get_ami_id(CB_images=CB_images,Version=Version)
         		    temp[version]=ami_id
            region_version_amiid_dict[region] = temp
    """
   
def get_instance_location_dict(**kwargs):
    raw_list = kwargs.get("raw_list")
    instance_locations_dict = {}
    if len(raw_list)==1 and raw_list[0]=="":
        return instance_locations_dict
    if len(raw_list)==0:
        return instance_locations_dict
    # rh_id = int(raw_list[0].split("@")[-1])
    for val in raw_list:
        temp = val.split(")")[0].split("(") 
        if temp[1] in instance_locations_dict.keys():
            instance_locations_dict[temp[1]].append(temp[0])
        else:   
            instance_locations_dict[temp[1]] = [temp[0]]
    return instance_locations_dict

def get_price_of_intsance_type(**kwargs):
    """
        This function returns ec2 price per hour for provided instance type
    """
    region = kwargs.get("aws_region")
    itype = kwargs.get("instance_type")
    price_client = kwargs.get("price_client")
    price = "NA"
    processor_type = "64-bit"
    if itype == "t2.medium":
        processor_type = "32-bit or 64-bit"
    data = price_client.get_products(ServiceCode='AmazonEC2', 
    Filters=[{'Field': 'tenancy', 'Value': 'Shared', 'Type': 'TERM_MATCH'},{'Field': 'operatingSystem', 'Value': 'Linux', 'Type': 'TERM_MATCH'},{'Field': 'preInstalledSw', 'Value': 'NA', 'Type': 'TERM_MATCH'},
    {'Field': 'instanceType', 'Value': itype, 'Type': 'TERM_MATCH'},{'Field': 'regionCode', 'Value': region, 'Type': 'TERM_MATCH'},{'Field': 'processorArchitecture', 'Value': processor_type, 'Type': 'TERM_MATCH'},
    {'Field': 'capacitystatus', 'Value': 'Used', 'Type': 'TERM_MATCH'}]
    )
    if len(data['PriceList'])!=0:
        price_data_list = json.loads(data['PriceList'][0])['terms']['OnDemand']
        id1 = list(price_data_list)[0]
        id2 = list(price_data_list[id1]['priceDimensions'])[0]
        price = price_data_list[id1]['priceDimensions'][id2]['pricePerUnit']['USD']
        price = str(float(price))   #Just to truncate trailing zeros
    return price

def generate_options_for_itype(control_value=None,**kwargs):
    """
        This function returns all the instanec type which can be used to 
        deploy ec2 instance in any selected zones by user
    """
    current_bp = kwargs.get('blueprint')
    parent_bp = get_parent_bp(current_bp=current_bp)
    cb_supported_instance_types = {"t2.medium","t2.large","m3.large","m3.xlarge","m4.large","m4.xlarge","m4.xlarge","m4.4xlarge","m4.10xlarge","m4.10xlarge","m5.xlarge","m5.xlarge",
    "m5.xlarge","m5.xlarge","m5.12xlarge","m5.12xlarge","m5.24xlarge","m5a.large","m5a.xlarge","m5a.2xlarge","m5a.2xlarge","m5a.8xlarge","m5a.12xlarge","m5a.16xlarge","m5a.24xlarge","c4.large"}
    instance_locations_dict = {}
    options = [("","-- Select Intsance Type --")]
    rh_id = None
    if control_value:
        raw_list = []
        cf_dict = parent_bp.get_cf_values_as_dict()
        if 'global_ha_architecture_rh_id' in cf_dict.keys():
            rh_id = cf_dict['global_ha_architecture_rh_id']
        if 'global_ha_architecture_locations' in cf_dict.keys():
            raw_list = cf_dict['global_ha_architecture_locations'].split(",")
        instance_locations_dict = get_instance_location_dict(raw_list=raw_list)
        if len(instance_locations_dict)==0:   # Case when user jumps on this order tab before filling parent BP order form
            options = [("","Kindly select instance locations first...")]
        if rh_id:
            rh = AWSHandler.objects.get(id=rh_id)
            itype_set = set()
            for region in instance_locations_dict.keys():
                client = get_boto3_client(rh.id, 'ec2', region=region)
                price_client = boto3.client('pricing', region_name='us-east-1',aws_access_key_id=rh.serviceaccount,aws_secret_access_key=rh.servicepasswd)
                
                response = client.describe_instance_type_offerings(LocationType='availability-zone')
                for zone in instance_locations_dict[region]:
                    zone = zone.replace(" ","")
                    itype = set(list_item['InstanceType'] for list_item in response['InstanceTypeOfferings'] if list_item['Location'] == zone)
                    if len(itype_set) == 0:
                        itype_set = itype
                    else:
                        itype_set = itype_set.intersection(itype)
            itype_set = itype_set.intersection(cb_supported_instance_types)
            for item in itype_set:
                price = get_price_of_intsance_type(aws_region=region,instance_type=item,price_client=price_client)
                options.append((item,f"{item}    (${price} EC2/hr)"))
    return sorted(options)


def run(job, *args, **kwargs):
    key_name = "{{key_name}}"
    version = "{{version}}"
    instance_type = "{{itype}}"
    resource = kwargs.get('resource')
    
    get_or_create_custom_fields()
    
    if resource.parent_resource_id:
        parent_resource = Resource.objects.get(id = resource.parent_resource_id)
        base_name = parent_resource.base_name
        rh = AWSHandler.objects.get(id = parent_resource.aws_rh_id)
        vpc_subnet_sg_dict = ast.literal_eval(parent_resource.vpc_subnet_structure[-1])
        #instance_locations_list = parent_resource.aws_zone_region_list_ha[1].split(",")
        ha_load_balancer_name = parent_resource.ha_load_balancer_name
        target_group_arn = parent_resource.target_group_arn
        aws_ha_region = parent_resource.aws_region_ha
        fs_id = parent_resource.efs_id
        set_progress('VPC details are retrieved as {}'.format(vpc_subnet_sg_dict))
        vpc_id = vpc_subnet_sg_dict[aws_ha_region]['VPC'][0]
        security_group_id = vpc_subnet_sg_dict[aws_ha_region]['VPC'][-1]
        subnet_id = vpc_subnet_sg_dict[aws_ha_region]['Subnet'][0][0]
        subnet_id_list = []
        az_list = []
        client = get_boto3_client(rh.id, 'ec2', region=aws_ha_region)
        for subnet in vpc_subnet_sg_dict[aws_ha_region]['Subnet']:
            # response = client.modify_subnet_attribute(MapPublicIpOnLaunch={'Value': True },SubnetId=subnet[0])  #Perform this if subnet has this attribute MapPublicIpOnLaunch set to False
            az_list.append(subnet[-1])
            subnet_id_list.append(subnet[0])
    
    key_name = key_name.replace(" ","_")
    #instance_location_dict = get_instance_location_dict(raw_list=instance_locations_list)
    
    region = aws_ha_region
    client = get_boto3_client(rh.id, 'ec2', region=region)
    
    # Create New KeyPair  for all selected regions
    ec2_key_name=f"{key_name}-{base_name}"
    if ec2_key_name in get_key_names(region=region,rh_id=rh.id):
        ec2_key_name = ec2_key_name + "{random.randrange(100,999, 3)}"
    fname = f"{ec2_key_name}.pem"
    resp = client.create_key_pair(KeyName=ec2_key_name)
    
    # Save PEM file
    proserv_path = getattr(settings, "PROSERV_DIR", None)
    
    if not(os.access(proserv_path, os.X_OK | os.W_OK)):  # Check if have access to proserv directory
        os.chmod(proserv_path,0o777)
        
    with open(f"{proserv_path}{fname}", 'w') as file:
        file.write(resp['KeyMaterial'])
    
    set_progress("keyname is set as '{}'".format(ec2_key_name))
    
    ami_id = get_ami_id_of_version_for_region(region=region,Version=version)
    
    launch_template_name = "LT-"+base_name
    set_progress("Creating EC2 Launch Template")
    ec2_client = get_boto3_client(rh.id, 'ec2', region=aws_ha_region)
    response = ec2_client.create_launch_template(
    	LaunchTemplateName=launch_template_name,
    	LaunchTemplateData = {
    		'ImageId': ami_id,
            'InstanceType': instance_type,
            'SecurityGroupIds': [
                security_group_id,
            ],
            'KeyName':ec2_key_name,
    	}
    )
    launch_template_id = response['LaunchTemplate']['LaunchTemplateId']
    set_progress("Creating Auto Scaling Group")
    
    auto_scaling_group_name = "ASG-"+base_name
    min_size = int('{{ min_size }}')
    max_size = int('{{ max_size }}')
    desired_capacity = int('{{ desired_capacity }}')
    
    # Making sure min_size <= desired_capacity < max_size
    min_size = desired_capacity if min_size > desired_capacity else min_size
    max_size = desired_capacity+1 if max_size < desired_capacity else max_size
    
    health_check_period = int('{{ health_check_period }}')
    
    elbv_client = get_boto3_client(rh.id, 'elbv2', region=aws_ha_region)
    flag = True
    while flag:
        set_progress(f"Waiting for Load Balancer {ha_load_balancer_name} to become active...")
        alb_resp = elbv_client.describe_load_balancers( Names=[ha_load_balancer_name, ],)
        lb_state = alb_resp['LoadBalancers'][0]['State']['Code']
        if lb_state == 'active':
            flag = False
            set_progress(f"Load Balancer {ha_load_balancer_name} is now active...")
        time.sleep(5)  # Waiting for 5 sec more just to be sure
    load_balancer_arn = alb_resp['LoadBalancers'][0]['LoadBalancerArn']
    
    auto_scaling_client = get_boto3_client(rh.id, 'autoscaling', region=aws_ha_region)
    set_progress("Creating autoscaling group '{}'".format(auto_scaling_group_name))
    response = auto_scaling_client.create_auto_scaling_group(
    	AutoScalingGroupName=auto_scaling_group_name,
    	LaunchTemplate={
            'LaunchTemplateId': launch_template_id
        },
        MinSize=min_size,
        MaxSize=max_size,
        DesiredCapacity=desired_capacity,
        HealthCheckGracePeriod=health_check_period,
        VPCZoneIdentifier = ",".join(subnet_id_list),
        AvailabilityZones= az_list,
    )

    time.sleep(3)  # Initial waiting period
    
    flag = True
    while flag:
        set_progress("Fetching instances from Auto Scaling Group")
        as_resp = auto_scaling_client.describe_auto_scaling_groups(AutoScalingGroupNames=[auto_scaling_group_name,  ], )
        instance_ids = [inst['InstanceId'] for inst in as_resp['AutoScalingGroups'][0]['Instances']]
        if len(instance_ids) == desired_capacity:  # Making sure all instances are fetched
            flag = False
            set_progress(f"Fetched {len(instance_ids)} instances from Auto Scaling Group...")
        else:
            time.sleep(3)
   
    ec2_resource = boto3.resource(service_name='ec2',region_name=aws_ha_region,aws_access_key_id=rh.serviceaccount,aws_secret_access_key=rh.servicepasswd)
    instance_number = 1
    for instance_ID in instance_ids:    
        flag = True
        while flag:
            current_instance = ec2_resource.Instance(instance_ID)
            set_progress(f"Waiting for instance {instance_ID} to start running...")
            time.sleep(5)
            if current_instance.state['Name'] == 'running':
                flag = False
                set_progress(f"Instance {instance_ID} is now in running state...")
                time.sleep(5)  # Sleeping for another 5 secs for precaution
        #resp_reg_tg = elbv_client.register_targets( TargetGroupArn=TG_arn , Targets=[{ 'Id': instance_ID, }, ],)
        
        instance_name = f"{base_name}-instance-{instance_number}"
        add_name_resp = add_name_to_resource(client=ec2_client,resource_id=instance_ID,resource_name=instance_name)
        instance_number +=1
        
    # Number of instances equals to desired capacity will be stopped from shrinking if scale in protection is turned ON
    # response = auto_scaling_client.set_instance_protection(AutoScalingGroupName=auto_scaling_group_name,InstanceIds=instance_ids,ProtectedFromScaleIn=True)
        
    set_progress("Creating Scaling Policy")
    
    scaling_policy_name = "SP-"+base_name
    metric_type = '{{ metric_type }}'
    target_value = int('{{ target_value }}')
    
    temp_target_value = int(target_value)*10 if metric_type in ["ALBRequestCountPerTarget"] else target_value
    if target_value < 90:
        target_value = 90  # Deliberately setting target value to 90%/900 so that autoscalinggroup wont shrink instances during setup, will undo this in last plugin
    
    
    
    
    if metric_type == "ALBRequestCountPerTarget":
        resource_label = f'''{"/".join(load_balancer_arn.split("/")[1:])}/targetgroup/{"/".join(target_group_arn.split("/")[1:])}''' #if metric_type == "ALBRequestCountPerTarget" else None
        target_value = target_value*10 # optimal average request count per instance during any one-minute interval
        predefined_metric_specification = {'PredefinedMetricType': metric_type,'ResourceLabel': resource_label}
        set_progress("finally attaching Load Balancer with Auto Scaling Group")
        resp = auto_scaling_client.attach_load_balancer_target_groups(AutoScalingGroupName=auto_scaling_group_name, TargetGroupARNs=[target_group_arn],) 
    else:
        predefined_metric_specification = {'PredefinedMetricType': metric_type}
    
    auto_scaling_client.put_scaling_policy(
        AutoScalingGroupName=auto_scaling_group_name,
        PolicyName=scaling_policy_name,
        PolicyType='TargetTrackingScaling',
        AdjustmentType='ChangeInCapacity',
        TargetTrackingConfiguration={
            'PredefinedMetricSpecification': predefined_metric_specification,
            'TargetValue': target_value
        },
    )
    
    set_progress("Target Value is set as '{}'".format(temp_target_value))
    set_progress(f"Scaling Configuration is set as Minimum Size : {min_size}, Maximum Size : {max_size}, Desired Capacity : {desired_capacity}")
    
    #set_progress("finally attaching Load Balancer with Auto Scaling Group")
    #ASB_LB_resp = auto_scaling_client.attach_load_balancer_target_groups(AutoScalingGroupName=auto_scaling_group_name, TargetGroupARNs=[target_group_arn],)  # This step is done in last plugin of HA_Architecture to avoid excess load of health-check
    
    if resource.parent_resource_id:
        parent_resource.auto_scaling_group_name = auto_scaling_group_name
        parent_resource.launch_template_id = launch_template_id
        parent_resource.asg_metric_type = metric_type
        parent_resource.asg_policy_targetvalue = temp_target_value
        parent_resource.ami_id = ami_id
        parent_resource.ec2_key_name = ec2_key_name
        parent_resource.instance_type = instance_type
        parent_resource.save()
    
    resource.name = auto_scaling_group_name
    resource.key_name = ec2_key_name
    resource.key_file_name = fname
    resource.ha_instance_type = instance_type
    resource.scaling_policy_name = scaling_policy_name
    resource.metric_type = metric_type
    resource.target_value = temp_target_value  # We are making it 90%/900 for now, change it at the end
    resource.scaling_properties = f"Minimum Size : {min_size}, Maximum Size : {max_size}, Desired Capacity : {desired_capacity}"
    resource.health_check_period=health_check_period
    resource.save()
    return "SUCCESS", "Auto Scalaing Group with scaling Policy is created succcessfully ", ""