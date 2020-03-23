from __future__ import unicode_literals
from __future__ import absolute_import

from google.appengine.ext import ndb
from google.appengine.api import app_identity

from datavalidation import DataValidation
from GCP_return_codes import FunctionReturnCodes as RC
from GCP_memcache_utilities import MemcacheUtils

G_app_id = unicode(app_identity.get_application_id()).lower()

if G_app_id in ("watchdog-user-interface","dev-watchdog-user-interface"):
    from user_interface_replicated_datastores import DatastoreOrganizationObjectsFastRef
elif G_app_id in ("dgnet-watchdog","dev-dgnet-watchdog"):
    from back_end_datastores import DatastoreOrganizationObjectsFastRef
elif G_app_id in ("watchdog-billing-system","dev-watchdog-billing-system"):
    from billing_replicated_datastores import DatastoreOrganizationObjectsFastRef

class ObjectCommonLookups(DataValidation,MemcacheUtils):

    def __init__(self):
        pass

    def removePrefix(self,uid_input):
        call_result = {}
        debug_data = []
        return_msg = 'ObjectLookups:removePrefix: '
        uid = 0

        ## validate input
        call_result = self.checkValues([[uid_input, True, unicode, "len>1"]
                                                  ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'uid': uid}
        ##</end> validate input

        ## extract the data after the prefix
        find_location = -1
        find_location = uid_input.rfind('_')
        if find_location < 0:
            return_msg += "prefix separator '_' not found"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'uid': uid}

        string_uid = uid_input[find_location + 1:]
        try:
            uid = long(string_uid)
        except Exception as e:
            return_msg += "exception occurred  converting uid to number. exception: %s" % (unicode(e))
            uid = 0
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'uid': uid}

        ##</end> extract the data after the prefix
        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'uid': uid}

    def getObjectOrganization(self,object_uid_with_prefix=None,object_uid_number=None):
        call_result = {}
        debug_data = []
        return_msg = 'ObjectLookups:getObjectOrganization: '
        org_uid = 0

        ## validate input
        call_result = self.checkValues([[object_uid_with_prefix, False, unicode, "object_uid_with_prefix"],
                                        [object_uid_number, False, long, "bigint", "greater>0"]
                                        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'org_uid': org_uid}

        if object_uid_number is None and object_uid_with_prefix is None:
            return_msg += "neither object_uid_number or object_uid_with_prefix is set to a value"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'org_uid': org_uid}

        obj_uid = None
        if object_uid_with_prefix is not None:
            call_result = self.removePrefix(object_uid_with_prefix)
            debug_data.append(call_result)
            if call_result['success'] != RC.success:
                return_msg += "removing org prefix failed"
                return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data,
                        'org_uid': org_uid}

            obj_uid = call_result['uid']
        elif object_uid_number is not None:
            obj_uid = object_uid_number
    ##</end> validate input

    ## retrieve org uid
        object_key = ndb.Key(DatastoreOrganizationObjectsFastRef._get_kind(), 'obj_' + unicode(obj_uid))
        call_result = self.getDatastoreFields(object_key, ['organization_uid'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'getting org uid for object failed'
            return {'success': call_result['success'], 'return_msg': return_msg,'debug_data': debug_data,
                    'org_uid': org_uid}

        if 'organization_uid' in call_result['fields']:
            org_uid = call_result['fields']['organization_uid']
    ##</end> retrieve org uid

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data,
                'org_uid': org_uid}


    def getSystemOrganization(self,system_uid_with_prefix=None,system_uid_number=None):
        call_result = {}
        debug_data = []
        return_msg = 'ObjectLookups:getSystemOrganization: '
        org_uid = 0

        ## validate input
        call_result = self.checkValues([[system_uid_with_prefix, False, unicode, "system_uid_with_prefix"],
                                        [system_uid_number, False, long, "bigint", "greater>0"]
                                        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'org_uid': org_uid}

        if system_uid_number is None and system_uid_with_prefix is None:
            return_msg += "neither system_uid_number or system_uid_with_prefix is set to a value"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'org_uid': org_uid}

        obj_uid = None
        if system_uid_with_prefix is not None:
            call_result = self.removePrefix(system_uid_with_prefix)
            debug_data.append(call_result)
            if call_result['success'] != RC.success:
                return_msg += "removing org prefix failed"
                return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data,
                        'org_uid': org_uid}

            obj_uid = call_result['uid']
        elif system_uid_number is not None:
            obj_uid = system_uid_number
    ##</end> validate input

    ## retrieve org uid
        system_key = ndb.Key(DatastoreOrganizationObjectsFastRef._get_kind(), 'obj_' + unicode(obj_uid))
        call_result = self.getDatastoreFields(system_key, ['organization_uid'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'getting org uid for system failed'
            return {'success': call_result['success'], 'return_msg': return_msg,'debug_data': debug_data,
                    'org_uid': org_uid}

        if 'organization_uid' in call_result['fields']:
            org_uid = call_result['fields']['organization_uid']
    ##</end> retrieve org uid

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data,
                'org_uid': org_uid}


    def clearObjectOrganization(self,object_uid_with_prefix=None,object_uid_number=None):
        call_result = {}
        debug_data = []
        return_msg = 'ObjectLookups:clearObjectOrganization: '

        ## validate input
        call_result = self.checkValues([[object_uid_with_prefix, False, unicode, "object_uid_with_prefix"],
                                        [object_uid_number, False, long, "bigint", "greater>0"]
                                        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data}

        if object_uid_number is None and object_uid_with_prefix is None:
            return_msg += "neither object_uid_number or object_uid_with_prefix is set to a value"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data}

        obj_uid = None
        if object_uid_with_prefix is not None:
            call_result = self.removePrefix(object_uid_with_prefix)
            debug_data.append(call_result)
            if call_result['success'] != RC.success:
                return_msg += "removing org prefix failed"
                return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data}

            obj_uid = call_result['uid']
        elif object_uid_number is not None:
            obj_uid = object_uid_number
        ##</end> validate input

        ## clear org uid memcache record
        object_key = ndb.Key(DatastoreOrganizationObjectsFastRef._get_kind(), 'obj_' + unicode(obj_uid))
        call_result = self.deleteDatastoreFields(object_key, ['organization_uid'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'removing org uid entry for object failed'
            return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data}
        ##</end> clear org uid memcache record

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}

    def clearSystemOrganization(self,system_uid_with_prefix=None,system_uid_number=None):
        call_result = {}
        debug_data = []
        return_msg = 'ObjectLookups:clearSystemOrganization: '

        ## validate input
        call_result = self.checkValues([[system_uid_with_prefix, False, unicode, "system_uid_with_prefix"],
                                        [system_uid_number, False, long, "bigint", "greater>0"]
                                        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data}

        if system_uid_number is None and system_uid_with_prefix is None:
            return_msg += "neither system_uid_number or system_uid_with_prefix is set to a value"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data}

        obj_uid = None
        if system_uid_with_prefix is not None:
            call_result = self.removePrefix(system_uid_with_prefix)
            debug_data.append(call_result)
            if call_result['success'] != RC.success:
                return_msg += "removing org prefix failed"
                return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data}

            obj_uid = call_result['uid']
        elif system_uid_number is not None:
            obj_uid = system_uid_number
    ##</end> validate input

    ## clear org uid memcache record
        system_key = ndb.Key(DatastoreOrganizationObjectsFastRef._get_kind(), 'obj_' + unicode(obj_uid))
        call_result = self.deleteDatastoreFields(system_key, ['organization_uid'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'removing org uid memcache record for system failed'
            return {'success': call_result['success'], 'return_msg': return_msg,'debug_data': debug_data}
    ##</end> clear org uid memcache record

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}
