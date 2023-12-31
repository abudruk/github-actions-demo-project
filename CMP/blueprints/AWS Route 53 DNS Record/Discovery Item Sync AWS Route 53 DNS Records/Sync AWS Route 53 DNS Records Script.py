import json
from common.methods import set_progress
from botocore.client import ClientError
from resourcehandlers.aws.models import AWSHandler

RESOURCE_IDENTIFIER = ['name', 'dns_record_type']



def discover_resources(**kwargs):
    discovered_routes = []
    handler: AWSHandler
    for handler in AWSHandler.objects.all():
        set_progress('Connecting to Amazon for handler: {}'.format(handler))
        client = handler.get_boto3_client(None, 'route53')
        try:
            for hosted_zone in client.list_hosted_zones()['HostedZones']:
                zone_id = hosted_zone['Id'].split('/')[-1]
                records = client.list_resource_record_sets(
                    HostedZoneId=zone_id
                )['ResourceRecordSets']
                for record in records:
                    discovered_routes.append({
                        'name': record.get('Name'),
                        'dns_record_type': record.get('Type'),
                        'dns_record_value': json.dumps(record.get('ResourceRecords')),
                        'zone_id': zone_id,
                        'aws_rh_id': handler.id
                    })
        except ClientError as e:
            set_progress('AWS ClientError: {}'.format(e))
            continue

    return discovered_routes