from __future__ import unicode_literals
import logging
import string
import random
from datetime import datetime
from six import integer_types
if len(integer_types) == 1:
    long = integer_types[0]
from six import text_type as unicode
try:
    from google.cloud import ndb
except:
    from google.appengine.ext import ndb
from GCP_return_codes import FunctionReturnCodes as RC
from datavalidation import DataValidation

### datastores for logging data

class LogSuccess(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)


class LogGeneralError(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)
    
class LogFirebaseReplication(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)

class LogDatastoreFailure(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)

class LogMemcacheFailure(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)



class LogSqlFailure(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)




class LogInputValidation(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)



class LogAclCheck(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)



class LogDeleteTask(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)

class LogQueuing(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)


class LogBillingError(ndb.Model):
    task_id=ndb.StringProperty(required=False)
    params=ndb.TextProperty(required=False)
    name=ndb.StringProperty(required=False)
    transaction_id=ndb.StringProperty(required=False)
    error_msg=ndb.StringProperty(required=False)
    debug_data=ndb.TextProperty(required=False)
    transaction_user_uid=ndb.StringProperty(required=False)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)



class LogTransactionCreated(ndb.Model):
    params=ndb.TextProperty(required=True)
    transaction_id=ndb.StringProperty(required=True)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)
    _use_cache = False
    _use_memcache = False
#used to track the active number of transactions
class TransactionFinishedLog(ndb.Model):
    transaction_id=ndb.StringProperty(required=True)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)
    _use_cache = False
    _use_memcache = False

#used to track the active number of transactions


class LogTransactionFailed(ndb.Model):
    transaction_id=ndb.StringProperty(required=True)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)
    _use_cache = False
    _use_memcache = False


class LogStripeTransaction(ndb.Model):
    params=ndb.TextProperty(required=True)
    stripe_object = ndb.TextProperty(required=True)
    task_id=ndb.StringProperty(required=True)
    user_uid=ndb.IntegerProperty(required=True)
    datetime_stamp = ndb.DateTimeProperty(required=False,auto_now_add=True)
    _use_cache = False
    _use_memcache = False
    
