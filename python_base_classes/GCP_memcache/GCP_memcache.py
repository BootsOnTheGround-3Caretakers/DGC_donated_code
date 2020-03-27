from __future__ import unicode_literals

from google.appengine.api import memcache
import logging
from datetime import datetime
from datavalidation import DataValidation
from GCP_return_codes import FunctionReturnCodes as RC
#~this class exists so we can use issubclass without a circlular dependency issue when doing firebase replication


class MemcacheFunctions(DataValidation):
    
    def kset(self,key,value,namespace=None):
        return_msg  = 'MemcacheFunctions:kset '
        call_result = {}
        debug_data = []
        
        ## validate input
        
        call_result = self.checkValues([[key,True,unicode,"len>1","len<241"],
                                      [value,True,unicode,"len>1","len<102400"],
                                      [namespace,False,unicode,"len>1","len<241"]
                                    ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data}
    ##</end> validate input
    
        mem_client = memcache.Client()
        set_result = None
        try:
            if namespace == None:
                set_result = mem_client.set(key,value)
            else: 
                set_result = mem_client.set(key,value,namespace)
        except Exception as e:
            return_msg += "failed to set memcache value with error:%s" % (unicode(e))
            return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}    
        
        if set_result == False:
            return_msg += "failed to set memcache value"
            return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}   
        
        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}
    
    
    def kget(self,key,namespace=None,convert_to_number=False,convert_to_bool=False):
        return_msg  = 'MemcacheFunctions:kget '
        call_result = {}
        debug_data = []
        get_result  = None
        
        ## validate input
        
        call_result = self.checkValues([[key,True,unicode,"len>1","len<241"],
                                      [namespace,False,unicode,"len>1","len<241"],
                                      [convert_to_number,False,bool],
                                      [convert_to_bool,False,bool]
                                    ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data, 'get_result':get_result}
    ##</end> validate input
    
    ## retreive value
        mem_client = memcache.Client()
        try:
            if namespace == None:
                get_result = mem_client.get(key)
            else: 
                get_result = mem_client.get(key,namespace)
        except Exception as e:
            get_result = None
            return_msg += "failed to get memcache value with error:%s" % (unicode(e))
            return {'success': RC.memcache_failure, 'return_msg': return_msg, 'debug_data': debug_data, 'get_result':get_result}
    ##</end> retreive value

        if get_result is None or len(get_result) < 1:
            return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'get_result':get_result}
    ## do any conversions requested                
        try:
            if convert_to_number == True:
                get_result = long(get_result)
            elif convert_to_bool == True:
                stemp = get_result.lower()
                if stemp == 'true':
                    get_result = True
                elif stemp == 'false':
                    get_result = False
                    
        except Exception as e:
            get_result = None
            return_msg += "failed to convert memcache value with error:%s" % (unicode(e))
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data, 'get_result':get_result}
    ##</end> do any conversions requested
        
        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'get_result':get_result}

    def kdelete(self,key,namespace=None):
        return_msg  = 'MemcacheFunctions:kdelete '
        call_result = {}
        debug_data = []
        
        ## validate input
        
        call_result = self.checkValues([[key,True,unicode,"len>1","len<241"],
                                      [namespace,False,unicode,"len>1","len<241"]
                                    ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed,'return_msg':return_msg,'debug_data':debug_data}
        
        ##</end> validate input

        ## delete key
        mem_client = memcache.Client()
        try:
            if namespace == None:
                mem_client.delete(key)
            else: 
                mem_client.delete(key,namespace)
        except Exception as e:
            get_result = None
            return_msg += "failed to delete memcache key with error:%s" % (unicode(e))
            return {'success': RC.memcache_failure, 'return_msg': return_msg, 'debug_data': debug_data}
        ##</end> delete key

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}
