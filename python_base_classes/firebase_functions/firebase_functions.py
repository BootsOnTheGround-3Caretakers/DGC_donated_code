from __future__ import unicode_literals
import os
import sys
cwd = os.getcwd()
sys.path.insert(0,'../Datavalidation')
from datavalidation import DataValidation


class FirebaseFunctions():
    update = "update"
    delete = "delete"
    append = "append"
    
class FieldObjectTypes():
        organization = "organization"
        user= "user"
        attribute = "attribute"
        object = "object"
        processor = "system"
        email = "email"
        
        
class FieldKeys():


## notification rule keys
    rule_logic = 'rule_logic'
    eval_statement = 'eval'
    
##</end> notification rule keys    

## object attribute keys
    processor_uid = "processor_uid"
##</end> object attribute keys

## universal keys
    name = "name"
    name_key = "name<~!!~>KEY_REF"
    description = "description"
    description_key = "description<~!!~>KEY_REF"
    last_updated = "last_updated"
##</end> universal keys    

## user/ keys
    user_first_name = "first_name"
    user_last_name = "last_name"
    user_uid = "uid"
    user_web_uid ="web_uid"
    user_contact_email = "contact_email"
    user_account_type = "account_type"
    user_account_email = "firebase_account"
    user_org_permissions = "permissions"
##</end> user/ keys    

## /organization keys
    org_location = "org_location"
##</end> /organization keys

    object_type = "type"
    object_type_key = "type<~!!~>KEY_REF"
    internal_uid = "uid"
    
    disabled = "disabled_"
    child_list="child_list"
    organization_list= "organization_list"
    user_list= "user_list"
    notification_list = "notification_list"
    processor_list = "system_list"
    object_list = "object_list"
    organization_type = "type"
    organization_type_key = "type<~!!~>KEY_REF"
    #only for patron organizations
    organization_partner_name = "partner organization name"
    organization_partner_uid = "partner_organization_uid"
    uid = "uid"
    parent = "parent_"
    object_attribute_record_datetime = "Last Changed"
    object_attribute_record_value = "value"
    object_settable_value_enabled = "is_settable"
    object_settable_value_type = "settable_value_type"
    object_settable_value_min = "settable_value_min"
    object_settable_value_max = "settable_value_max"
    object_settable_value_string_values = "settable_value_string_values"
    object_tx_rx_msgs = "tx_rx_msgs"
    object_log_value = "log_value"
    object_attribute_rule_eval_rule = "eval_rule"
    
    user_id = "user_id"
    
    
    user_update_occurred = "update_occurred"
    processor_hardware_uid = "System unique identifier"
    deletion_prevention_key = "deletion_prevention_key"

class FirebaseField(DataValidation):
    functions = FirebaseFunctions
    object_types = FieldObjectTypes
    keys = FieldKeys
    
    def __init__(self):
        self.__field = {"id": "", "object type" : "", "function" : "" , "value" : "", "key" : "" }
        #~tracks if a key was manually set instead of selected from FieldKeys class. if this is true validate function does not check key against the class
        self.manual_key_set = False

    def setFieldValues(self,new_id=None,object_type=None,function=None,value=None,key=None):
        return_msg = "FirebaseField:setFieldValues "
        debug_data = []
        if key != None:
            debug_data.append(self.setKey(key))
        
        if object_type != None:
            debug_data.append(self.setObjectType(object_type))
        
        if function != None:
            debug_data.append(self.setFunction(function))

        if value != None:
            debug_data.append(self.setValue(value))
            
        if key != None:
            debug_data.append(self.setKey(key))
            
        if id != None:
            debug_data.append(self.setId(new_id))
        
        for data in debug_data:
            if data['success'] != True:
                return_msg += "setting a value failed. see debug data for details"
                return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
            
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}

    
    #~used to set a key that doesn't exist in the FieldKeys class


    def setManualKey(self,new_key=None):
        debug_data = []
        return_msg = "FirebaseField:setManualKey "
        
        
        call_result = self.checkValues([[new_key,True,unicode,"len1"]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
        self.manual_key_set = True
        self.__field["key"] = new_key
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}

        
    def setKey(self,new_key=""):
        debug_data = []
        return_msg = "FirebaseField:setKey "
        key_found_flag = False
        
        #make sure the new key exists in the our keys class
        for key in self.keys.__dict__:
            if self.keys.__dict__[key] == new_key:
                key_found_flag = True
                break
        
        if key_found_flag != True:
            return_msg+= "invalid key %s." % new_key
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
        self.__field["key"] = new_key
        
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
      
    def setValue(self,new_value=None):
        debug_data = []
        return_msg = "FirebaseField:setValue "
        
        call_result = self.checkValues([[new_value,False,unicode]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
        self.__field["value"] = new_value
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}

    def setFunction(self,new_function=""):
        debug_data = []
        return_msg = "FirebaseField:setFunction "
        function_found_flag = False
        
        #make sure the new function exists in the our functions class
        for key in self.functions.__dict__:
            if self.functions.__dict__[key] == new_function:
                function_found_flag = True
                break
        
        if function_found_flag != True:
            return_msg+= "invalid function %s." % new_function
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
        self.__field["function"] = new_function
        
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
          
    def setObjectType(self,new_object_type=""):
        debug_data = []
        return_msg = "FirebaseField:setObjectType "
        type_found_flag = False
        
        #make sure the new type exists in the our object types class
        for key in self.object_types.__dict__:
            if self.object_types.__dict__[key] == new_object_type:
                type_found_flag = True
                break
        
        if type_found_flag != True:
            return_msg+= "invalid object type %s." % new_object_type
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
        self.__field['object type'] = new_object_type
        
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
  
    def setId(self,new_id=None):
        call_result = {}
        debug_data = []
        return_msg = "FirebaseField:setIdToUid "
        
        
        #root is the only non-uid value the id can be
        if type(new_id) == unicode and new_id.lower() == "root":
            self.__field["id"] = "root"
            return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    
        
        call_result = self.checkValues([[new_id,True,unicode,"len1"]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
        self.__field["id"] = new_id
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    
    def validate(self):
        debug_data = []
        return_msg = "FirebaseField:validate "
        
        fail_flag = False
        
        if self.__field["id"] == None or self.__field["id"] == "":
            return_msg += " msg:id value isn't set."
            fail_flag = True
        
        if self.__field["object type"] == None or self.__field["object type"] == "":
            return_msg += " msg:object type isn't set."
            fail_flag = True
        
        if self.__field["function"] == None or self.__field["function"] == "":
            return_msg += " msg:function isn't set."
            fail_flag = True
        
        if self.__field["key"] == None or self.__field["key"] == "":
            return_msg += " msg:key isn't set."
            fail_flag = True
        
        if (self.__field["function"] != "delete" and 
            (self.__field["value"] == "" or self.__field["value"] == None)):
            return_msg += " msg:value isn't set."
            fail_flag = True
        
        if fail_flag == False:
            return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
        else:
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data}
        
    def toDict(self):
        debug_data = []
        return_msg = "FirebaseField:toDict "
        
        call_result = self.validate()
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "validation of values inside class failed see debug data"                
            return {'success': False, 'return_msg': return_msg,'debug_data' :debug_data, 'field': {}}
        
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data,'field':self.__field}
        
        
        
    