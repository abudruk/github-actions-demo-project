from accounts.models import Group
from common.methods import set_progress
from infrastructure.models import Environment
from infrastructure.models import CustomField
from resourcehandlers.aws.models import AWSHandler

def create_custom_fields_as_needed():
    CustomField.objects.get_or_create(
        name='aws_rh_id', defaults={ 'label': 'AWS RH ID', 'type': 'STR',
            'description': 'Used by the AWS blueprints'
        }
    )
    CustomField.objects.get_or_create(
        name='env_id', defaults={'label': 'Env ID', 'type': 'STR'}
    )
    CustomField.objects.get_or_create(
        name='name', defaults={'label': 'AWS Redshift', 'type': 'STR',
            'description': 'Name of the AWS Redshift cluster'
        }
    )
    CustomField.objects.get_or_create(
        name='cluster_name', defaults={'label': 'AWS Redshift cluster_name', 'type': 'STR',
            'description': 'Name of the AWS Redshift cluster'
        }
    )
    CustomField.objects.get_or_create(
        name='node_type', defaults={'label': 'Redshift cluster Node Type', 'type': 'STR',
            'description': 'The node type to be provisioned for the cluster'
        }
    )
    CustomField.objects.get_or_create(
        name='master_username', defaults={'label': 'Redshift cluster Master Username', 'type': 'STR',
            'description': 'The user name associated with the master user account for the cluster that is being created.'
        }
    )
    CustomField.objects.get_or_create(
        name='master_password', defaults={'label': 'Redshift cluster MasterUserPassword', 'type': 'PWD',
            'description': 'The password associated with the master user account for the cluster that is being created.'
        }
    )
    CustomField.objects.get_or_create(
        name='cluster_type', defaults={'label': 'Redshift cluster Type', 'type': 'STR',
            'description': 'The type of the cluster.'
        }
    )


def connect_to_redshift(env):
    """
    Return boto connection to the redshift in the specified environment's region.
    """
    rh: AWSHandler = env.resource_handler.cast()

    # get aws client object
    client = rh.get_boto3_client(env.aws_region, 'redshift')

    return client, rh.id

def generate_options_for_env_id(server=None, **kwargs):
    """
    Generate AWS region options
    """
    group_name = kwargs["group"]

    try:
        group = Group.objects.get(name=group_name)
    except Exception as err:
        return []
    
    # fetch all group environment
    envs = group.get_available_environments()
    
    aws_envs= [(env.id, env.name) for env in envs if env.resource_handler is not None and env.resource_handler.resource_technology.slug.startswith('aws')]
    
    return aws_envs


def generate_options_for_node_type(**kwargs):
    return [
        ('dc2.large', 'NodeType - dc2.large'),
        ('ds2.xlarge', 'NodeType - ds2.xlarge'),
        ('ds2.8xlarge', 'NodeType - ds2.8xlarge'),
        ('dc1.large', 'NodeType - dc1.large'),
        ('dc1.8xlarge', 'NodeType - dc1.8xlarge'),
        ('dc2.8xlarge', 'NodeType - dc2.8xlarge'),
    ]


def generate_options_for_cluster_type(**kwargs):
    return [('single-node', 'Single Node'), ('multi-node', 'Multi Node')]


def run(resource, *args, **kwargs):
    # create custom fields if needed
    create_custom_fields_as_needed()
    
    env_id = '{{ env_id }}'
    db_name = "{{ db_name }}"
    cluster_dentifier = "{{ cluster_dentifier }}"
    node_type = "{{ node_type }}"
    number_of_nodes = "{{ number_of_nodes }}"
    cluster_type = "{{ cluster_type }}"
    master_username = "{{ master_username }}".lower()
    master_password = "{{ master_password }}"

    env = Environment.objects.get(id=env_id)
    connection, aws_rh_id = connect_to_redshift(env)

    try:
        if cluster_type == 'multi-node':
            connection.create_cluster(
                ClusterIdentifier=cluster_dentifier,
                NodeType=node_type,
                DBName=db_name,
                MasterUsername=master_username,
                MasterUserPassword=master_password,
                ClusterType=cluster_type,
                NumberOfNodes=int(number_of_nodes))
        else:
            connection.create_cluster(
                ClusterIdentifier=cluster_dentifier,
                NodeType=node_type,
                DBName=db_name,
                MasterUsername=master_username,
                MasterUserPassword=master_password,
                ClusterType=cluster_type)

    except Exception as error:
        return "FAILURE", "", f"{error}"

    waiter = connection.get_waiter('cluster_available')
    set_progress("...waiting for redshift cluster to be ready...")
    waiter.wait(ClusterIdentifier=cluster_dentifier)

    resource.name = cluster_dentifier
    resource.aws_rh_id = aws_rh_id
    resource.env_id = env_id
    resource.node_type = node_type
    resource.master_username = master_username
    resource.master_password = master_password
    resource.cluster_type = cluster_type
    resource.cluster_name = cluster_dentifier
    resource.save()

    return "SUCCESS", "Redshift Cluster created successfully.", ""