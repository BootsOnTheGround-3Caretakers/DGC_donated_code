echo off
copy /Y "..\python_base_includes\GCP_Datavalidation\datavalidation.py" includes\
copy /Y "..\python_base_includes\datastore_functions\datastore_functions.py" includes\
copy /Y "..\python_base_includes\Task queue functions\task_queue_functions.py" includes\
copy /Y "..\python_base_includes\firebase_functions\firebase_functions.py" includes\
copy /Y "..\python_base_includes\GCP_return_codes\GCP_return_codes.py" includes\
copy /Y "..\python_base_includes\GCP_datastore_logging\GCP_datastore_logging.py" includes\
copy /Y "..\python_base_includes\GCP_memcache\GCP_memcache.py" includes\



copy /Y "..\dgnet_watchdog_gae_p1_global_includes\back_end_global_settings.py" includes\
copy /Y "..\dgnet_watchdog_gae_p1_global_includes\back_end_email_templates.py" includes\
copy /Y "..\dgnet_watchdog_gae_p1_global_includes\back_end_datastores.py" includes\
copy /Y "..\dgnet_watchdog_gae_p1_global_includes\back_end_services.py" includes\
copy /Y "..\dgnet_watchdog_gae_p1_global_includes\back_end_settings_return_codes.py" includes\
copy /Y "..\dgnet_watchdog_gae_p1_global_includes\queue.yaml" .


copy /Y "..\dgnet_watchdog_gae_p2_global_includes\user_interface_global_settings.py" includes\

copy /Y "..\dgnet_watchdog_gae_p3_global_includes\billing_services.py" includes\
copy /Y "..\dgnet_watchdog_gae_p3_global_includes\billing_event_formats.py" includes\
timeout 3