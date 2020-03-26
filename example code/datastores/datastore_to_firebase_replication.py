from __future__ import unicode_literals
from google.appengine.ext import ndb
import json
import datetime
import string
import random
import logging
import time
from datavalidation import DataValidation
from datastore_functions import DatastoreFunctions as DSF
from firebase_functions import FirebaseField as FF
from datastore_functions import ReplicateToFirebaseFlag
from task_queue_functions import CreateTransactionFunctions
from GCP_return_codes import FunctionReturnCodes as RC
from GCP_datastore_logging import LoggingFuctions


    
        
class ReplicateToFirebase(object):
#ReplicateToFirebase must be declared first as it inherited by other Datastores

    def replicateEntityListToFirebase(self,entity_list,delete_flag = False):
        return_msg = "ReplicateToFirebase:replicateEntityListToFirebase "
        debug_data = []
        call_result = {}
        call_result = self.__replicateFromEntityList(entity_list,delete_flag)
        if call_result['success'] != True:
            logging.error(["errror updating firebase DB",call_result])
            return {'success': False,'return_msg':return_msg,'debug_data':debug_data}
        
        
        return {'success': True,'return_msg':return_msg,'debug_data':debug_data}




    def replicateEntityToFirebase(self,delete_flag = False):
        return_msg = "ReplicateToFirebase:replicateEntityToFirebase "
        debug_data = []
        call_result = {}
        call_result = self.__replicateFromEntityList([self],delete_flag)
        if call_result['success'] != True:
            logging.error(["errror updating firebase DB",call_result])
            return {'success': False,'return_msg':return_msg,'debug_data':debug_data}
        
        
        return {'success': True,'return_msg':return_msg,'debug_data':debug_data}


    def __replicateFromEntityList(self,entity_list,delete_flag =False):
        return_msg = "ReplicateToFirebase:replicateFromEntityList "
        debug_data = []
        call_result = {}
        
        # if this is a single entitty convert it to a list
        if type(entity_list) != list:
            entity_list = [entity_list]
        
        ## input validation
        
        call_result = self.checkValues([[entity_list,True,list,"len1","list_of_ndb_models"],
                                                        [delete_flag,True,bool]
                                                        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validaiton failed"
            return {'success': False,'return_msg':return_msg,'debug_data':debug_data}
        
        ## </end> input validation
        
        kind_names = [
                      "DsP1UserObjectAttributeRule",
                      "DsP1UserObjectAttributeRuleJoins",
                      ]
        
        kind_functions = [
                          self.__DsP1UserObjectAttributeRule,
                          self.__DsP1UserObjectAttributeRuleJoins,
                          ]
        
    ## process each entity and add it to the list to send to firebase
        firebase_fields = []
        for entity in entity_list:
            entity_kind = unicode(entity._get_kind())
            entity_id = entity.key.string_id()
            if entity_id == None:
                entity_id = ""
            else:
                entity_id = unicode(entity_id)
            
            kind_found = False
            for index1,kind in enumerate(kind_names):
                if entity_kind == kind:
                    kind_found = True
                    call_result = kind_functions[index1](entity_id,entity,delete_flag)
                    debug_data.append(call_result)
                    if call_result['success'] != RC.success:
                        return_msg += "replicating kind values for kind %s name/id %s failed" % (kind,entity_id)
                        return {'success': call_result['success'],'return_msg':return_msg,'debug_data':debug_data}
                    
                    firebase_fields += call_result['firebase_fields']
                    break
                
            if kind_found != True:
                return_msg += "could not find a function entry for kind:%s" % entity_kind
                logging.warning(return_msg)
                
        
        #nothing to send over            
        if len(firebase_fields) < 1:
            return {'success': True,'return_msg':return_msg,'debug_data':debug_data}
        
        params = {}
        
        params['transaction_id'] = "p1-firebase_replication"
        chars=string.ascii_lowercase + string.ascii_uppercase + string.digits
        params['transaction_id'] += ''.join(random.choice(chars) for _ in range(10))
        
        params['transaction_id'] += "-"
        params['transaction_id'] += datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S-%f')

        params['transaction_user_uid'] = 1
        firebase_task = {}
        #2 second delay to allow writes to hit datastore
        firebase_task["delay"] = "2"
        firebase_task["name"] = "p1s8t3-push-firebase-change"
        firebase_task["PMA"] = {"p1s8t3_fields" : json.JSONEncoder().encode(firebase_fields) }
        
        CTF = CreateTransactionFunctions()
        
        
        task_sequence= json.JSONEncoder().encode([firebase_task])
        task_sequence = unicode(task_sequence)
        call_result = CTF.createTransaction("p1", "1", "firebase-replication", task_sequence,None,params)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to create firebase replication transaction"
            return {'success': False,'return_msg':return_msg,'debug_data':debug_data}
        
        return {'success': True,'return_msg':return_msg,'debug_data':debug_data}

   
    def __DatastoreUser(self,entity_id,entity,delete_flag = False):
        return_msg = "ReplicateToFirebase:__DatastoreUser "
        debug_data = []
        call_result = {}
        firebase_fields = []
       

        debug_data_count = 0
        generated_fields =[]
        
    ##we need to get all the values in the record we are updating so we can put all needed info in firebase
        call_result = entity.kget(entity.key)
        if call_result['success'] != True:
            return_msg += "get of object attribute record failed"
            return {'success': False,'return_msg':return_msg,'debug_data':debug_data,'firebase_fields':firebase_fields}
        
        #ndb.Model overloads the = operator so we aren't overwriting the memory location of our current function
        self = call_result['get_result']
    ##</end>we need to get all the values in the record we are updating so we can put all needed info in firebase
    
    ## get all those values into a dictionary for easier access
        call_result = self.getDict(self,["firebase_uid","user_uid","user_web_uid","first_name",'last_name','contact_email'])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to get entity fields dictionary"
            return {'success': False,'return_msg':return_msg,'debug_data':debug_data,'firebase_fields':firebase_fields}

        entity_data = call_result['dictionary']
    ##</end> get all those values into a dictionary for easier access
        
        
        try:
            user_uid = entity_id.split("_",1)[1]
        except Exception as e:
            return_msg += "failed to parse user_uid from entity id:%s with exception:%s" % (entity_id,e)
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data,'firebase_fields':firebase_fields}
        
     
        
        firebase_location = "user/" + entity_data['firebase_uid']
    
    ## user web UID
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/meta_data/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  entity_data['contact_email'],
                                                   FF.keys.user_contact_email)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> user web UID
    
    ## user web UID
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/meta_data/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  entity_data['user_web_uid'],
                                                   FF.keys.user_web_uid)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> user web UID
    
    ## user internal UID
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/meta_data/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  unicode(entity_data['user_uid']),
                                                   FF.keys.user_uid)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> user internal UID
    
    
    ## user first name
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/meta_data/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  entity_data['first_name'],
                                                   FF.keys.user_first_name)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> user first name
    
    ## user last name
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/meta_data/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  entity_data['last_name'],
                                                   FF.keys.user_last_name)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> user last name
    
    
    
    ## create user firebase_entry delete prevention key 
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/dog_house/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  "deletion_prevention_key",
                                                   FF.keys.deletion_prevention_key)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user firebase_entry delete prevention key
    
    ## create web ui notifications last_updated key
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/webui_notification_update/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  "1",
                                                   FF.keys.last_updated)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create web ui notifications last_updated key
    
    ## create user object attribute rule joins updated notification
        rule_join = FF()
        call_result = rule_join.setFieldValues(firebase_location + "/updated_user_notifications/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  unicode(int(time.time())),
                                                   FF.keys.last_updated)
        debug_data.append(call_result)
            
        call_result = rule_join.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user object attribute rule joins updated notification
    
    
    ## create user object attribute rule updated notification
        rule = FF()
        call_result = rule.setFieldValues(firebase_location + "/updated_user_rules/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  unicode(int(time.time())),
                                                   FF.keys.last_updated)
        debug_data.append(call_result)
            
        call_result = rule.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user object attribute rule updated notification
    
    ## create user payout change updated notification
        rule = FF()
        call_result = rule.setFieldValues(firebase_location + "/payout_change/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  unicode(int(time.time())),
                                                   FF.keys.last_updated)
        debug_data.append(call_result)
            
        call_result = rule.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user payout change updated notification
    
    ## create user billing change updated notification
        rule = FF()
        call_result = rule.setFieldValues(firebase_location + "/billing_change/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  unicode(int(time.time())),
                                                   FF.keys.last_updated)
        debug_data.append(call_result)
            
        call_result = rule.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user billing change updated notification
    
    ## create user notificaiton rules delete prevention key 
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/notification_rules/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  "deletion_prevention_key",
                                                   FF.keys.deletion_prevention_key)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user notificaiton rules delete prevention key
    
    ## create user notification rule joins delete prevention key 
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location + "/notification_rule_joins/",
                                                  FF.object_types.object,
                                                  FF.functions.update,
                                                  "deletion_prevention_key",
                                                   FF.keys.deletion_prevention_key)
        debug_data.append(call_result)
            
        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count +2
    ##</end> create user notification rule joins delete prevention key
        
        debug_data_count = debug_data_count * -1 
        for data in debug_data[debug_data_count:]:
            if data['success'] != True:
                return_msg += "setting user_record or type record failed"
                return {'success': False,'return_msg':return_msg,'debug_data':debug_data,'firebase_fields':firebase_fields}
        
        
        firebase_fields = generated_fields
        return {'success': True,'return_msg':return_msg,'debug_data':debug_data,'firebase_fields':firebase_fields}



    def __DsP1UserObjectAttributeRule(self, entity_id, entity, delete_flag=False):
        return_msg = "ReplicateToFirebase:__DsP1UserObjectAttributeRule "
        debug_data = []
        call_result = {}
        firebase_fields = []

        debug_data_count = 0
        generated_fields = []

        ##we need to get all the values in the record we are updating so we can put all needed info in firebase
        call_result = entity.kget(entity.key)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "get of object attribute record failed"
            return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data,
                    'firebase_fields': firebase_fields}

        ##</end>we need to get all the values in the record we are updating so we can put all needed info in firebase

        ## get all those values into a dictionary for easier access
        call_result = entity.getDict(entity, ["name", "description", "eval_rule", 'user_uid', 'UI_json_data'])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to get entity fields dictionary"
            return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data,
                    'firebase_fields': firebase_fields}

        entity_data = call_result['dictionary']
        ##</end> get all those values into a dictionary for easier access

        ## delete record json entries
        if delete_flag == True:
            entity_data['delete'] = True
        ##</end> delete record json entries

        ## get the firebase_uid of the user
        user_entry_key = ndb.Key(DatastoreUser._get_kind(), "usr_{}".format(entity_data['user_uid']))
        call_result = DSF.kget(user_entry_key)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to get processor object fast reference"
            return {'success': RC.datastore_failure,'return_msg':return_msg,'debug_data':debug_data}
        user_entry = call_result['get_result']
        ##</end> get the firebase_uid of the user

        rule_uid = entity_id

        firebase_location = "usr_{}/notification_rules/".format(entity_data['user_uid'])

        ## create json dict to send
        try:
            json_data = unicode(json.JSONEncoder().encode(entity_data))
        except Exception as e:
            return_msg += "json encoding of rule entities failed with exception:%s" % e
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data}
        ##</end> create json dict to send

        ## Json encoded data of the entire data entity
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location,
                                                    FF.object_types.object,
                                                    FF.functions.update,
                                                    json_data)
        firebase_entry.setManualKey(rule_uid)
        debug_data.append(call_result)

        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count + 2
        ##</end> Json encoded data of the entire data entity

        debug_data_count = debug_data_count * -1
        for data in debug_data[debug_data_count:]:
            if data['success'] != True:
                return_msg += "setting user_record or type record failed"
                return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data,
                        'firebase_fields': firebase_fields}

        firebase_fields = generated_fields
        return {'success': True, 'return_msg': return_msg, 'debug_data': debug_data, 'firebase_fields': firebase_fields}

    def __DsP1UserObjectAttributeRuleJoins(self, entity_id, entity, delete_flag=False):
        return_msg = "ReplicateToFirebase:__DsP1UserObjectAttributeRuleJoins "
        debug_data = []
        call_result = {}
        firebase_fields = []

        debug_data_count = 0
        generated_fields = []

        ##we need to get all the values in the record we are updating so we can put all needed info in firebase
        call_result = entity.kget(entity.key)
        if call_result['success'] != True:
            return_msg += "get of record failed"
            return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data,
                    'firebase_fields': firebase_fields}

        ##</end>we need to get all the values in the record we are updating so we can put all needed info in firebase

        ## get all those values into a dictionary for easier access
        call_result = entity.getDict(entity, [
            "object_uid", "attribute_uid", "rule_uid", 'user_uid', 'eval_rule', 'name', 'type_doghouse',
            'type_instant', 'type_daily', 'last_triggered', 'tripped_flag', 'snooze_until'
        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to get entity fields dictionary"
            return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data,
                    'firebase_fields': firebase_fields}

        entity_data = call_result['dictionary']
        ##</end> get all those values into a dictionary for easier access

        ## delete record json entries
        if delete_flag == True:
            entity_data['delete'] = True
        ##</end> delete record json entries

        ## get the firebase_uid of the user
        user_entry_key = ndb.Key(DatastoreUser._get_kind(), "usr_{}".format(entity_data['user_uid']))
        call_result = DSF.kget(user_entry_key)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "failed to get processor object fast reference"
            return {'success': RC.datastore_failure,'return_msg':return_msg,'debug_data':debug_data}
        user_entry = call_result['get_result']
        ##</end> get the firebase_uid of the user

        notfication_uid = entity_id

        firebase_location = "usr_{}/notification_rule_joins/".format(entity_data['user_uid'])

        entity_data['last_updated'] = unicode(int(time.time()))
        ## create json dict to send
        try:
            json_data = unicode(json.JSONEncoder().encode(entity_data))
        except Exception as e:
            return_msg += "json encoding of entity data failed with exception:%s" % e
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data}
        ##</end> create json dict to send

        ## Json encoded data of the entire data entity
        firebase_entry = FF()
        call_result = firebase_entry.setFieldValues(firebase_location,
                                                    FF.object_types.object,
                                                    FF.functions.update,
                                                    json_data)
        firebase_entry.setManualKey(notfication_uid)
        debug_data.append(call_result)

        call_result = firebase_entry.toDict()
        debug_data.append(call_result)
        generated_fields.append(call_result['field'])
        debug_data_count = debug_data_count + 2
        ##</end> Json encoded data of the entire data entity

        debug_data_count = debug_data_count * -1
        for data in debug_data[debug_data_count:]:
            if data['success'] != True:
                return_msg += "setting user_record or type record failed"
                return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data,
                        'firebase_fields': firebase_fields}

        firebase_fields = generated_fields
        return {'success': True, 'return_msg': return_msg, 'debug_data': debug_data, 'firebase_fields': firebase_fields}