class LoggingFuctions(DataValidation):
    #~these values matche those in back_end_global_settings.py FunctionReturnCodes
    log_destinations = [[RC.failed_retry,LogGeneralError],
                        [RC.success,LogSuccess],
                        [RC.ACL_check_failed,LogAclCheck],
                        [RC.input_validation_failed,LogInputValidation],
                        [RC.queuing_task_failed,LogQueuing],
                        [RC.firebase_replication_retry,LogFirebaseReplication],
                        [RC.delete_task_failed,LogDeleteTask],
                        [RC.datastore_failure,LogDatastoreFailure],
                        [RC.datastore_failed_no_retry,LogDatastoreFailure],
                        [RC.sql_failure,LogSqlFailure],
                        [RC.billing_error,LogBillingError],
                        [RC.memcache_failure,LogMemcacheFailure]
                        ]
    
    
    #~log an error to the transaction-logging service by creating a task in its task_queue.  If this fails it logs the information to the standard error log.
    def logError(self,error_type=None,task_id=None,params=None,name=None,transaction_id=None,error_msg=None,debug_data=None,transaction_user_uid=None):
        error_data = {}
        
        log_id = None
    ## generate a unique id for this log entry if possible
        if type(transaction_id) == unicode and len(transaction_id) > 20: 
            log_id = transaction_id
        elif  type(task_id) == unicode and len(task_id) > 1:
            chars=string.ascii_lowercase + string.ascii_uppercase + string.digits    
            log_id = task_id + "-"
            log_id += ''.join(random.choice(chars) for _ in range(10))
            log_id += "-" + unicode(datetime.now().strftime('%Y-%m-%d-%H-%M-%S-%f'))
        else:
            log_id= None
    ##</end> generate a unique id for this log entry if possible             
    
    ## set which log this entry should go to, if one isn't specified go to the failed retry log
        log_entry = None
        for destination in self.log_destinations:
            if destination[0] == error_type:
                if log_id != None: 
                    log_entry = destination[1](id=transaction_id)
                else:
                    log_entry = destination[1]()
        
        if log_entry == None:
            if log_id != None: 
                log_entry = LogGeneralError(id=transaction_id)
            else:
                log_entry = LogGeneralError()
    ##</end> set which log this entry should go to, if one isn't specified go to the failed retry log    
        
        #~the transaction ID that was generated by the create transaction service
        if transaction_id != None:
            if type(transaction_id) in (unicode,str):
                log_entry.transaction_id = transaction_id
            else:
                log_entry.transaction_id = unicode(transaction_id)

            error_data['transaction_id'] = transaction_id
        #~the user who created  the call to the create transaction service
        if transaction_user_uid != None:
            if type(params) in (unicode,str):
                log_entry.transaction_user_uid = transaction_user_uid
            else:
                log_entry.transaction_user_uid = unicode(transaction_user_uid)
            
            error_data['transaction_user_uid'] = transaction_user_uid
        #~the identifier for which service, task_queue, and class created the error message.  The format for this should be "service:task_queue:class name"
        if task_id != None:
            if type(params) in (unicode,str):
                log_entry.task_id = task_id
            else:
                log_entry.task_id = unicode(task_id)
            
            error_data['task_id'] = task_id
        #~the parameters that the task creating the error log entry received
        if params != None:
            if type(params) in (unicode,str):
                log_entry.params = params
            else:
                log_entry.params = unicode(params)
                
            error_data['params'] = params
        #~the name of the task, this is the result of task.name
        if name != None:
            if type(error_msg) in (unicode,str):
                log_entry.name = name
            else:
                log_entry.name = unicode(name)
                
            error_data['name'] = name
        #~an overall description of the error
        if error_msg != None:
            if type(error_msg) in (unicode,str):
                log_entry.error_msg = error_msg
            else:
                log_entry.error_msg = unicode(error_msg)
            
            error_data['error_msg'] = error_msg
        #~detailed debug information, when possible this should include the list debug_data
        if debug_data != None:
            if type(debug_data) in (unicode,str):
                log_entry.debug_data = debug_data
            else:
                log_entry.debug_data = unicode(debug_data)
                
            error_data['debug_data'] = debug_data
        
        try:
            log_entry._put()
        except Exception as e:
            logging.error(["error writing log entry",e])
            logging.error(error_data)
                 

    #~log when a transaction is started, used for performance testing
    def logTransactionStarted(self,transaction_id=None,params=None):
        call_result = {}
        debug_data = []
        return_msg = "TaskQueueFunctions:logTransactionStarted "
        
    ## input validation
        call_result = self.checkValues([[transaction_id,True,unicode,"len>10"],
                                        [params,True,dict,"len1"]
                                        ])
        if call_result['success'] == False:
            return_msg += "input validation failed"
            logging.error([return_msg,call_result])
            return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    ##</end> input validation    
        
        log_entry = LogTransactionCreated(id=transaction_id)
        log_entry.transaction_id = transaction_id
        log_entry.params = unicode(params)
        try:
            log_entry._put()
        except Exception as e:
            return_msg +="transaction Started but couldnt write to datastore due to exception:%s" % e
            #logging.info([return_msg, transaction_id,params])
            
        
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}

    #~log when a transaction is completed used for performance testing

    def logTransactionFinished(self,transaction_id):
        call_result = {}
        debug_data = []
        return_msg = "TaskQueueFunctions:logTransactionFinished "
    ## input validation
        call_result = self.checkValues([[transaction_id,True,unicode,"len>10"]])
        if call_result['success'] == False:
            return_msg += "input validation failed"
            logging.error([return_msg,call_result])
            return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    ##</end> input validation    


        created_log_key = ndb.Key(LogTransactionCreated._get_kind(),transaction_id)
        try:
            created_log_key.delete()
        except Exception as e:
            return_msg += "transaction finished but couldnt delete transaction created entry due to exeception:%s" % e
            #logging.info([return_msg, transaction_id])
            
        
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    
    
    
    #~add a task to a task_queue

    def logTransactionFailed(self,transaction_id):
        call_result = {}
        debug_data = []
        return_msg = "TaskQueueFunctions:logTransactionFailed "
    ## input validation
        call_result = self.checkValues([[transaction_id,True,unicode,"len>10"]])
        if call_result['success'] == False:
            return_msg += "input validation failed"
            logging.error([return_msg,call_result])
            return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    ##</end> input validation    
        
        log_entry = LogTransactionFailed(id=transaction_id)
        log_entry.transaction_id = transaction_id
        try:
            log_entry._put()
        except Exception as e:
            return_msg += "transaction finished but couldnt write to datastore due to exeception:%s" % e
            #logging.info([return_msg, transaction_id])
            
        return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    
    
    
    #~add a task to a task_queue

    def logStripeTransaction(self,task_id=None,params=None,user_uid=None,stripe_object=None):
        call_result = {}
        debug_data = []
        return_msg = "TaskQueueFunctions:logStripeTransaction "
        
        user_uid = int(str(user_uid)[str(user_uid).rfind('_')+1:])
    ## input validation
        call_result = self.checkValues([[task_id,True,unicode,"len1"],
                                        [params,True,dict],
                                        [user_uid,True,long,"greater0"]
                                        ])
        if call_result['success'] == False:
            return_msg += "input validation failed"
            logging.error([return_msg,call_result])
            return {'success': True, 'return_msg': return_msg,'debug_data' :debug_data}
    ## </end> input validation
        
        log_id = None
    ## generate a unique id for this log entry if possible
        if type(task_id) == unicode:
            chars=string.ascii_lowercase + string.ascii_uppercase + string.digits    
            log_id = task_id + "-"
            log_id += ''.join(random.choice(chars) for _ in range(10))
            log_id += "-" + unicode(datetime.now().strftime('%Y-%m-%d-%H-%M-%S-%f'))
    ##</end> generate a unique id for this log entry if possible   
        
        stripe_entry = LogStripeTransaction(id=log_id)
        stripe_entry.task_id = task_id
        stripe_entry.params = unicode(params)
        stripe_entry.user_uid = int(user_uid)
        stripe_entry.stripe_object = unicode(stripe_object)
        try:
            stripe_entry._put()
        except Exception as e:
            return_msg +="Stripe Transaction Started but couldnt write to datastore due to exception:%s" % e
            #logging.info(unicode([return_msg, task_id,params,stripe_object]))
    
    
      