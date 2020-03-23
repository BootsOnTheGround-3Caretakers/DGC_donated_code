from __future__ import unicode_literals

from google.appengine.ext import ndb
from google.appengine.api import app_identity

from datavalidation import DataValidation
from GCP_return_codes import FunctionReturnCodes as RC
from GCP_memcache_utilities import MemcacheUtils
G_app_id = unicode(app_identity.get_application_id()).lower()

if G_app_id in ("watchdog-user-interface","dev-watchdog-user-interface"):
    from user_interface_replicated_datastores import DatastoreUserOrganizationPermissions
    from user_interface_replicated_datastores import DatastoreUser
    from back_end_global_settings import GlobalSettings as GSB
elif G_app_id in ("dgnet-watchdog","dev-dgnet-watchdog"):
    from back_end_datastores import DatastoreUserOrganizationPermissions
    from back_end_datastores import DatastoreUser
    from back_end_global_settings import GlobalSettings as GSB
elif G_app_id in ("watchdog-billing-system","dev-watchdog-billing-system"):
    from billing_replicated_datastores import DatastoreUserOrganizationPermission
    from billing_replicated_datastores import DatastoreUser
    from back_end_global_settings import GlobalSettings as GSB



class PermissionFunctions(MemcacheUtils):
    def checkPermissions(self, user_uid, organization_uid, check_permissions):
        return_msg  = 'PermissionFunctions:checkPermissions'
        call_result = {}
        debug_data = []
        auth_result = False

        ## input validation
        call_result = self.checkValues([
                                        [user_uid,True,int,'greater0'],
                                        [organization_uid,True,int,'greater0'],
                                        [check_permissions,True,unicode,"len>1","len<241"]
                                      ])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'verification failed'
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 
                    'debug_data': debug_data, 'auth_result': auth_result}
        ##</end> input validation    

        ## try to get permissions from cache or datastore
        key_name = '{}-{}'.format(user_uid, organization_uid)
        object_key = ndb.Key(DatastoreUser._get_kind(),'user_' + unicode(user_uid),DatastoreUserOrganizationPermissions._get_kind(), key_name)
        call_result = self.getDatastoreFields(object_key, ['permissions'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'getting cached permissions from cache utils failed'
            return {'success': call_result['success'], 'return_msg': return_msg, 
                    'debug_data': debug_data, 'auth_result': auth_result}

        if 'permissions' in call_result['fields']:
            permissions = call_result['fields']['permissions'] 
        else:
            permissions = ''
        ##</end> try to get permissions from cache or datastore

        ## check permissions
        permissions = set(permissions)
        check_permissions = set(check_permissions)
        if GSB.user_permissions.owner.id in permissions:
            auth_result = True
        elif check_permissions.issubset(permissions):
            auth_result = True
        ##</end> check permissions

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'auth_result': auth_result}


    def updatePermissions(self,user_uid,organization_uid):
        return_msg = 'PermissionFunctions:updatePermissions'
        call_result = {}
        debug_data = []

        ## input validation
        call_result = self.checkValues([
            [user_uid, True, int, 'greater0'],
            [organization_uid, True, int, 'greater0']
        ])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'input validation failed'
            return {'success': RC.input_validation_failed, 'return_msg': return_msg,
                    'debug_data': debug_data}
        ##</end> input validation

        ## set the new permission data in memcache
        key_name = '{}-{}'.format(user_uid, organization_uid)
        object_key = ndb.Key(DatastoreUser._get_kind(), 'user_' + unicode(user_uid),
                             DatastoreUserOrganizationPermissions._get_kind(), key_name)
        call_result = self.setDatastoreFields(object_key, ['permissions'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'setting cached permissions failed'
            return {'success': call_result['success'], 'return_msg': return_msg,
                    'debug_data': debug_data}
        ##</end> set the new permission data in memcache

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}


    def deletePermissions(self,user_uid,organization_uid):
        return_msg = 'PermissionFunctions:deletePermissions'
        call_result = {}
        debug_data = []

        ## input validation
        call_result = self.checkValues([
            [user_uid, True, int, 'greater0'],
            [organization_uid, True, int, 'greater0']
        ])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'input validation failed'
            return {'success': RC.input_validation_failed, 'return_msg': return_msg,
                    'debug_data': debug_data}
        ##</end> input validation

        ## delete the permission data from memcache
        key_name = '{}-{}'.format(user_uid, organization_uid)
        object_key = ndb.Key(DatastoreUser._get_kind(), 'user_' + unicode(user_uid),
                             DatastoreUserOrganizationPermissions._get_kind(), key_name)
        call_result = self.deleteDatastoreFields(object_key, ['permissions'])
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'setting cached permissions failed'
            return {'success': call_result['success'], 'return_msg': return_msg,
                    'debug_data': debug_data}
        ## </end> delete the permission data from memcache

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}