class DatastoreUser(ndb.Model,DSF,ReplicateToDatastore,ReplicateToDatastoreFlag,ReplicateToFirebaseFlag,ReplicateToFirebase):
    #key user_uid
    user_uid= ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,"bigint","greater0"]
    user_web_uid = ndb.StringProperty(required=True)
    _rule_user_web_uid = [True,unicode,"len1","user_web_uid"]
    first_name = ndb.StringProperty(required=True)
    _rule_first_name = [True,unicode,"len1","person_name"]
    last_name = ndb.StringProperty(required=True)
    _rule_last_name = [True,unicode,"len1","person_name"]
    contact_email = ndb.StringProperty(required=True)
    _rule_contact_email = [True,unicode,"len1","email_address"]
    google_account_name = ndb.StringProperty(required=True)
    _rule_google_account_name = [True,unicode,"len1","google_account_name"]
    account_type = ndb.IntegerProperty(required=True)
    _rule_account_type = [True,long,"account_type"]
    creation_date = ndb.DateTimeProperty(required=False,auto_now_add=True)
    _rule_creation_date = [False,datetime]
    firebase_uid = ndb.StringProperty(required=True)
    _rule_firebase_uid = [True,unicode,"len1"]
    
    

class DatastoreUser(ndb.Model,DSF,ReplicateToFirebaseFlag,ReplicateToFirebase):
    #key user_uid
    user_uid= ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,"bigint","greater0"]
    user_web_uid = ndb.StringProperty(required=True)
    _rule_user_web_uid = [True,unicode,"len1","user_web_uid"]
    first_name = ndb.StringProperty(required=True)
    _rule_first_name = [True,unicode,"len1","person_name"]
    last_name = ndb.StringProperty(required=True)
    _rule_last_name = [True,unicode,"len1","person_name"]
    contact_email = ndb.StringProperty(required=True)
    _rule_contact_email = [True,unicode,"len1","email_address"]
    google_account_name = ndb.StringProperty(required=True)
    _rule_google_account_name = [True,unicode,"len1","google_account_name"]
    account_type = ndb.IntegerProperty(required=True)
    _rule_account_type = [True,long,"account_type"]
    creation_date = ndb.DateTimeProperty(required=False,auto_now_add=True)
    _rule_creation_date = [False,datetime]
    firebase_uid = ndb.StringProperty(required=True)
    _rule_firebase_uid = [True,unicode,"len1"]
    



