import time
from common.methods import set_progress
from resourcehandlers.aws.models import AWSHandler
from botocore.exceptions import ClientError
from resources.models import Resource, ResourceType
from containerorchestrators.kuberneteshandler.models import Kubernetes
from utilities.logger import ThreadLogger

logger = ThreadLogger(__name__)

def get_boto_client(resource, service='ec2'):
    """
    get_boto_client
    """
    rh: AWSHandler = AWSHandler.objects.get(id=resource.aws_rh_id)
    client = rh.get_boto3_client(resource.aws_region, service)
    return client
    
    
def detach_policy(client, policies, role_name):
    """
    detach_policy
    """
    for policy in policies:
        try:
            policy_attach_res = client.detach_role_policy(
                RoleName=role_name,
                PolicyArn=policy
            )
            policies_removed = True
        except Exception as error:
            policies_removed = False
            set_progress(f'policies could not be detached from role {role_name}...{error}')
            
    return policies_removed


def delete_roles(resource, cluster_role, delete_cluster_role, node_roles_to_delete=[]):
    """
    delete_roles
    """
    cluster_policy_arn = ['arn:aws:iam::aws:policy/AmazonEKSClusterPolicy']
    node_policies_arn = ['arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy',
        'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly',
        'arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy']
        
    #iam client
    iam_client = get_boto_client(resource, 'iam')
    
    if delete_cluster_role:
        all_detached = detach_policy(iam_client, cluster_policy_arn, cluster_role)
        print(all_detached)
        if all_detached:
            iam_client.delete_role(
                RoleName=cluster_role
            )
    for role_name in node_roles_to_delete:
        all_detached = detach_policy(iam_client, node_policies_arn, role_name)
        print(all_detached)
        if all_detached:
            iam_client.delete_role(
                RoleName=role_name
            )
            
            
def delete_kubernetes_object(resource):
    """
    delete_kubernetes_object
    """
    try:
        kubernetes = Kubernetes.objects.get(id=resource.container_orchestrator_id)
        kubernetes.delete()
    except Kubernetes.DoesNotExist:
        pass
    
    
def run(job,resource , *args , **kwargs):
    
    set_progress(f"Elastic K8S Delete plugin running for resource: {resource}")
    logger.info(f"Elastic K8S Delete plugin running for resource: {resource.name}")
    
    delete_cluster_role = False
    node_roles_to_delete = []
    nodegroups = []
    
    nodegroup_type, _ = ResourceType.objects.get_or_create(name="eks_nodegroup")
    if resource.resource_type.id == nodegroup_type.id:
        return "SUCCESS" , "Successfully deleted '{}'".format(resource.name) , ""
        
    cluster_role = resource.role_arn.split('/')[1]
    if cluster_role.find(resource.name) != -1:
        delete_cluster_role = True
        
    client = get_boto_client(resource, 'eks')
    try:
        nodegroups = client.list_nodegroups(clusterName=resource.name)['nodegroups']
        for nodegroup in nodegroups:
            node_role = client.describe_nodegroup(clusterName=resource.name , nodegroupName=nodegroup)['nodegroup']['nodeRole']
            
            if node_role.find(nodegroup) != -1:
                node_roles_to_delete.append(node_role.split('/')[1])

            client.delete_nodegroup(clusterName=resource.name , nodegroupName=nodegroup)
            
        while len(nodegroups) != 0:
            nodegroups = client.list_nodegroups(clusterName=resource.name)['nodegroups']
            
            set_progress(f'Still deleting Node Group...')
            time.sleep(10)
                
        client.delete_cluster(name=resource.name)
        
        #delete Kubernetes from container orchestrator 
        delete_kubernetes_object(resource)
        
        # delete unique roles created for cluster and respective nodegroups
        delete_roles(resource, cluster_role, delete_cluster_role, node_roles_to_delete)
        
    except ClientError as error:
        return "FAILURE" , "" , f"{error}"
        
    return "SUCCESS" , "Successfully deleted '{}'".format(resource.name) , ""