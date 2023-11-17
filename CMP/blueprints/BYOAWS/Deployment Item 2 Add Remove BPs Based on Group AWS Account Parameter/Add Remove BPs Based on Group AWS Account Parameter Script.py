from accounts.models import Group
from infrastructure.models import CustomField
from servicecatalog.models import (ServiceBlueprint,
                                   ServiceBlueprintGroupPermissions)


def run(job, *args, **kwargs):
    aws_bps = ServiceBlueprint.objects.filter(tags__name__exact="AWS Services")
    byoaws_bp = ServiceBlueprint.objects.get(global_id="BP-sfuahshd")
    CustomField.objects.get_or_create(name="has_aws_services", label="Group has AWS services", type="BOOL")
    
    for g in  Group.without_unassigned.all():
        if g.has_aws_services:
            for bp in aws_bps:
                ServiceBlueprintGroupPermissions.objects.get_or_create(
                    permission="DEPLOY", group=g, blueprint=bp
                )
        else:
            aws_permissions = ServiceBlueprintGroupPermissions.objects.filter(
                permission="DEPLOY", group=g, blueprint__in=aws_bps
            )
            if aws_permissions:
                aws_permissions.delete()