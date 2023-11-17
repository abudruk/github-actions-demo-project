from common.methods import set_progress
from infrastructure.models import CustomField
from resourcehandlers.aws.models import AWSHandler
import boto3,os

def get_or_create_custom_fields():
    CustomField.objects.get_or_create(
        name='base_name',
        defaults={
            "label": 'Base Name',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='aws_rh_name_ha',
        defaults={
            "label": 'AWS Resource Handler',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='aws_rh_id',
        defaults={
            "label": 'AWS Resource Handler id',
            "type": 'INT',
            'show_as_attribute': False,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='aws_region_ha',
        defaults={
            "label": 'AWS Region',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='aws_zone_region_list_ha',
        defaults={
            "label": 'Instance Locations List',
            "type": 'TUP',
            'show_as_attribute': False,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='instance_locations',
        defaults={
            "label": 'Instance Locations',
            "type": 'STR',
            'show_as_attribute': True,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
    CustomField.objects.get_or_create(
        name='vpc_selection',
        defaults={
            "label": 'VPC Selection',
            "type": 'TUP',
            'show_as_attribute': False,
            "description": 'Used by the HA Architecture parent blueprint'
        }
    )
 
def get_boto3_ec2_client(**kwargs):
    rh = kwargs.get('resource_handler')
    region = kwargs.get('region')
    wrapper = rh.get_api_wrapper()
    return wrapper.get_boto3_client('ec2', rh.serviceaccount, rh.servicepasswd , region)

def store_base_url(form_data,current_bp):
    CustomField.objects.get_or_create(name='order_base_url',defaults={"label": 'Order base url', "type": 'STR'})
    fa = form_data.get("form-action",None)
    if fa:
        current_bp.set_value_for_custom_field(cf_name='order_base_url',value=fa[0].split("catalog")[0])
            
def get_available_zones(**kwargs):
    """ This function will return all the zones available in region passed in 
        kwargs as 'region' with the help of boto3 client created with resource handler
        provided in kwargs as 'resource_handler_id'
    """
    region = kwargs.get('region')
    rh_id = kwargs.get('resource_handler_id')
    rh = AWSHandler.objects.get(id = int(rh_id))
    client = get_boto3_ec2_client(resource_handler = rh,region = region)
    try:
        response = client.describe_availability_zones(
            Filters=[
                {
                    'Name': 'region-name',
                    'Values': [region,]
                }])
    except:
        return []
    zone_list = [ zone['ZoneName'] for zone in response['AvailabilityZones']]
    return zone_list


def generate_options_for_aws_resource_handler(field,control_value=None, **kwargs):
    current_bp = kwargs.get('blueprint')
    options = [("","-- Select Single Resource Handler --")]
    if control_value:
        options = []
        CustomField.objects.get_or_create(name='global_ha_base_name',defaults={"label": 'Global base name for all resources', "type": 'STR'})
        current_bp.set_value_for_custom_field(cf_name='global_ha_base_name',value=control_value)   #Set the Global rhID variable as a customfield
        for rh in AWSHandler.objects.all():
            options.append((rh.id, rh.name))
    return options
    # return sorted(options, key=lambda tup: tup[1].lower())
    
def generate_options_for_aws_ha_region(control_value=None, **kwargs):
    current_bp = kwargs.get('blueprint')
    options = [("","-- Select Single Region --")]
    if control_value:
        store_base_url(kwargs.get("form_data"),current_bp)
        CustomField.objects.get_or_create(name='global_ha_architecture_rh_id',defaults={"label": 'Global base name for all resources', "type": 'INT'})
        current_bp.set_value_for_custom_field(cf_name='global_ha_architecture_rh_id',value=control_value)   #Set the Global rhID variable as a customfield
        rh_id = control_value
        rh = AWSHandler.objects.get(id = rh_id)
        wrapper = rh.get_api_wrapper()
        for item in wrapper.get_all_regions():
            options.append(("{}@{}".format(control_value,item['name']),item['display']))
    return options
    
def generate_options_for_aws_ha_zone_region_pair(control_value=None, **kwargs):
    """ This will generate options as 'zone1 (Region1)@Rh_ID','zone2 (Region1)@Rh_ID','zone3 (Region2)@Rh_ID,...so on
        for all zones in all valid/allowed regions
    """
    current_bp = kwargs.get('blueprint')
    options = [("","--Select Availability Zones--")]
    if control_value:
        store_base_url(kwargs.get("form_data"),current_bp)  #just to make sure we store order url
        rh_id = control_value.split("@")[0]
        region = control_value.split("@")[-1]
        CustomField.objects.get_or_create(name='global_ha_architecture_rh_id',defaults={"label": 'Global HA Architecture AWS RH ID', "type": 'INT'})
        current_bp.set_value_for_custom_field(cf_name='global_ha_architecture_rh_id',value=rh_id)   #Set the Global rhID variable as a customfield
        options = []

        rh = AWSHandler.objects.get(id = rh_id)
        wrapper = rh.get_api_wrapper()
        label = region.replace('-', ' ')
        list_of_zones = get_available_zones(resource_handler_id = rh_id, region=region)
        if len(list_of_zones) == 0:
            options.append(("","-- Select another region, this region is not supported --"))
        else:
            for zone in list_of_zones:
                options.append(("{0} ({1})@{2}".format(zone,region,rh_id),"{0} ({1})".format(zone,label)))
        
    return options

def generate_options_for_aws_ha_existing_vpc(control_values=None, **kwargs):
    """ This returns all the available VPCs from the regions selected by user in slelect Instance location choice
    """
    current_bp = kwargs.get('blueprint')
    options = [("Not Selected Any","Create new VPC")]
    if control_values:
        if "" in control_values:
            return [("","-- Select Existing or Create New VPC --")]
        CustomField.objects.get_or_create(name='global_ha_architecture_locations',defaults={"label": 'Global HA Architecture AWS selected zones', "type": 'STR'})
        zone_selection_list = []    
        instance_locations_list = control_values
        rh_id = int(control_values[0].split("@")[-1])
        region = control_values[0].split(")")[0].split("(")[-1]
        rh = AWSHandler.objects.get(id = rh_id)
        instance_locations_dict = {}
        for ele in instance_locations_list:
            zone_selection_list.append(ele.split("@")[0]) 
        current_bp.set_value_for_custom_field(cf_name='global_ha_architecture_locations',value=",".join(zone_selection_list))   #Set the Global locations variable as a customfield
        client = get_boto3_ec2_client(resource_handler = rh,region = region)
        response = client.describe_vpcs()
        resp = response['Vpcs']
        for vpc in resp:
            label = "{0} @ {1}".format(vpc["VpcId"],region)
            options.append((label,label))
    return options

def prodcut_license_file_validation(blueprint_context):
    is_prodcut_license_file_valid = True
    bpsi_key_list = [key for key in blueprint_context.keys() if "product_license" in key]
    if bpsi_key_list:
        bpsi_context = blueprint_context.get(bpsi_key_list[0])
        pl_file_object = bpsi_context.get("product_license_file")
        name, extension = os.path.splitext(pl_file_object.file.name)
        if extension not in [".bin"]:
            is_prodcut_license_file_valid = False
    return is_prodcut_license_file_valid
    
def run(job, *args, **kwargs):
    resource = kwargs.pop('resources').first()
    user = resource.owner
    #is_prodcut_license_file_valid = prodcut_license_file_validation(blueprint_context = kwargs.get("blueprint_context"))
    if not(prodcut_license_file_validation(blueprint_context = kwargs.get("blueprint_context"))):
        return "FAILURE", "Kindly select valid product license file with '.bin' extension..", "Invalid Product License File"
    if not(user.is_cbadmin or user.is_super_admin):
        return "FAILURE", "Kindly login with superuser or cbadmin user privilage..", "Unauthorized User"
    get_or_create_custom_fields()
    base_name = '{{base_name}}'
    resource_handler_id = '{{aws_resource_handler}}'
    aws_ha_region = "{{aws_ha_region}}".split('@')[-1]
    aws_zone_region = {{aws_ha_zone_region_pair}}
    existing_vpcs = "{{aws_ha_existing_vpc}}"
    if len(aws_zone_region) == 1:
        return "FAILURE", "Kindly select at least TWO ZONES to deploy HA Architecture..", "Insufficient Zones"
    instance_locations = ", ".join([i.split('@')[0] for i in aws_zone_region])
    aws_zone_region_tuple = ("Selected AWS Zones-region pairs for HA deployment",instance_locations)
    existing_vpcs_tuple = ("Selected list of Existing VPC in given regions",existing_vpcs)
    rh = AWSHandler.objects.get(id = int(resource_handler_id))
    wrapper = rh.get_api_wrapper()
    display_region = [region["display"] for region in wrapper.get_all_regions() if region["name"]==aws_ha_region][0]
    zone_list = [zone.split(" (")[0].replace(" ","") for zone in instance_locations.split(",")]
    
    resource.instance_locations = f'{", ".join(zone_list[:-1])} and {zone_list[-1]} in "{display_region}"'
    resource.base_name = base_name
    resource.aws_rh_name_ha = rh.name
    resource.aws_rh_id = rh.id
    resource.aws_zone_region_list_ha = aws_zone_region_tuple
    resource.vpc_selection = existing_vpcs_tuple
    resource.aws_region_ha = aws_ha_region
    resource.save()
    return "SUCCESS", "Successfully created..", ""