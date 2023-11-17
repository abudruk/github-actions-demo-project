from accounts.models import Group
from infrastructure.models import CustomField
from servicecatalog.models import ServiceBlueprint, ServiceBlueprintGroupPermissions


def run(job, *args, **kwargs):
    CustomField.objects.get_or_create(name="has_azure_services", label="Group has Azure services", type="BOOL")
    azure_bps = ServiceBlueprint.objects.filter(tags__name__exact="Azure Services")
    for g in Group.without_unassigned.all():
        if g.has_azure_services:
            for bp in azure_bps:
                ServiceBlueprintGroupPermissions.objects.get_or_create(
                    permission="DEPLOY", group=g, blueprint=bp
                )
                
        else:
            azure_permissions = ServiceBlueprintGroupPermissions.objects.filter(
                permission="DEPLOY", group=g, blueprint__in=azure_bps
            )
            if azure_permissions:
                azure_permissions.delete()