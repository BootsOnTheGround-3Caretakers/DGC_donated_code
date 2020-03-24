from __future__ import unicode_literals
import requests
import json

params = {}
params['transaction_user_uid'] = "1"



service1 = {}
service1['name'] = "p1s1t2-create-object"
service1['RSA'] = {'p1s9t2_object_uid': 'internal_uid'}
service1['PMA'] = {'p1s1t2_object_name' : "p1s9t2 test object name",'p1s1t2_object_type': "2",
	'p1s1t2_object_description' : "p1s9t2 object description5"}


service2 = {}
service2['name'] = "p1s1t3-create-user"
service2['PMA'] = {'p1s1t3_first_name':"s9t2-test first name",
	'p1s1t3_last_name': "s9t2-test last name",
	'p1s1t3_account_type' : "1",
	'p1s1t3_google_account_name' : "asdf345as",
	'p1s1t3_contact_email' : "contact@gmail.com"}
service2['RSA'] = {'p1s9t2_receiving_user_uid': 'internal_uid'}


service3 = {}
service3['name'] = "p1s9t2-set-object-permissions"
service3['PMA'] = {"p1s9t2_giving_user_uid": "1" ,"p1s9t2_permissions" : "abcdefg"}
service3['delay'] = "5"

service4 = {}
service4['name'] = "p1s9t2-set-object-permissions"
service4['PMA'] = {'p1s9t2_object_uid': "7","p1s9t2_giving_user_uid": "1", 'p1s9t2_receiving_user_uid':"2" ,  "p1s9t2_permissions" : "abc"}

params['_task_sequence_list'] =json.JSONEncoder().encode([service1,service2,service3])
#params['_task_sequence_list'] =json.JSONEncoder().encode([service4])




return_value = requests.post('https://create-transaction-dot-dev-dgnet-watchdog.appspot.com/testing_add_task',data=params)

#return_value = requests.post('http://localhost:8080/testing_add_task',data=params)