from __future__ import unicode_literals
from datavalidation import DataValidation
from types import InstanceType
import os
import sys
import datetime
cwd = os.getcwd()
test = DataValidation()

#result = test.ruleCheck([ ["kevin@nova-wd.com",[True,unicode,"email_address"]] ])

#result = test.checkValues([[[var],False,list,"len1","sqlcolumnlist"]])


service0 = {}
service0['queue_name'] = "create-organization"
service0['url'] = ""
#service0['method'] = "PULL"
service0['task_result_assignments'] = {'s1t4_organization_uid':'internal_uid',
's1t5_organization_uid':'internal_uid','s1t6_organization_uid':'internal_uid'}

service1 = {}
service1['queue_name'] = "create-object"
service1['url'] = ""
service1['method'] = "PULL"
service1['task_result_assignments'] = {}


service2 = {}
service2['queue_name'] = "create-user"
service2['url'] = ""
service2['method'] = "PULL"
service2['task_result_assignments'] = {}

service3 = {}
service3['queue_name'] = "create-object-attribute"
service3['url'] = ""
service3['method'] = "PULL"
service3['task_result_assignments'] = {}

service4 = {}
service4['queue_name'] = "create-user-attribute"
service4['url'] = ""
service4['method'] = "PULL"
service4['task_result_assignments'] = {}


service5 = {}
service5['queue_name'] = "create-organization-attribute"
service5['url'] = ""
service5['method'] = "PULL"
service5['task_result_assignments'] = {}


test_data1 = [1,2,3,4]
call_result = test.checkValues([[test_data1,True,list,"list_of_uid_numbers"]])
if call_result['success'] != True:
    print("list_of_uid_numbers positive test failed")
    print(call_result)


test_data1 = [1,2,3,"a"]
call_result = test.checkValues([[test_data1,True,list,"list_of_uid_numbers"]])
if call_result['success'] == True:
    print("list_of_uid_numbers negative test failed")
    print(call_result)

#task_queue_list=[service0,service1,service2,service3,service4,service5]
#result = test.checkValues([[task_queue_list,True,list,"task_queue_list"]])
#print result