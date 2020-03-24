from __future__ import unicode_literals
import requests
import json

params = {}
params['transaction_user_uid'] = "1"




service2 = {}
service2['name'] = "p1s1t3-create-user"
service2['PMA'] = {'p1s1t3_first_name':"s9t4-test first name",
	'p1s1t3_last_name': "s9t4-test last name",
	'p1s1t3_account_type' : "1",
	'p1s1t3_google_account_name' : "asdf345as",
	'p1s1t3_contact_email' : "contact@gmail.com"}
service2['RSA'] = {'p1s9t4_user_uid': 'internal_uid'}


service3 = {}
service3['name'] = "p1s9t4-set-account-type"
service3['PMA'] = {'p1s9t4_account_type':"2"}


params['_task_sequence_list'] =json.JSONEncoder().encode([service2,service3])
#params['_task_sequence_list'] =json.JSONEncoder().encode([service4])




return_value = requests.post('https://create-transaction-dot-dev-dgnet-watchdog.appspot.com/testing_add_task',data=params)

#return_value = requests.post('http://localhost:8080/testing_add_task',data=params)