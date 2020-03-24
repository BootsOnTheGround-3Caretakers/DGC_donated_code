from __future__ import unicode_literals
import requests
import json

params = {}
params['transaction_user_uid'] = "1"



service0 = {}
service0['name'] = "p1s1t1-create-organization"
service0['RSA'] = {'p1s9t5_organization_uid':'internal_uid',
'p1s10t1_organization_uid' : 'internal_uid'}
service0['PMA'] = {'p1s1t1_organization_name' : "s9t5-test organization name",
	'p1s1t1_organization_description' : "s9t5-test organization_description5"}


service1 = {}
service1['name'] = "p1s10t1-set-organization-primary-parent"
service1['PMA'] = {'p1s10t1_parent_organization_uid': '1'}
service1['delay'] = "5"
	
service2 = {}
service2['name'] = "p1s1t3-create-user"
service2['PMA'] = {'p1s1t3_first_name':"s9t5-test first name",
	'p1s1t3_last_name': "s9t5-test last name",
	'p1s1t3_account_type' : "1",
	'p1s1t3_google_account_name' : "asdf345as",
	'p1s1t3_contact_email' : "contact@gmail.com"}
service2['RSA'] = {'p1s9t5_user_uid': 'internal_uid'}


service3 = {}
service3['name'] = "p1s9t5-assign-organization-to-user"
service3['delay'] = "5"


service4 = {}
service4['name'] = "p1s9t5-assign-organization-to-user"
service4['PMA'] = {'p1s9t5_user_uid': "2309", "p1s9t5_organization_uid": "1105"}

#params['_task_sequence_list'] =json.JSONEncoder().encode([service0,service1,service2,service3])
params['_task_sequence_list'] =json.JSONEncoder().encode([service4])




return_value = requests.post('https://create-transaction-dot-dgnet-watchdog.appspot.com/testing_add_task',data=params)
