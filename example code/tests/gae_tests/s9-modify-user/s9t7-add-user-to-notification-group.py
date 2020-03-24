from __future__ import unicode_literals
import requests
import json

params = {}
params['transaction_user_uid'] = "63"

service = {}
service['name'] = "p1s9t7-add-user-to-notification-group"
service['PMA'] = {'p1s9t7_user_uid': "100", "p1s9t7_notification_group_uid": "2"}

params['_task_sequence_list'] = json.JSONEncoder().encode([service])

#return_value = requests.post('https://create-transaction-dot-dgnet-watchdog.appspot.com/testing_add_task', data=params)
return_value = requests.post('https://create-transaction-dot-dev-dgnet-watchdog.appspot.com/testing_add_task', data=params)
print(return_value)