class DsP1UserObjectAttributeRuleJoins(
    ndb.Model, DSF, ReplicateToFirebaseFlag, ReplicateToFirebase):
    object_uid = ndb.IntegerProperty(required=True)
    _rule_object_uid = [True, long, "bigint", "greater0"]

    attribute_uid = ndb.IntegerProperty(required=True)
    _rule_attribute_uid = [True, long, "bigint", "greater0"]

    rule_uid = ndb.StringProperty(required=True)
    _rule_rule_uid = [True, unicode, "len1", "len<999"]

    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True, long, "bigint", "greater0"]

    eval_rule = ndb.StringProperty(required=True)
    _rule_eval_rule = [True, unicode, "len<999"]

    name = ndb.StringProperty(required=True)
    _rule_name = [True, unicode, "len1", "len<151"]

    type_doghouse = ndb.BooleanProperty(required=False, default=False)
    _rule_type_doghouse = [False, bool]

    type_instant = ndb.BooleanProperty(required=False, default=False)
    _rule_type_instant = [False, bool]

    type_daily = ndb.BooleanProperty(required=False, default=False)
    _rule_type_daily = [False, bool]

    last_triggered = ndb.DateTimeProperty(required=False)
    _rule_last_triggered = [False, datetime]

    #how long between the retrigger of instant email alerts
    retrigger_time = ndb.IntegerProperty(required=True)
    _rule_retrigger_time = [True,long,"bigint","greater0"]

    tripped_flag = ndb.BooleanProperty(required=False, default=False)
    _rule_tripped_flag = [False, bool]

    snooze_until = ndb.DateTimeProperty(required=False)
    _rule_snooze_until = [False, datetime]
