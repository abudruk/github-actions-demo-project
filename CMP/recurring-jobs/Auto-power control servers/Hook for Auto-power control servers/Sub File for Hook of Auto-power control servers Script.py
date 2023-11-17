#!/usr/bin/env python

"""
This plugin enables auto-powering off of servers for periods of the day. This can be useful for
servers that do not need to run at night, to save on public cloud costs/resource consumption at
those times of the day.

To use this feature, go to a server's details page and configure a power
schedule on the tab or use the Power Schedule parameter at order time.
When this action runs it will look for the ScheduledTime models
created by you setting the power schedule, and use them to determine which
servers should be powered on or off at the current time.

CloudBolt will use its own server time to judge whether it is the right time to power on and
off VMs, so make sure you know what time it is on the CB server and that the timezone is right.

Also note that the recurring job that runs this action is expected to be run
every hour on the hour. If it is run on a different schedule, that will impact
when servers are powered on or off. The power change will only happen if the job runs
during the hour on the day when a power change is scheduled.
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

try:
    from eventlet.green import threading  # CB 7.7 and up
except ImportError:
    import threading  # CB 7.6 and earlier

if __name__ == "__main__":
    import django

    django.setup()

from django.template.defaultfilters import pluralize

from common.methods import set_progress
from infrastructure.models import ScheduledTime
from utilities.logger import _get_thread_logger

parent_thread_logger = _get_thread_logger(__name__)


def run(job=None, logger=None, **kwargs):
    now = datetime.now()
    current_scheduled_time, _ = ScheduledTime.objects.get_or_create(
        hour=now.hour, day_of_week=now.weekday()
    )
    set_progress(
        "The current hour is {} on {}, checking for servers that should "
        "be powered on or off at this time.".format(now.hour, now.strftime("%A"))
    )

    # get the queryset of ACTIVE servers that are scheduled to be powered off
    # Note: we specifically only want active servers here - we do not want to power off servers
    # that are currently provisioning, decommissioning, or being modified.
    power_off_servers = current_scheduled_time.servers_to_power_off.filter(
        status="ACTIVE"
    )

    # get the ACTIVE servers that are scheduled to be powered on
    # Note: we specifically only want active servers here - we do not want to power on servers
    # that are currently provisioning, decommissioning, or being modified.
    power_on_servers = current_scheduled_time.servers_to_power_on.filter(
        status="ACTIVE"
    )

    power_on_servers_str = ", ".join([svr.hostname for svr in power_on_servers])
    power_off_servers_str = ", ".join([svr.hostname for svr in power_off_servers])

    set_progress(
        "Will power on {} server{}: {}".format(
            power_on_servers.count(),
            pluralize(power_on_servers.count()),
            power_on_servers_str,
        )
    )
    set_progress(
        "Will power off {} server{}: {}".format(
            power_off_servers.count(),
            pluralize(power_off_servers.count()),
            power_off_servers_str,
        )
    )

    # Run power off and power on tasks in parallel using ThreadPoolExecutor.
    # Use a with statement to ensure threads are cleaned up.
    with ThreadPoolExecutor(max_workers=100) as pool:
        # Accessing the result of the future object generated by submit()
        # causes the job to block until the power on/off task completes, so
        # store all the future objects without looking at the results until all
        # the tasks have been kicked off.
        future_map = {}
        for server in power_on_servers:
            future = pool.submit(threaded_power_on, server, job)
            future_map[future] = ("on", server)
        for server in power_off_servers:
            future = pool.submit(threaded_power_off, server, job)
            future_map[future] = ("off", server)

        failures = {"on": 0, "off": 0}
        # Use as_completed to process the result of each task as it completes
        for future in as_completed(future_map):
            on_off, server = future_map[future]
            try:
                success = future.result()
            except Exception as exc:
                logger.info(
                    "Exception during power %s of server %s: %s",
                    on_off,
                    server,
                    exc,
                    exc_info=True,
                )
                success = False
            if not success:
                set_progress(
                    "Failed to power {on_off} server '{server}'.".format(
                        on_off=on_off, server=server
                    )
                )
                failures[on_off] += 1

    if failures["on"] or failures["off"]:
        total_attempts = len(power_on_servers) + len(power_off_servers)
        failures_msg = "Failed to power on {} and power off {} of {} server{}.".format(
            failures["on"], failures["off"], total_attempts, pluralize(total_attempts)
        )
        return ("WARNING", failures_msg, "")

    final_powered_on = power_on_servers.count() - failures["on"]
    final_powered_off = power_off_servers.count() - failures["off"]

    output = "{} servers powered on.\n{} servers powered off.".format(
        final_powered_on, final_powered_off
    )

    status, errors = "SUCCESS", ""
    return status, output, errors


def threaded_power_on(server, job):
    thread = threading.current_thread()
    thread.job = job
    thread.logger = parent_thread_logger
    return server.power_on()


def threaded_power_off(server, job):
    thread = threading.current_thread()
    thread.job = job
    thread.logger = parent_thread_logger
    return server.power_off()


if __name__ == "__main__":
    run()
