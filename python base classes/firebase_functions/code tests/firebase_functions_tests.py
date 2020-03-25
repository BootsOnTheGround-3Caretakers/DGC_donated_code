from __future__ import unicode_literals
import os
import sys
import logging
cwd = os.getcwd()
sys.path.insert(0,'../')
sys.path.insert(0,'../../Datavalidation')
from firebase_functions import FirebaseField as FF
from datavalidation import DataValidation



def test_function():
    test1 = FF()
    
    call_result = test1.setFieldValues("ROOT", FF.object_types.organization ,
                         FF.functions.update,"test22", FF.keys.organization_list)
    if call_result['success'] != True:
        print call_result
        return False
    
    call_result = test1.toDict()
    if call_result['success'] != True:
        print call_result['return_msg']
        print call_result['debug_data']
        return False
    
    print call_result['field']
    
    
test_function()



