from __future__ import unicode_literals
import json

from google.appengine.ext import ndb

from datavalidation import DataValidation
from GCP_return_codes import FunctionReturnCodes as RC
from GCP_memcache import MemcacheFunctions
from datastore_functions import DatastoreFunctions


class MemcacheUtils(DataValidation,MemcacheFunctions):
    def getDatastoreFields(self, key, fields_to_get):
        return_msg  = 'CacheUtils:getDatastoreFields'
        call_result = {}
        debug_data = []
        fields = {}

        ## input validation
        call_result = self.checkValues([
                                        [key,True,"ndb_key"],
                                        [fields_to_get,True,list,"unicodelist"],
                                      ])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' verification failed'
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 
                    'debug_data': debug_data, 'fields': fields}
        ##</end> input validation          

        ## try to get fields from cache or datastore
        cache_key = u'Datastore:CacheUtils:{}:{}'.format(key.string_id(), ','.join(fields_to_get))
        call_result = self.kget(cache_key)
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' getting fields from memcache failed'
            return {'success': call_result['success'], 'return_msg': return_msg, 
                    'debug_data': debug_data, 'fields': fields}

        if call_result['get_result']:
            fields = json.loads(call_result['get_result'])
        else:
            call_result = self.setDatastoreFields(key, fields_to_get)
            debug_data.append(call_result)
            if call_result['success'] != RC.success:
                return_msg += ' setting fields to memcache failed'
                return {'success': call_result['success'], 'return_msg': return_msg, 
                        'debug_data': debug_data, 'fields': fields}
            
            fields = call_result['fields']
        ##</end> try to get fields from cache or datastore        

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'fields': fields}

    def setDatastoreFields(self, key, fields_to_set):
        return_msg  = 'CacheUtils:setDatastoreFields: '
        call_result = {}
        debug_data = []
        fields = {}

        ## input validation
        call_result = self.checkValues([
                                        [key,True,"ndb_key"],
                                        [fields_to_set,True,list,"unicodelist"],
                                      ])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' verification failed'
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 
                    'debug_data': debug_data, 'fields': fields}
        ##</end> input validation          

        call_result = DatastoreFunctions.kget(key)
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' getting fields from datastore failed'
            return {'success': call_result['success'], 'return_msg': return_msg, 
                    'debug_data': debug_data, 'fields': fields}

        if call_result['get_result'] is None:
            return_msg += ' no record exists in datastore for that key'
            return {'success': RC.success, 'return_msg': return_msg,
                    'debug_data': debug_data, 'fields': fields}

        obj = call_result['get_result']
        fields = {}
        for field in fields_to_set:
            fields[field] = None

        for field in fields_to_set:
            if hasattr(obj, field):
                fields[field] = getattr(obj, field)

        cache_key = u'Datastore:CacheUtils:{}:{}'.format(key.string_id(), ','.join(fields_to_set))
        call_result = self.kset(cache_key, unicode(json.dumps(fields)))
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' caching fields to memcache failed'
            return {'success': call_result['success'], 'return_msg': return_msg, 
                    'debug_data': debug_data, 'fields': fields}

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'fields': fields}

    def deleteDatastoreFields(self, key, fields):
        return_msg  = 'CacheUtils:deleteDatastoreFields'
        call_result = {}
        debug_data = []

        ## input validation
        call_result = self.checkValues([
                                        [key,True,"ndb_key"],
                                        [fields,True,list,"unicodelist"],
                                      ])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' verification failed'
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 
                    'debug_data': debug_data}
        ##</end> input validation          

        cache_key = u'Datastore:CacheUtils:{}:{}'.format(key.string_id(), ','.join(fields))

        call_result = self.kdelete(cache_key)
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += ' deleteing key in memcache failed'
            return {'success': call_result['success'], 'return_msg': return_msg, 
                    'debug_data': debug_data}

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}
