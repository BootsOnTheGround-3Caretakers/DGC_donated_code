from __future__ import unicode_literals
import requests
import json

params = {}
params['transaction_user_uid'] = "1"



service1 = {}
service1['name'] = "p1s1t1-create-organization"
service1['RSA'] = {'p1s9t1_organization_uid':'internal_uid', "p1s10t1_organization_uid":'internal_uid'}
service1['PMA'] = {'p1s1t1_organization_name' : "s9t1-test organization name",
	'p1s1t1_organization_description' : "s9t1-test organization_description5"}

    
    


service2 = {}
service2['name'] = "p1s1t3-create-user"
service2['PMA'] = {'p1s1t3_first_name':"s9t1-test first name",
	'p1s1t3_last_name': "s9t1-test last name",
	'p1s1t3_account_type' : "1",
	'p1s1t3_google_account_name' : "asdf345as",
	'p1s1t3_contact_email' : "contact@gmail.com"}
service2['RSA'] = {'p1s9t1_receiving_user_uid': 'internal_uid'}


service3 = {}
service3['name'] = "p1s10t1-set-organization-primary-parent"
service3['PMA'] = {'p1s10t1_parent_organization_uid' : "1"}
service3['delay'] = "5"

service4 = {}
service4['name'] = "p1s9t1-set-organization-permissions"
service4['PMA'] = {"p1s9t1_giving_user_uid": "1", "p1s9t1_permissions" : "abcdefg"}
service4['delay'] = "5"


service5 = {}
service5['name'] = "p1s9t1-set-organization-permissions"
service5['PMA'] = {"p1s9t1_giving_user_uid": "2003",
'p1s9t1_organization_uid': "1102",'p1s9t1_receiving_user_uid':"2180" ,  "p1s9t1_permissions" : "l"}

service6 = {}
service6['name'] = "p1s9t1-set-organization-permissions"
service6['PMA'] = {"p1s9t1_giving_user_uid": "2003",
'p1s9t1_organization_uid': "1105",
'p1s9t1_receiving_user_uid':"2003" ,
  "p1s9t1_permissions" : "a"}

#params['_task_sequence_list'] =json.JSONEncoder().encode([service1,service2,service3,service4])
params['_task_sequence_list'] =json.JSONEncoder().encode([service6])




return_value = requests.post('https://create-transaction-dot-dev-dgnet-watchdog.appspot.com/testing_add_task',data=params)
print(return_value)
