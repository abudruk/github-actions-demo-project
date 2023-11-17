from botocore.exceptions import ClientError
import time

from common.methods import set_progress
from resourcehandlers.aws.models import AWSHandler
from resources.models import Resource
from containerorchestrators.kuberneteshandler.models import Kubernetes
from utilities.logger import ThreadLogger

logger = ThreadLogger(__name__)

def get_boto_client(aws_rh_id, resource, service='ec2'):
    """
    get_boto_client
    """
    rh: AWSHandler = AWSHandler.objects.get(id=aws_rh_id)

    # get aws client object
    client = rh.get_boto3_client(resource.aws_region, service)
    
    return client
    
    
def detach_policy(client, policies, role_name):
    """
    detach_policy
    """
    policies_removed = True

    for policy in policies:
        try:
            client.detach_role_policy(
                RoleName=role_name,
                PolicyArn=policy
            )
        except Exception as error:
            policies_removed = False
            set_progress(f'policies could not be detached from role {role_name}...{error}')
            
    return policies_removed


def delete_roles(aws_rh_id, resource, cluster_role):
    """
    delete_roles
    """
    cluster_policy_arn = ['arn:aws:iam::aws:policy/AmazonEKSClusterPolicy']
    
    #iam client
    iam_client = get_boto_client(aws_rh_id, resource, 'iam')
    
    all_detached = detach_policy(iam_client, cluster_policy_arn, cluster_role)

    if all_detached:
        iam_client.delete_role(RoleName=cluster_role)

            
def delete_kubernetes_object(resource):
    """
    delete_kubernetes_object
    """
    try:
        kubernetes = Kubernetes.objects.get(id=resource.container_orchestrator_id)
        kubernetes.delete()
    except Kubernetes.DoesNotExist:
        pass
    
    
def _delete_cluster_node_group(client, resource, nodegroups):
    try:
        for nodegroup in nodegroups:

            # delete node group
            client.delete_nodegroup(clusterName=resource.name , nodegroupName=nodegroup)
            
        while len(nodegroups) != 0:
            nodegroups = client.list_nodegroups(clusterName=resource.name)['nodegroups']
            
            set_progress(f'Still deleting Node Group...')
            time.sleep(10)
                
    except Exception as error:
        return "FAILURE" , "" , f"{error}"
        
        
def _delete_cluster(client, resource, aws_rh_id):
    try:
        # delet cluster
        client.delete_cluster(name=resource.name)
                
        # delete unique roles created for cluster and respective nodegroups
        delete_roles(aws_rh_id, resource, resource.role_arn.split('/')[1])
    
    except Exception as error:
        return "FAILURE" , "" , f"{error}"
        
        
def run(job, resource , *args , **kwargs):
    set_progress(f"Elastic K8S Delete plugin running for resource: {resource}")
    logger.info(f"Elastic K8S Delete plugin running for resource: {resource.name}")

    cf_value = resource.get_cf_values_as_dict()
    aws_rh_id = cf_value.get("aws_rh_id", None)

    if aws_rh_id is None or aws_rh_id == "":
        return "SUCCESS", "Kubernetes {0} deleted successfully".format("Node Group" if resource.resource_type.name == "eks_nodegroup" else "Cluster"), ""
    
    client = get_boto_client(aws_rh_id, resource, 'eks')
    
    try:
        # get node group list
        nodegroups = client.list_nodegroups(clusterName=resource.name)['nodegroups']
    except Exception as err:
        pass
    else:
        _delete_cluster_node_group(client, resource, nodegroups)
    
    
    try:
        client.describe_cluster(name=resource.name)
    except Exception as err:
        pass
    else:
        _delete_cluster(client, resource, aws_rh_id)
        
    # delete Kubernetes from container orchestrator 
    delete_kubernetes_object(resource)

    for sub_resource in Resource.objects.filter(blueprint=resource.blueprint, parent_resource=resource, resource_type__name='eks_nodegroup'):
        sub_resource.delete()

    return "SUCCESS" , "Kubernetes Cluster '{0}' deleted successfully".format(resource.name) , ""