from __future__ import unicode_literals
import requests
import json

params = {}
params['transaction_user_uid'] = "7"




service2 = {}
service2['name'] = "p1s1t3-create-user"
service2['PMA'] = {'p1s1t3_first_name':"s9t3-test first name",
	'p1s1t3_last_name': "s9t3-test last name",
	'p1s1t3_account_type' : "1",
	'p1s1t3_google_account_name' : "asdf345as",
	'p1s1t3_contact_email' : "contact@gmail.com"}
service2['RSA'] = {'p1s9t3_user_uid': 'internal_uid'}


service3 = {}
service3['name'] = "p1s9t3-change-information"
service3['PMA'] = {'p1s9t3_first_name':"updated first name",
	'p1s9t3_last_name': "updated last name",
	'p1s9t3_contact_email' : "updated_contact@gmail.com"}

	
service4 = {}
service4['name'] = "p1s9t3-change-information"
service4['PMA'] = {'p1s9t3_user_uid' : "7",
	'p1s9t3_first_name':"second updated first name",
	'p1s9t3_last_name': "second updated last name",
	'p1s9t3_contact_email' : "updated_contact@gmail.com"}

#params['_task_sequence_list'] =json.JSONEncoder().encode([service2,service3])
params['_task_sequence_list'] =json.JSONEncoder().encode([service4])




return_value = requests.post('https://create-transaction-dot-dev-dgnet-watchdog.appspot.com/testing_add_task',data=params)

#return_value = requests.post('http://localhost:8080/testing_add_task',data=params)