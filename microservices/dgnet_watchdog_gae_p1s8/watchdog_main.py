from __future__ import unicode_literals
from __future__ import absolute_import
import os
import sys
import webapp2
import json
import time
from google.appengine.ext import ndb
from google.appengine.api import app_identity
from google.appengine.api import urlfetch

import urllib
cwd = os.getcwd()
sys.path.insert(0,'includes')
from datavalidation import DataValidation
from back_end_global_settings import GlobalSettings as GSB
from GCP_return_codes import FunctionReturnCodes as RC
from back_end_services import Services as GSB_services
from back_end_datastores import Datastores as GSB_datastores
from datastore_functions import DatastoreFunctions as DSF
from firebase_updater import FirebaseUpdater
import secret


app_id = unicode(app_identity.get_application_id()).lower()

EMAIL_API_KEY = unicode(secret.get_email_api_key())
FIREBASE_URL = unicode(secret.get_firebase_url())
FIREBASE_KEY = unicode(secret.get_firebase_key())
FIREBASE_DOMAIN = unicode(secret.get_firebase_domain())
FIREBASE_ID = int(secret.get_firebase_id())

DEV_FLAG = ""
   
        
class PushFirebaseChange(webapp2.RequestHandler,DataValidation):
    def post(self):
        task_id = "user-interface-tx:PushFirebaseChange:post"
        debug_data = []
        call_result = self.__ProcessPushTask()
        debug_data.append(call_result)
        
        params= {}
        for key in self.request.arguments():
            params[key] = self.request.get(key,None)
        task_functions = TaskQueueFunctions()
                        
        if call_result['success'] != True:            
            
            task_functions.logError(call_result['success'],task_id, params, self.request.get('X-AppEngine-TaskName',None), self.request.get('transaction_id',None), call_result['return_msg'], debug_data, self.request.get('transaction_user_uid',None))
            task_functions.logTransactionFailed(self.request.get('transaction_id',None), call_result['success'])
            
            if call_result['success'] == RC.failed_retry:
                self.response.set_status(500)
            elif call_result['success'] == RC.input_validation_failed:
                self.response.set_status(200)
            elif call_result['success'] == RC.ACL_check_failed:
                self.response.set_status(200)
            else:
                self.response.set_status(200)
            return
        
    ## go to the next function
        task_functions = TaskQueueFunctions()       
        #just a place holder since this task doesn't create results
        task_results = {}
        #most requests to this function are single tasks requests and we have to have a delay so the created transaction record exists so we can succuessfully delete it
        time.sleep(1)
        call_result = task_functions.nextTask(task_id,task_results,params)
        debug_data.append(call_result)
        if call_result['success'] != True:
            task_functions.logError(call_result['success'],task_id, params, self.request.get('X-AppEngine-TaskName',None), self.request.get('transaction_id',None), call_result['return_msg'], debug_data, self.request.get('transaction_user_uid',None))
    ##</end> go to the next function
        self.response.set_status(200)
            
    
    def __ProcessPushTask(self):
        return_msg = "PushFirebaseChange:__processPushTask "
        task_id = "user-interface-tx:PushFirebaseChange:__processPushTask"
        call_result = {}
        debug_data = []
        task_results = {}
        global FIREBASE_URL
        global FIREBASE_KEY
        global FIREBASE_DOMAIN
        global FIREBASE_ID

    ## verify input data we can skip verifying fields since the WatchdogFirebase class will
        try:
            fields = json.JSONDecoder().decode(self.request.get(GSB.task_args.s8t3_fields))
        except Exception as e:
            return_msg += "exception when decoding json data. exception:%s" % e
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data, 'task_results': task_results}

        call_result = self.checkValues([[fields,True,list,'firebase_instruction',"len1"]
                                      ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data}
    ##</end> verify input data we can skip verifying fields since the WatchdogFirebase class will   

    ## for each field add the parent folder it should be if its needed
        for entry in fields:
        
        ## system (prcoessors) folder
            if entry['id'][:4] == "sys_":
                entry['id'] = "system/" + entry['id']
                continue
        ##</end> system (prcoessors) folder
        
        ## user folder
        
            ## guest user logic
            if  ('6NWoK3gqY6ccra26Smt94szQodk2' in entry['id'] or 'usr_2180/' in entry['id']  or 'usr_2181/' in entry['id'])  and DEV_FLAG == "":
                entry['id'] = entry['id'].replace("usr_2181/","user/guest/")
                entry['id'] = entry['id'].replace("usr_2180/","user/guest/")
                entry['id'] = entry['id'].replace("user/6NWoK3gqY6ccra26Smt94szQodk2/","guest/")
                continue
            ##</end guest user logic
            
            if entry['id'][:4] == "usr_":
                replace_string,not_used = entry['id'].split('/',1)
                call_result = self.__getUserFirebaseUid(entry['id'])
                debug_data.append(call_result)
                if call_result['success'] != True:
                    return_msg += " .msg: failed to get firebase uid for field id:%s" % unicode(entry['id'])
                    #FIXME make this hard fail still, but attempt to complete all the records
                    return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data}
                user_firebase_uid = call_result['firebase_uid']
                entry['id'] = entry['id'].replace(replace_string,user_firebase_uid)
                entry['id'] = "user/" + entry['id']
                continue
        ##</end> user folder

        ## object attribute
            if entry['id'][:8] == "obj_atr_":
                call_result = self.__getObjectAttributeSystem(entry['id'])
                debug_data.append(call_result)
                if call_result['success'] != True:
                    return_msg += " .msg: failed to get processor uid for field id:%s" % unicode(entry['id'])
                    #FIXME make this hard fail still, but attempt to complete all the records
                    return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data}
                
                entry['id'] = "system/sys_" + unicode(call_result['processor_uid']) + "/object_list/obj_" +  unicode(call_result['object_uid']) +"/attribute_list/" + entry['id']
                
                continue
        ##</end> object attribute
        
        ## object attribute history record
            if entry['id'][:16] == "history_obj_atr_":
                entry['id'] = "history_obj_atr/" + entry['id']
        ##</end> object attribute history record
            
        ## object
            if entry['id'][:4] == "obj_":
                call_result = self.__getObjectSystem(entry['id'])
                debug_data.append(call_result)
                if call_result['success'] != True:
                    return_msg += " .msg: failed to get processor uid for field id:%s" % unicode(entry['id'])
                    #FIXME make this hard fail still, but attemp to complete all the records
                    return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data}
                
                entry['id'] = "system/sys_" + unicode(call_result['processor_uid']) + "/object_list/" + entry['id']
                continue
        ##</end> object
        
            continue            
    ##</end> for each field add the parent folder it should be if its needed

        fb_update = FirebaseUpdater()
        call_result = fb_update.initialize(FIREBASE_URL, FIREBASE_KEY, FIREBASE_DOMAIN, FIREBASE_ID)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to initialize firebase updater classs"
            return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data, 'task_results': task_results}
      
        call_result = fb_update.process_request(fields)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to update or delete firebase entry"
            return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data, 'task_results': task_results}

        return {'success': RC.success,'return_msg':return_msg,'debug_data':debug_data, 'task_results': task_results}
      
        
    def __getObjectSystem(self,field_id=None):
        return_msg = "PushFirebaseChange:__getObjectSystem "
        call_result = {}
        debug_data = []
        processor_uid = 0
    ## input validation
        try:
            #get only the top level folder
            if("/" in field_id):
                field_id,other_data = field_id.split("/",1)
            
            prefix,object_uid = field_id.split("_",1)
        except Exception as e:
            return_msg += "split of field id failed with exception:%s" % unicode(e)
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,'processor_uid': processor_uid}
        
        call_result = self.ruleCheck([[object_uid,GSB.post_data_rules.internal_uid]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,'processor_uid': processor_uid}
        
        object_uid = long(object_uid)
    ##</end> input validation    
        
    ## get the processor uid associated with the object
        object_entry = GSB_datastores.processor_objects_fast_ref()
        object_entry_key = ndb.Key(GSB_datastores.processor_objects_fast_ref._get_kind(),
                                   "obj_" + unicode(object_uid))
        call_result = DSF.kget(object_entry_key)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to get processor object fast reference"
            return {'success': RC.datastore_failure,'return_msg':return_msg,'debug_data':debug_data,'processor_uid': processor_uid}
        
        object_entry = call_result['get_result']
        if object_entry == None:
            return_msg += "no processor object fast reference exists for id:%s" % unicode(field_id)
            #this is a failed retry due to the fact that sometimes we get an object before its datastore entry is written
            return {'success': RC.failed_retry,'return_msg':return_msg,'debug_data':debug_data,'processor_uid': processor_uid}
        
        processor_uid = object_entry.processor_uid
    ##</end> get the processor uid associated with the object
        
        return {'success': RC.success,'return_msg':return_msg,'debug_data':debug_data,'processor_uid': processor_uid}

    def __getObjectAttributeSystem(self,field_id=None):
        return_msg = "PushFirebaseChange:__getObjectSystem "
        call_result = {}
        debug_data = []
        processor_uid = 0
        object_uid = 0
        
    ## input validation
        try:
            #get only the top level folder
            if("/" in field_id):
                field_id,other_data = field_id.split("/",1)
            
            field_id = field_id.replace("obj_atr_","")
            object_uid,attribute_uid = field_id.split("-",1)
        except Exception as e:
            return_msg += "split of field id failed with exception:%s" % unicode(e)
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,
                    'object_uid': object_uid,'processor_uid': processor_uid}
        
        call_result = self.ruleCheck([[object_uid,GSB.post_data_rules.internal_uid]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,
                    'object_uid': object_uid,'processor_uid': processor_uid}
        
        object_uid = long(object_uid)
    ##</end> input validation    
    
    ## get the processor uid
        call_result = self.__getObjectSystem("obj_" + unicode(object_uid))
        if call_result['success'] != True:
            return_msg += "failed to get processor uid of field id:%s" % unicode(field_id)
            return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data,
                    'object_uid': object_uid,'processor_uid': processor_uid}
        
        processor_uid = call_result['processor_uid']
    ##</end> get the processor uid
        return {'success': RC.success,'return_msg':return_msg,'debug_data':debug_data,
                    'object_uid': object_uid,'processor_uid': processor_uid}
    
    
    def __getUserFirebaseUid(self,field_id=None):
        return_msg = "PushFirebaseChange:__getUserFirebaseUid "
        call_result = {}
        debug_data = []
        firebase_uid = ''
        
    ## input validation
        try:
            #get only the top level folder
            if("/" in field_id):
                user_uid,other_data = field_id.split("/",1)
            
            user_uid = user_uid.replace("usr_","")
        except Exception as e:
            return_msg += "split of field id failed with exception:%s" % unicode(e)
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,'firebase_uid': firebase_uid}
        
        call_result = self.ruleCheck([[user_uid,GSB.post_data_rules.internal_uid]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,'firebase_uid': firebase_uid}
        
        user_uid = long(user_uid)
    ##</end> input validation    
    
    ## get the users firebase uid
        user = GSB_datastores.user()
        user_key = ndb.Key(GSB_datastores.user._get_kind(), "user_" + unicode(user_uid))
        call_result = DSF.kget(user_key)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "get of user record failed"
            return {'success': RC.failed_retry,'return_msg':return_msg,'debug_data':debug_data,'firebase_uid':firebase_uid}
        
        user = call_result['get_result']
        if user == None:
            return_msg += "specified user not found in datastore"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,'firebase_uid':firebase_uid}
        
        
        firebase_uid = user.firebase_uid
    ##</end> get the users firebase uid

        return {'success': RC.success,'return_msg':return_msg,'debug_data':debug_data,'firebase_uid': firebase_uid}
     
        

    
app = webapp2.WSGIApplication([
    (GSB_services.user_interface_TX.push_firebase_change.url,PushFirebaseChange),
    (GSB_services.user_interface_TX.push_mass_firebase_changes.url,PushFirebaseChange),
], debug=True)
