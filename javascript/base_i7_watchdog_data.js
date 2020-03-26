/* eslint-disable */
import { CR, RC, AJRS } from './base_i2_success_codes'
import bi1_data_validation from './base_i1_datavalidation'
import base_i3_log from './base_i3_logging'
import { ajax } from 'noquery-ajax';
import bi6_misc from './base_i6_misc_functions'
import Vue from 'vue'
import moment from 'moment';

// CI == class instance
// IV == instance variable
"use strict";
class bi7_watchdog_firebase {
    constructor() {
        var CI = this;
        CI.IV_firebase_db_object = null;
        CI.IV_id_token_pointer = '';
        CI.IV_firebase_uid_pointer = '';
        CI.IV_firebase_guest_flag_pointer = true;
        CI.IV_firebase_email_pointer = '';
        CI.IV_instance_initialized = false;
        CI.IV_user_folder_path = ''
        CI.IV_process_datastore_request_active = false;
        CI.IV_process_datatore_last_request_count = 0;        
        CI.IV_process_datastore_last_run_time = 0;
        CI.IV_user_folder_valid = {
          'meta_data': {
            'created': false,
            'uid': false,
            'contact_email': false,
            'first_name': false,
            'last_name': false,
            'web_uid': false
          },
          folders: {
            'org_permissions': false,
            'doghouse_active': false,
            'meta_data': false,
            'doghouse_history': false,
            'notification_rules': false,
            'notification_rule_joins': false,
            'dog_house_ackowledged': false,
            'dog_house_tags': false
          } 
        };
        CI.IV_last_updated_timestamps = {
            'org_permissions':0,
            'presets':{},
            'org_meta_data': {},
            'org_locations' : {},
            'obj_meta_data': {},
            'obj_atr_meta_data': {},
            'usr_contact_email':{},
            'doghouse_active':{},
            'notification_rule_joins': {}
        };
        CI.IV_rebuild_data_requests = {'org_permissions':0,'presets':{}}
        CI.IV_org_locations = {};
        CI.IV_org_parents_lookup = {};
        //used with indexOf to check if an is a sub org of another org
        CI.IV_org_location_strings = {};
        CI.IV_org_structure = {};
        CI.IV_org_permissions = {};
        CI.IV_org_users_permissions_last_updated = {};

        CI.IV_doghouse_history = {};
        CI.IV_doghouse_active = {};
        CI.IV_doghouse_acknowledged = {}
        CI.IV_notification_rules = {};
        CI.IV_notification_rule_joins = {};

        CI.IV_account_notificaitons = {};

        CI.IV_meta_data_requests = {};
        CI.IV_meta_data_requests_retry_count = {};
        CI.IV_meta_data_requests_max_retry_count = 10;

        CI.IV_org_system_joins = {};
        CI.IV_system_org_joins = {};
        CI.IV_system_live_uids = {};
        CI.IV_object_attribute_live_uids = {};
        CI.IV_object_live_uids = {};
        CI.IV_system_object_joins = {};
        CI.IV_system_object_joins_reverse_lookup = {};
        CI.IV_object_attribute_joins = {};
        CI.IV_object_attribute_joins_reverse_lookup = {};
        CI.IV_object_attribute_values = {};
        CI.IV_object_attribute_history_values = {};
        CI.IV_object_attribute_history_last_time = {};

        CI.IV_data_change_callbacks = {'IV_user_info': null};

        CI.IV_users_contact_email = {};
        CI.IV_filtered_attributes_list = [];
        CI.IV_org_meta_data = {};
        CI.IV_objects_meta_data = {};
        CI.IV_object_attributes_meta_data = {};
        CI.IV_object_attributes_command_history = {};
        CI.IV_object_attribute_rule_joins = {};
        CI.IV_mass_applied_rules_history = {};
        CI.IV_rx_tx_log_data = {};
        CI.IV_rx_tx_last_time = {};
        CI.IV_default_obj_attribute_names = {};
        CI.IV_renamed_obj_attributes_uids = {};

        CI.IV_listener_user_info = {};
        CI.IV_listener_org_permissions = {};
        CI.IV_listener_orgs = {};
        CI.IV_listener_org_meta_data = {};
        CI.IV_listener_org_user_permission_changes = {};
        CI.IV_listener_mass_applied_rules_history = null;
        CI.IV_listener_system_all_object_and_attributes_joins = {};
        
        CI.IV_listener_object_meta_data = {};
        CI.IV_listener_object_attributes_meta_data = {};
        CI.IV_listener_object_attribute_values = {};
        CI.IV_listener_object_attribute_history_values = {};
        CI.IV_listener_object_attribute_command_history = {};
        CI.IV_listener_object_attribute_parent_system = {};
        CI.IV_listener_account_notifications = {};
        CI.IV_listener_doghouse_history = {};
        CI.IV_listener_doghouse_active = {};
        CI.IV_listener_doghouse_acknowledge = {};
        CI.IV_listener_rx_tx_logging = {};
        CI.IV_notification_rules_listener = {};
        CI.IV_notification_rule_joins_listener = {};
        CI.IV_save_join_data_to_cache_lockout = false;
        CI.IV_last_join_listener_started_time = null;
        CI.IV_last_join_data_change = 0;
        CI.IV_last_update_cached_join_data_run_time = 0;
        CI.IV_firebase_listeners_lookup = {
          'user_info': 'IV_listener_user_info',
          'org_permissions': 'IV_listener_org_permissions',
          'orgs': 'IV_listener_orgs',
          'org_meta_data': 'IV_listener_org_meta_data',
          'org_user_permission_changes': 'IV_listener_org_user_permission_changes',
          'object_meta_data': 'IV_listener_object_meta_data',
          'object_attributes_meta_data': 'IV_listener_object_attributes_meta_data',
          'object_attribute_values': 'IV_listener_object_attribute_values',
          'object_attribute_history_values': 'IV_listener_object_attribute_history_values',
          'object_attribute_command_history': 'IV_listener_object_attribute_command_history',
          'object_attribute_parent_system': 'IV_listener_object_attribute_parent_system',
          'account_notifications': 'IV_listener_account_notifications',
          'doghouse_history': 'IV_listener_doghouse_history',
          'doghouse_active': 'IV_listener_doghouse_active',
          'rx_tx_logging': 'IV_listener_rx_tx_logging'
        };

        CI.IV_presets = {};

        CI.IV_active_transcations = {};
        CI.IV_vue_transcations = {};

        CI.IV_user_info = { 'uid': 0, 'contact_email': '', 'first_name': '', 'last_name': '','web_uid' :'' };
        CI.IV_success_global_callbacks = {};
        CI.IV_failure_global_callbacks = {};
        CI.IV_global_org_system_joins_listener = false;
        CI.IV_global_org_locations_listener = false;
        CI.IV_global_listener_renamed_obj_attributes = null;
        CI.IV_deleted_object_uids = {};
        CI.IV_listener_dog_house_tags = null;
        CI.IV_dog_house_tags = {};
        CI.IV_first_time_orgs_Locations_loaded = false

        CI.IV_doghouse_history_listeners_count = 0
        CI.IV_component_loading_states = {}
        CI.IV_deletion_items_keys_after_csv = []
        CI.IV_items_count_for_csv_report = {
          'objects': 0,
          'attributes': 0
        }

        //this recalls itself to run forever
        setTimeout(CI.bi7processDataStoreRequests.bind(CI),2000);
        setTimeout(CI.bi7BuildPresets.bind(CI),2000);
        setInterval(CI.bi7UpdateCachedJoinData.bind(CI),30000);
        CI.bi7initDogHouseActiveGlobalListener();
        CI.bi7initDogHouseAcknowledgedGlobalListener();
        CI.bi7initGlobalRenamedObjectAttributesListener();
    }


    bi7SetFirebaseToken(firebase_token=null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7SetFirebaseToken ";
        var task_id = "bi7_watchdog_firebase:bi7SetFirebaseToken";

        ////// input validation
        call_result = bi1_data_validation.is_string(firebase_token);
        debug_data.push(call_result);

        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation
        var CI = this;
        CI.IV_id_token_pointer = firebase_token;
    }
    setFirebaseParams(firebase_db_object = null, firebase_token = '', firebase_uid = '',firebae_email = '',guest_flag=true) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:setFirebaseParams ";
        var task_id = "bi7_watchdog_firebase:setFirebaseParams";

        ////// input validation
        try {
          call_result = bi1_data_validation.is_string(firebase_db_object['app']['options_']['apiKey']);
          debug_data.push(call_result);
        } catch (err) {
          return_msg += "fire_base_db_object is not valid, errors:" + JSON.stringify(err.message);
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }

        call_result = bi1_data_validation.is_string(firebase_token);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(firebase_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_email_address(firebae_email);
        debug_data.push(call_result);


        var validation_failed = false;
        for (var index in debug_data) {
          if (debug_data[index][CR.success] !== RC.success) {
            validation_failed = true;
          }
        }

        if(validation_failed === true) {
          return_msg += "input validation failed";
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        //////</end> input validation
        var CI = this;
        CI.IV_id_token_pointer = firebase_token;
        CI.IV_firebase_uid_pointer = firebase_uid;
        CI.IV_firebase_email_pointer = firebae_email;
        CI.IV_firebase_guest_flag_pointer = guest_flag;
        if (guest_flag === true) {
            CI.IV_user_folder_path = '/user/guest';
        } else {
            CI.IV_user_folder_path = '/user/' + firebase_uid;
            
        }

        CI.IV_firebase_db_object = firebase_db_object;
        CI.IV_instance_initialized = true;
    }

    callCallBackFunction(callback, args = null) {
        var call_result = {};
        var debug_data = [];
        var return_msg = "bi7_watchdog_firebase:callCallBackFunction";
        var task_id = "bi7_watchdog_firebase:callCallBackFunction";

        ////// input validation
        call_result = bi1_data_validation.is_function(callback)
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
          return_msg += "input validation failed";
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation

        try {
          if (Array.isArray(args) === true) {
            callback(args)
          } else {
            callback([args])
          }
        } catch (err) {
          return_msg += "callback execution failed with error:" + JSON.stringify(err);
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7ClearAllData() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7ClearAllData ";
        var task_id = "bi7_watchdog_firebase:bi7ClearAllData";
        var CI = this;

        CI.IV_user_info = { 'uid': 0, 'contact_email': '', 'first_name': '', 'last_name': '','web_uid' :'' };
        var deletion_items =  [CI.IV_org_location_strings, CI.IV_org_structure, CI.IV_org_permissions,
            CI.IV_doghouse_history, CI.IV_doghouse_active, CI.IV_meta_data_requests, CI.IV_org_system_joins,
            CI.IV_system_org_joins, CI.IV_system_object_joins, CI.IV_object_attribute_joins,
            CI.IV_object_attribute_values, CI.IV_org_meta_data, CI.IV_objects_meta_data,
            CI.IV_object_attributes_meta_data, CI.IV_presets]
            
        for(var index in deletion_items) {
            for(var key in deletion_items[index]) {
                if(deletion_items[index][key] !== null && deletion_items[index][key] !== undefined) {
                    Vue.delete(deletion_items[index],key);
                }
            }
        }


    }

    bi7CreateDataStoreRequest(type=null,uid=null,timestamp=null,make_cache=true) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7CreateDataStoreRequest ";
        var task_id = "bi7_watchdog_firebase:bi7CreateDataStoreRequest";
        var CI = this;
        ////// input validation
        //sometimes firebase gives us a null value, this will cause to create a request instead of creating a validation issue
        if(timestamp === null) {
            var date_object = new Date();
            // the timestamps for mktime in python are in seconds not ms
            timestamp = date_object.getTime() / 1000;
        }
        call_result = bi1_data_validation.is_string(type);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(uid);
        debug_data.push(call_result);

        if(typeof timestamp === 'string') {
            call_result = bi1_data_validation.is_string(timestamp);
            if(call_result[CR.success] === RC.success) {
                timestamp = parseInt(timestamp)
            }
        } else {
            call_result = bi1_data_validation.is_number(timestamp);
        }
        debug_data.push(call_result);
        
        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }
        if(type.indexOf('sys_') >= 0) {
            type = type.replace('sys_','obj_')
            uid = uid.replace('sys_','obj_')
        }

        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        //////</end> input validation

        /////if the value is local store is new enough to use, use it
        var cached_last_updated = localStorage.getItem(type +'_' + uid + '_updated');
        if(cached_last_updated !== null && cached_last_updated !== undefined && parseInt(cached_last_updated) >= timestamp) {
            var cache_success = false;
            var cached_value = localStorage.getItem(type +'_' + uid)
            if(cached_value !== null && cached_value !== undefined) {
                cached_value = JSON.parse(cached_value)

                switch(type) {
                    case 'org_meta_data':
                    Vue.set(CI.IV_org_meta_data,uid,cached_value);
                    CI.IV_last_updated_timestamps['org_meta_data'][uid] = cached_last_updated;
                    cache_success = true;
                    break;

                    case 'obj_meta_data':
                    Vue.set(CI.IV_objects_meta_data,uid,cached_value);
                    CI.IV_last_updated_timestamps['obj_meta_data'][uid] = cached_last_updated;
                    cache_success = true;
                    break;

                    case 'obj_atr_meta_data':
                    Vue.set(CI.IV_object_attributes_meta_data,uid,cached_value);
                    CI.IV_last_updated_timestamps['obj_atr_meta_data'][uid] = cached_last_updated;
                    cache_success = true;
                    break;

                }  
                if(cache_success === true) {
                    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
                }
            }
        }
        /////</end>if the value is local store is new enough to use, use it



        if (type in CI.IV_meta_data_requests === false) {
            CI.IV_meta_data_requests[type] = {};
        }
        if (uid in CI.IV_meta_data_requests[type] === false) {
          CI.IV_meta_data_requests[type][uid] = {};
        }
        
        CI.IV_meta_data_requests[type][uid]["request_time"] = timestamp;
        CI.IV_meta_data_requests[type][uid]["make_cache"] = make_cache;

        // setting retry count for uids to prevent loop after max number of retry
        if (type in CI.IV_meta_data_requests_retry_count === false) {
            CI.IV_meta_data_requests_retry_count[type] = {};
        }
        if (uid in CI.IV_meta_data_requests_retry_count[type] === false) {
          CI.IV_meta_data_requests_retry_count[type][uid] = 0;
        }
        //</end> setting retry count for uids to prevent loop after max number of retry

        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };

    }

    bi7ActivelyMonitorSystem(system_uid=null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7ActivelyMonitorSystem ";
        var task_id = "bi7_watchdog_firebase:bi7ActivelyMonitorSystem";
        var CI = this;
        
        ///// input validation
        call_result = bi1_data_validation.is_system_uid(system_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////</end> input validation
        
        if (system_uid in CI.IV_system_object_joins === false) {
            Vue.set(CI.IV_system_object_joins, system_uid, {});
        }

        if (system_uid in CI.IV_listener_system_all_object_and_attributes_joins === false) {
          CI.bi7LoadCachedJoinData("sys_obj_join-", system_uid);
          CI.bi7InitSystemObjectAndAttributeJoinsListener(system_uid);
        }
    }

    bi7InitSystemObjectAndAttributeJoinsListener(system_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitSystemObjectAndAttributeJoinsListener ";
        var task_id = "bi7_watchdog_firebase:bi7InitSystemObjectAndAttributeJoinsListener";

        ///// input validation
        call_result = bi1_data_validation.is_system_uid(system_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////</end> input validation

        var CI = this;
        if(CI.IV_listener_system_all_object_and_attributes_joins[system_uid] !== null &&
            CI.IV_listener_system_all_object_and_attributes_joins[system_uid] !== undefined) {
            return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        var listener_location = 'systems/' + system_uid;
        CI.IV_listener_system_all_object_and_attributes_joins[system_uid] = CI.IV_firebase_db_object.ref(listener_location);

        CI.updateLastJoinListenerStartTime();
        CI.IV_listener_system_all_object_and_attributes_joins[system_uid].on("value",
            function (a_data) {
              CI.SystemAttributeJoinsAndMetaDataListener(system_uid, a_data);
            }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(this));
    }

    SystemAttributeJoinsAndMetaDataListener(system_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:SystemAttributeJoinsAndMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:SystemAttributeJoinsAndMetaDataListener";

        ////// input validation 
        call_result = bi1_data_validation.is_system_uid(system_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var firebase_data = data.val();
        var CI = this;
        
        var system_object_uids = firebase_data['object_uids'];
        var system_attribute_uids = firebase_data['object_attributes'];

        if (system_object_uids !== null && system_object_uids !== undefined) {
            for (let object_uid in system_object_uids) {

                //ignore last updated entries, the system is technically an object but we don't list it with the objects under the system
                if (object_uid === "last_updated" || object_uid === system_uid.replace('sys_','obj_')) {
                    continue;
                }

                Vue.set(CI.IV_deleted_object_uids, object_uid, {});
                // removing deleted objects from dictionaries and local storage
                if (system_object_uids[object_uid].indexOf('deleted') === 0) {
                    CI.IV_object_live_uids[object_uid] = false;
                    Vue.set(CI.IV_deleted_object_uids, object_uid, true);
                    localStorage.removeItem("sys_obj_join-" + system_uid);
                    localStorage.removeItem("obj_atr_join-" + object_uid);
                }

                //store the object uid
                if (object_uid in CI.IV_objects_meta_data === false) {
                    Vue.set(CI.IV_objects_meta_data,object_uid, {});
                }
                if (object_uid in CI.IV_object_attribute_joins === false) {
                    Vue.set(CI.IV_object_attribute_joins, object_uid, {});
                }
                CI.IV_object_live_uids[object_uid] = true;
                if (object_uid in CI.IV_system_object_joins[system_uid] === false || CI.IV_system_object_joins[system_uid][object_uid] !== object_uid) {
                    Vue.set(CI.IV_system_object_joins[system_uid],object_uid,object_uid);
                    Vue.set(CI.IV_system_object_joins_reverse_lookup,object_uid,system_uid);
                }
                if (object_uid in CI.IV_listener_object_meta_data === false) {
                    CI.initObjectMetaDataListener(object_uid);
                }
            }
        }

        if (system_attribute_uids !== null && system_attribute_uids !== undefined) {
            for (let object_attribute_uid in system_attribute_uids) {

                //ignore last updated entries
                if (object_attribute_uid === "last_updated" || object_attribute_uid === 'deletion_prevention_key') {
                    continue;
                }

                var object_uid = "";
                try {
                    object_uid = `obj_${CI.bi7ExtractNumbers(object_attribute_uid.split("-")[0])}`;
                } catch(error) {
                    return_msg += "failed to JSOn parse firebase data with error:" + error;
                    base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
                    continue;
                }

                // checking if the attribute belongs to any object under this system
                if (object_uid in CI.IV_object_attribute_joins === false) {
                  continue;
                }
                //</end> checking if the attribute belongs to any object under this system

                if (object_attribute_uid in  CI.IV_object_attribute_rule_joins === false) {
                    Vue.set(CI.IV_object_attribute_rule_joins, object_attribute_uid, {})
                }
                if (object_attribute_uid in CI.IV_object_attribute_values === false) {
                    Vue.set(CI.IV_object_attribute_values, object_attribute_uid, {})
                 }

                //store the object attribute join
                if (object_attribute_uid in CI.IV_object_attribute_joins[object_uid] === false) {
                    Vue.set(CI.IV_object_attribute_joins[object_uid],object_attribute_uid,object_attribute_uid);
                    Vue.set(CI.IV_object_attribute_joins_reverse_lookup,object_attribute_uid,object_uid);
                }
                
                if (object_attribute_uid in CI.IV_object_attributes_meta_data === false) {
                    Vue.set(CI.IV_object_attributes_meta_data,object_attribute_uid, {});
                }

                CI.IV_object_attribute_live_uids[object_attribute_uid] = true;
                let last_updated_time = system_attribute_uids[object_attribute_uid]["last_updated"];
                CI.bi7CreateDataStoreRequest('obj_atr_meta_data', object_attribute_uid, );

                if (object_attribute_uid in CI.IV_listener_object_attribute_values === false) {
                    CI.bi7initObjectAttributeValueListener(object_attribute_uid);
                }
            }
        }
    }

    setSuccessGlobalCallBack(function_name = '', callback = null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:setSuccessCallBack ";
        var task_id = "bi7_watchdog_firebase:setSuccessCallBack";
        var CI = this;

        ///// input validation
        call_result = bi1_data_validation.is_function(callback);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        
        call_result = bi1_data_validation.is_string(function_name);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////</end> input validation

        CI.IV_success_global_callbacks[function_name] = callback;
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    setFailureGlobalCallBack(function_name = '', callback = null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:setFailureCallBack ";
        var task_id = "bi7_watchdog_firebase:setFailureCallBack";
        var CI = this;
        
        ///// input validation
        call_result = bi1_data_validation.is_function(callback);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        
        call_result = bi1_data_validation.is_string(function_name);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////</end> input validation

        CI.IV_failure_global_callbacks[function_name] = callback;
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7setDataChangedCallback(instance_variable, callback) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7setDataChangedCallback ";
        var task_id = "bi7_watchdog_firebase:bi7setDataChangedCallback";
        var CI = this;
        call_result = bi1_data_validation.is_string(instance_variable);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_function(callback);
        debug_data.push(call_result);
        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }

        if(validation_failed === false && instance_variable in CI.IV_data_change_callbacks === false) {
            return_msg+= 'attempt to set a callback for an instance variable that is not the data change callbacks'
            validation_failed = true;
        }

        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }

        CI.IV_data_change_callbacks[instance_variable] = callback;
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
        
    }

    bi7UnsubscribeAllListeners() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7UnsubscribeAllListeners ";
        var task_id = "bi7_watchdog_firebase:bi7UnsubscribeAllListeners";
        var CI = this;

        var listener_dicts = [
            CI.IV_listener_org_permissions,
            CI.IV_listener_orgs,
            CI.IV_listener_org_meta_data,
            CI.IV_listener_object_meta_data,
            CI.IV_listener_object_attributes_meta_data,
            CI.IV_listener_doghouse_active,
            CI.IV_listener_doghouse_history,
            CI.IV_listener_user_info,
            CI.IV_listener_object_attribute_values,
            CI.IV_notification_rules_listener,
            CI.IV_notification_rule_joins_listener,
            CI.IV_listener_object_attribute_parent_system,
            CI.IV_listener_account_notifications,
            CI.IV_listener_org_user_permission_changes,
            CI.IV_global_org_locations_listener,
            CI.IV_global_org_system_joins_listener
        ]
        var failure_flag = false;
        for(var listener_list_index in listener_dicts) {
            for (var listener_key in listener_dicts[listener_list_index]) {
                try {
                    listener_dicts[listener_list_index][listener_key].off();
                    listener_dicts[listener_list_index][listener_key] = null;
                    delete listener_dicts[listener_list_index][listener_key];
                } catch(error) {
                    failure_flag = true;
                    listener_dicts[listener_list_index][listener_key] = null;
                    delete listener_dicts[listener_list_index][listener_key];
                    debug_data.push(JSON.stringify(error))
                }
            }
        }

        if(failure_flag === true) {
            return_msg += "failed to turn some listeners off";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }


    InitOrgListeners() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:InitOrgListeners ";
        var task_id = "bi7_watchdog_firebase:InitOrgListeners";
        var CI = this;

        if (CI.IV_instance_initialized === false) {
            return_msg += 'instance is not initialized';
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        var listener_location = CI.IV_user_folder_path +  '/org_permissions';
        CI.IV_listener_org_permissions['all_permissions'] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_org_permissions['all_permissions']);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_org_permissions['all_permissions'];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_org_permissions['all_permissions'].on("value",CI.OrgPermissionsListener.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    OrgPermissionsListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:OrgPermissionsListener ";
        var task_id = "bi7_watchdog_firebase:OrgPermissionsListener";
        var CI = this;
        
        ///// input validation
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /////</end> input validation
        var regenerate_org_tree_flag = false;
        var firebase_data = data.val();

        for (var org_uid in firebase_data) {
            //set the last updated timestamp for the permissions
            if (org_uid === "last_updated") {
                CI.IV_last_updated_timestamps['org_permissions'] =  firebase_data[org_uid]
                continue;
            }
            if(org_uid === 'deletion_prevention_key') {
                continue;
            }
            if (org_uid in CI.IV_org_meta_data === false) {
                Vue.set(CI.IV_org_meta_data,org_uid,{});
                
                let cached_value = localStorage.getItem(`org_meta_data_${org_uid}`);
                // We'll use the cache value here if we have.
                if (cached_value !== null || cached_value !== undefined) {
                  Vue.set(CI.IV_org_meta_data, org_uid, JSON.parse(cached_value));
                }

                // we'll get one time data from server to verify if we have latest data in cache.
                CI.initOrgMetaDataListener(org_uid, true, "bi7")
            }

            //update the permisions the user has for this org
            if (org_uid in CI.IV_org_permissions === false) {
                Vue.set(CI.IV_org_permissions,org_uid, {});
            }
            if (CI.IV_org_permissions[org_uid]['permissions'] !== firebase_data[org_uid]) {
                Vue.set(CI.IV_org_permissions[org_uid],'permissions', firebase_data[org_uid]);
            }
            regenerate_org_tree_flag = true;
        }

        if (CI.IV_global_org_system_joins_listener === false) {
          CI.InitOrgSystemJoinsGlobalListener()
        }
        if (CI.IV_global_org_locations_listener === false) {
          CI.InitOrgLocationsGlobalListener()
        }

        if(regenerate_org_tree_flag === true) {
            CI.bi7getOrgLocationsOnce(); 
        }
    }

    bi7getOrgLocationsOnce() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7getOrgLocationsOnce ";
        var task_id = "bi7_watchdog_firebase:bi7getOrgLocationsOnce";
        var CI = this;

        var listener_location = 'org_parents/';
        var listener_ref = CI.IV_firebase_db_object.ref(listener_location);

        listener_ref.once("value",
            function (a_data) { CI.OrgLocationsGlobalListener(a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI)
        );
    }

    InitOrgSystemJoinsGlobalListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:InitOrgSystemJoinsGlobalListener ";
        var task_id = "bi7_watchdog_firebase:InitOrgSystemJoinsGlobalListener";
        var CI = this;

        var listener_location = 'org_systems'

        CI.IV_global_org_system_joins_listener = CI.IV_firebase_db_object.ref(listener_location);

        CI.updateLastJoinListenerStartTime();
        CI.IV_global_org_system_joins_listener.on("value",
            function (a_data) {
              CI.OrgSystemJoinsGlobalListener(a_data);              
            }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(this));
    }

    OrgSystemJoinsGlobalListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:OrgSystemJoinsGlobalListener ";
        var task_id = "bi7_watchdog_firebase:OrgSystemJoinsGlobalListener";

        var regenerate_org_tree_flag = false;
        ////// input validation 
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        for (var org_uid in firebase_data) {

          // checking if user has read permissions to this org.
          if (org_uid in CI.IV_org_permissions === false) {
            continue;
          }

          // checking if user has read/view permission for systems under this org.
          let org_permissions = CI.IV_org_permissions[org_uid]['permissions'];
          if (org_permissions.includes("a") === false && org_permissions.includes("l") === false) {
            continue;
          }

          if (org_uid in CI.IV_org_system_joins === false) {
            Vue.set(CI.IV_org_system_joins,org_uid,{});
          }

          var systems_list = firebase_data[org_uid];
          for (var system_uid in systems_list) {
              //ignore last updated entries
              if(system_uid === 'deletion_prevention_key') {
                  continue;
              }
              if (system_uid === "last_updated") {
                  CI.IV_org_system_joins[org_uid]['last_updated'] = systems_list[system_uid];
                  continue;
              }
              if (systems_list[system_uid].indexOf('deleted:') === 0) {
                  Vue.delete(CI.IV_org_system_joins[org_uid],system_uid,system_uid);
                  Vue.delete(CI.IV_system_org_joins,system_uid,org_uid);
                  delete(CI.IV_system_live_uids[system_uid]);
                  //if the preset data has already been generated update it
                  regenerate_org_tree_flag = true;
                  continue;
              }
              
              //this has to be set for values already cached and non-cached data or the systems will be deleted from cache.
              CI.IV_system_live_uids[system_uid] = true; 
              if (system_uid in CI.IV_org_system_joins[org_uid] === false) {
                  Vue.set(CI.IV_org_system_joins[org_uid],system_uid,system_uid);
                  Vue.set(CI.IV_system_org_joins,system_uid,org_uid);
                  regenerate_org_tree_flag = true;
              }

              var sys_obj_uid = system_uid.replace("sys_","obj_");
              if (sys_obj_uid in CI.IV_objects_meta_data === false) {
                Vue.set(CI.IV_objects_meta_data,sys_obj_uid,{});
                let cached_value = localStorage.getItem(`obj_meta_data_${sys_obj_uid}`);

                // We'll use the cache value here if we have.
                if (cached_value !== null || cached_value !== undefined) {
                  Vue.set(CI.IV_objects_meta_data, sys_obj_uid, JSON.parse(cached_value));
                }

                // we'll get one time data from server to verify if we have latest data in cache.
                CI.initSysMetaDataListener(system_uid, true, "bi7")
              }
          }
        }
        CI.updateLastJoinDataChanged();

        //only update the org tree if it has already been generated once.
        if(regenerate_org_tree_flag === true && 
            CI.IV_last_updated_timestamps['presets']['all_preset'] !== null &&
            CI.IV_last_updated_timestamps['presets']['all_preset'] !== undefined
          ) {
            var date_object = new Date();
            CI.IV_last_updated_timestamps['presets']['all_preset'] = date_object.getTime() / 1000;
        }
    }

    InitOrgLocationsGlobalListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:InitOrgLocationsGlobalListener ";
        var task_id = "bi7_watchdog_firebase:InitOrgLocationsGlobalListener";

        var CI = this;
        var listener_location = 'org_parents/';
        CI.IV_global_org_locations_listener = CI.IV_firebase_db_object.ref(listener_location);

        CI.IV_global_org_locations_listener.on("value",
            function (a_data) { CI.OrgLocationsGlobalListener(a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    OrgLocationsGlobalListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:OrgLocationsGlobalListener ";
        var task_id = "bi7_watchdog_firebase:OrgLocationsGlobalListener";

        ////// input validation 
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        var regenerate_org_tree_flag = false;

        for (var org_uid in firebase_data) {
            // checking if user has read permissions to this org and view systems.
            if (org_uid in CI.IV_org_permissions === false) {
              continue;
            }

            regenerate_org_tree_flag = true;
            let org_location = firebase_data[org_uid];

            if (org_location === "last_updated" || org_location === null) {
                return;
            }
            //org1 is the parent org of all orgs in the UI we ignore it.
            CI.IV_org_location_strings[org_uid] = org_location.replace(/<~!ORG!~>/g,'org_')
            org_location = org_location.replace('<~!ORG!~>1','');

            var org_structure = org_location.split('<~!ORG!~>');

            ////recursively go through the org structure dictionary and make sure all the org structures are there
            //think of last_location as an array of pointers with the last entry in the array being our most recent location in CI.IV_org_structure
            var last_location = [];
            last_location.push(CI.IV_org_structure);
            Vue.set(CI.IV_org_parents_lookup,org_uid,[]);
            for (var index in org_structure) {
                if (org_structure[index] === '') {
                    continue;
                }
                var org_parents_list = [];
                //when we do the split we get numbers without the org prefix, this just adds it back
                var last_org_location_uid = 'org_' + org_structure[index];
                if(last_org_location_uid !== org_uid) {
                    CI.IV_org_parents_lookup[org_uid].push(last_org_location_uid);
                }

                //if the org doesn't exist under the current org create it
                if (last_org_location_uid in last_location[last_location.length - 1] === false) {
                    last_location[last_location.length - 1][last_org_location_uid] = {};
                }
                //set the new pointer to the existing org or the one we just created
                last_location.push(last_location[last_location.length - 1][last_org_location_uid]);

            }
            ////</end>recursively go through the org structure dictionary and make sure all the org structures are there
            if (org_uid in CI.IV_org_locations === false || CI.IV_org_locations[org_uid] !== org_structure) {
                CI.IV_org_locations[org_uid] = org_structure;
            }
        }
        CI.IV_first_time_orgs_Locations_loaded = true;
        if (regenerate_org_tree_flag === true) {
          var date_object = new Date();
          CI.IV_rebuild_data_requests['presets']['all_preset'] = date_object.getTime();
        }

    }

    initOrgMetaDataListener(org_uid, remove_listener_command=null, component_id=null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:initOrgMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:initOrgMetaDataListener";

        ////// input validation 
        if (component_id !== null && component_id !== undefined) {
          call_result = bi1_data_validation.is_string(component_id);
          debug_data.push(call_result);
          if (call_result[CR.success] !== RC.success) {
              return_msg += "input validation failed";
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
              return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
          }
        }
        call_result = bi1_data_validation.is_org_uid(org_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;

        // new listener_key_id will generate component specific listeners key.
        var listener_key_id = org_uid;
        if (component_id !== null && component_id !== undefined) {
          listener_key_id = component_id+"_"+org_uid
        }

        if (listener_key_id in CI.IV_listener_org_meta_data === true) { return; }

        if (org_uid in CI.IV_org_meta_data === false) {
            Vue.set(CI.IV_org_meta_data,org_uid,{});
        }

        var listener_location = 'organization/' + org_uid + '/meta_data/';
        CI.IV_listener_org_meta_data[listener_key_id] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_org_meta_data[listener_key_id]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_org_meta_data[listener_key_id];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_org_meta_data[listener_key_id].on("value",
            function (a_data) { CI.OrgMetaDataListener(org_uid, a_data, remove_listener_command, component_id) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    OrgMetaDataListener(org_uid, data, remove_listener_command=null, component_id=null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:OrgMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:OrgMetaDataListener";

        ////// input validation 
        if (component_id !== null && component_id !== undefined) {
          call_result = bi1_data_validation.is_string(component_id);
          debug_data.push(call_result);
          if (call_result[CR.success] !== RC.success) {
              return_msg += "input validation failed";
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
              return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
          }
        }
        call_result = bi1_data_validation.is_org_uid(org_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation
        var CI = this;
        var firebase_data = data.val();
        for(var name in firebase_data) {
            if (name === 'last_updated') {
                CI.bi7CreateDataStoreRequest('org_meta_data',org_uid,firebase_data[name]);
            } else if (name === 'type') {
              if (org_uid in CI.IV_org_meta_data === false || CI.IV_org_meta_data[org_uid] === null || CI.IV_org_meta_data[org_uid] === undefined) {
                  Vue.set(CI.IV_org_meta_data, org_uid, {});
              }
              Vue.set(CI.IV_org_meta_data[org_uid], 'type', firebase_data[name]);
            }
        }

        // removing listeners when getting data for the first time.
        if (remove_listener_command === true) {

          // new listener_key_id will generate component specific listeners key.
          var listener_key_id = org_uid;
          if (component_id !== null && component_id !== undefined) {
            listener_key_id = component_id+"_"+org_uid
          }
          CI.IV_listener_org_meta_data[listener_key_id].off();
          CI.IV_listener_org_meta_data[listener_key_id] = null;
          delete CI.IV_listener_org_meta_data[listener_key_id];   
        }
    }

    initSysMetaDataListener(system_uid, remove_listener_command=null, component_id=null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:initSysMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:initSysMetaDataListener";

        ////// input validation 
        if (component_id !== null && component_id !== undefined) {
          call_result = bi1_data_validation.is_string(component_id);
          debug_data.push(call_result);
          if (call_result[CR.success] !== RC.success) {
              return_msg += "input validation failed";
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
              return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
          }
        }
        call_result = bi1_data_validation.is_system_uid(system_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        //systems are really just objects to the DB
        var system_object_uid = system_uid.replace('sys_','obj_')

        // new listener_key_id will generate component specific listeners key.
        var listener_key_id = system_object_uid;
        if (component_id !== null && component_id !== undefined) {
          listener_key_id = component_id+"_"+system_object_uid
        }

        if (listener_key_id in CI.IV_listener_object_meta_data === true) { return; }

        var listener_location = 'objects/' + system_object_uid + '/meta_data/last_updated';
        CI.IV_listener_object_meta_data[listener_key_id] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_object_meta_data[listener_key_id]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_object_meta_data[listener_key_id];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_object_meta_data[listener_key_id].on("value",
            function (a_data) { CI.SysMetaDataListener(system_object_uid, a_data, remove_listener_command, component_id) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    SysMetaDataListener(system_object_uid, data, remove_listener_command=null, component_id=null) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:SysMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:SysMetaDataListener";

        ////// input validation 
        if (component_id !== null && component_id !== undefined) {
          call_result = bi1_data_validation.is_string(component_id);
          debug_data.push(call_result);
          if (call_result[CR.success] !== RC.success) {
              return_msg += "input validation failed";
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
              return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
          }
        }
        call_result = bi1_data_validation.is_object_uid(system_object_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        CI.bi7CreateDataStoreRequest('obj_meta_data',system_object_uid,firebase_data);

        // removing listeners when getting data for the first time.
        if (remove_listener_command === true) {

          // new listener_key_id will generate component specific listeners key.
          var listener_key_id = system_object_uid;
          if (component_id !== null && component_id !== undefined) {
            listener_key_id = component_id+"_"+system_object_uid
          }
          CI.IV_listener_object_meta_data[listener_key_id].off();
          CI.IV_listener_object_meta_data[listener_key_id] = null;
          delete CI.IV_listener_object_meta_data[listener_key_id];   
        }
    }

    initObjectAttributeMetaDataListener(object_attribute_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:initObjectAttributeMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:initObjectAttributeMetaDataListener";
        var CI = this;
        var object_uid = '';
        ////// input validation 
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        call_result = CI.bi7GetObjectUidFromOjbectAttributeUid(object_attribute_uid)
        if(call_result['success'] === RC.success) {
            object_uid = call_result['object_uid']
        }
        debug_data.push(call_result);
        
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                return_msg += "input validation failed";
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
            }
        }
        //////</end> input validation 

        

        if (object_attribute_uid in CI.IV_object_attributes_meta_data === false) {
            Vue.set(CI.IV_object_attributes_meta_data,object_attribute_uid, {});
        }

        ///// if a listener isn't active for this object attribute start one
        if (object_attribute_uid in CI.IV_listener_object_attributes_meta_data === false) {
            var listener_location = 'objects/' + object_uid + '/attribute_list/' + object_attribute_uid + '/last_updated';
            CI.IV_listener_object_attributes_meta_data[object_attribute_uid] = CI.IV_firebase_db_object.ref(listener_location);

            ///// removing invalid firebase listener key
            call_result = CI.validateFirebaseListener(CI.IV_listener_object_attributes_meta_data[object_attribute_uid]);
            debug_data.push(call_result)
            if (call_result[CR.success] !== RC.success) {
              delete CI.IV_listener_object_attributes_meta_data[object_attribute_uid];
              return_msg += "failed to create listener for " + listener_location;
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
              return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
            }
            ///// </end> removing invalid firebase listener key

            /// using Cached data to show fast loading then the new data(if changed) will automatically be updated
            let cached_value = localStorage.getItem(`obj_atr_meta_data_${object_attribute_uid}`);

            // We'll use the cache value here if we have.
            if (cached_value !== null || cached_value !== undefined) {
              Vue.set(CI.IV_object_attributes_meta_data, object_attribute_uid, JSON.parse(cached_value));
            }
            ///</end> using Cached data to show fast loading then the new data(if changed) will automatically be updated

            CI.IV_listener_object_attributes_meta_data[object_attribute_uid].on("value",
                function (a_data) { CI.ObjectAttributeMetaDataListener(object_attribute_uid, a_data) }.bind(CI),
                function (errorObject) {
                    return_msg += "firebase read failed with error data:" + errorObject;
                    base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                }.bind(this));
        }
        /////</end> if a listener isn't active for this object attribute start one
    }

    ObjectAttributeMetaDataListener(object_attribute_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:ObjectAttributeMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:ObjectAttributeMetaDataListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        var firebase_data = data.val();
        CI.bi7CreateDataStoreRequest('obj_atr_meta_data',object_attribute_uid,firebase_data);
    }

    bi7processDataStoreRequests(batch_request_check=false) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7processDataStoreRequests ";
        var task_id = "bi7_watchdog_firebase:bi7processDataStoreRequests";
        var CI = this;
        if(CI.IV_instance_initialized !== true || CI.IV_user_info['uid'] === 0) {
            setTimeout(CI.bi7processDataStoreRequests.bind(CI),500);
            return;
        }

        var now_time = new Date();
        var now_time_epoch = now_time.getTime() / 1000;
        // we don't want to run the requests process too fast when there are very items in queue, this is because we want to ensure things are being run in efficent size batches
        if(batch_request_check === true) {
          var last_request_run_time_difference = now_time_epoch - CI.IV_process_datastore_last_run_time
          if( CI.IV_process_datatore_last_request_count < 2 && last_request_run_time_difference < 1) {
            return;
          }
        }
        
        //this acts as a safety in case bi7processDataStoreRequests crashes while running and doesn't set IV_process_datastore_request_active back to false
        if( CI.IV_process_datastore_request_active === true 
          && (now_time_epoch - CI.IV_process_datastore_last_run_time) > 20) {
            CI.IV_process_datastore_request_active = false;
        }


        if(CI.IV_process_datastore_request_active === true) {
          setTimeout(CI.bi7processDataStoreRequests.bind(CI),100);
            return;
        }
        CI.IV_process_datastore_request_active = true;
        var request_list = {};
        var request_list_string = '';
        var delete_list = {};
        var requst_count = 0;
        var max_request_count = 200;
        var prefix_comma = false;
        ///// build the request list and the list of requests we already processed
        for(var type in CI.IV_meta_data_requests) {
            for(var uid in CI.IV_meta_data_requests[type]) {
                //if the uid doesn't exist it means we've never gotten data for it
                if( uid in CI.IV_last_updated_timestamps[type] === false || CI.IV_meta_data_requests[type][uid]['request_time'] > CI.IV_last_updated_timestamps[type][uid])
                {
                    //// checking the uid retry count for this uid.
                    if (type in CI.IV_meta_data_requests_retry_count === false) {
                      CI.IV_meta_data_requests_retry_count[type] = {};
                    }
                    if (uid in CI.IV_meta_data_requests_retry_count[type] === false) {
                      CI.IV_meta_data_requests_retry_count[type][uid] = 0;
                    }

                    /// removing from request queue if reaches max retry count.
                    if (CI.IV_meta_data_requests_retry_count[type][uid] < CI.IV_meta_data_requests_max_retry_count) {
                      CI.IV_meta_data_requests_retry_count[type][uid] += 1;
                    } else {
                      delete CI.IV_meta_data_requests_retry_count[type][uid];
                      delete CI.IV_meta_data_requests[type][uid];
                      console.log("deleted from process data request queue due to max retry count:"+uid);
                      continue;
                    }
                    ///</end> removing from request queue if reaches max retry count.
                    ////</end> checking the uid retry count for this uid.

                    if(type in request_list === false) { request_list[type] = {}; }
                    if(uid in request_list[type] === false) { request_list[type][uid] = {}; }
                    request_list[type][uid]['request_time'] = CI.IV_meta_data_requests[type][uid]['request_time'];
                    request_list[type][uid]['make_cache'] = CI.IV_meta_data_requests[type][uid]['make_cache'];
                    
                    if(prefix_comma === true) { 
                        request_list_string += ','
                    }
                    requst_count += 1;
                    request_list_string += uid;
                    if(prefix_comma === false) {
                      prefix_comma = true;
                    }

                } else if (CI.IV_meta_data_requests[type][uid]['request_time'] < CI.IV_last_updated_timestamps[type][uid]) {
                    if(type in delete_list === false) { delete_list[type] = {}; }
                    delete_list[type][uid] = CI.IV_meta_data_requests[type][uid];   
                }
                if(requst_count > max_request_count) {
                  break;
                }
            }
            if(requst_count > max_request_count) {
              break;
            }
        }
        /////</end> build the request list and the list of requests we already processed

        ///// delete the requests we already processed
        for(var type in delete_list) {
            for(var uid in delete_list[type]) {
                delete CI.IV_meta_data_requests[type][uid];

                // clearing up uid from retry count structure for future.
                // In case we need to fetch updated value for this uid.
                if (type in CI.IV_meta_data_requests_retry_count === true) {
                  if (uid in CI.IV_meta_data_requests_retry_count[type] === true) {
                    delete CI.IV_meta_data_requests_retry_count[type][uid];
                  }
                }
                //</end> clearing up uid from retry count structure for future.
                //</end> In case we need to fetch updated value for this uid.
            }
        }
        /////</end> delete the requests we already processed

        if(request_list_string.length < 1) {
            setTimeout(CI.bi7processDataStoreRequests.bind(CI),2000);
            CI.IV_process_datatore_last_request_count = 0;
            CI.IV_process_datastore_request_active = false;
            return;
        }
        CI.IV_process_datatore_last_request_count = requst_count;
        console.log('bi7processDataStoreRequests ran')
        ////// send the request
        var date_object = new Date();
        //JS getTime is in ms, pythong time function is in seconds. we have to compare to server data from python so we store it in seconds.
        var latest_data_time = date_object.getTime() / 1000;
        ajax({
            url: window.G_ajax_test_domain + '/json-requests/p2s7t3-get-object-info',
            method: 'POST',
            dataType: "json",
            data: {
                'p2s7_token': CI.IV_id_token_pointer,
                'p2s7_firebase_email': CI.IV_firebase_email_pointer,
                'p2s7t3_object_list': request_list_string
            },

            success: function (payload) {
                CI = this;                
                for (var key in payload) {
                    if (key.indexOf('org_') === 0) {
                        Vue.set(CI.IV_org_meta_data,key,payload[key]);
                        CI.IV_last_updated_timestamps['org_meta_data'][key] = latest_data_time;

                        if (key in CI.IV_meta_data_requests['org_meta_data'] === true) {
                          if ('make_cache' in CI.IV_meta_data_requests['org_meta_data'][key] &&
                              CI.IV_meta_data_requests['org_meta_data'][key]['make_cache'] === true) {
                                localStorage.setItem('org_meta_data_' + key + '_updated', latest_data_time);
                                localStorage.setItem('org_meta_data_' + key, JSON.stringify(payload[key]));
                          }
                        }
                    } else if (key.indexOf('obj_atr_') === 0) {
                        if ('settable_value_string_values' in payload[key] && typeof payload[key]['settable_value_string_values'] === 'string') {
                            payload[key]['settable_value_string_values'] = payload[key]['settable_value_string_values'].split(',');
                        }
                        Vue.set(CI.IV_object_attributes_meta_data,key,payload[key]);
                        CI.IV_last_updated_timestamps['obj_atr_meta_data'][key] = latest_data_time;
                        
                        if (key in CI.IV_meta_data_requests['obj_atr_meta_data'] === true) {
                          if ('make_cache' in CI.IV_meta_data_requests['obj_atr_meta_data'][key] &&
                              CI.IV_meta_data_requests['obj_atr_meta_data'][key]['make_cache'] === true) {
                                localStorage.setItem('obj_atr_meta_data_' + key + '_updated', latest_data_time);
                                localStorage.setItem('obj_atr_meta_data_' + key, JSON.stringify(payload[key]));
                          } else {

                            // if we are not making cache it means we are fetching data for CSV.
                            // So, we'll populate this attribute name to default names dictionary.
                            // Other attributes with same num_uid will be able use this name.
                            CI.IV_default_obj_attribute_names[key.split("-")[1]] = payload[key].name;
                          }
                        }
                    } else if (key.indexOf('obj_') === 0) {
                        Vue.set(CI.IV_objects_meta_data,key,payload[key]);
                        CI.IV_last_updated_timestamps['obj_meta_data'][key] = latest_data_time;
                        
                        if (key in CI.IV_meta_data_requests['obj_meta_data'] === true) {
                          if ('make_cache' in CI.IV_meta_data_requests['obj_meta_data'][key] &&
                              CI.IV_meta_data_requests['obj_meta_data'][key]['make_cache'] === true) {
                                localStorage.setItem('obj_meta_data_' + key + '_updated', latest_data_time);
                                localStorage.setItem('obj_meta_data_' + key, JSON.stringify(payload[key]));
                          }
                        }
                    } else if (key.indexOf('usr_') === 0) {
                        CI.IV_last_updated_timestamps['usr_contact_email'][key] = latest_data_time;
                        Vue.set(CI.IV_users_contact_email,key,payload[key]['email']);
                    }

                }
                CI.IV_process_datastore_last_run_time = now_time_epoch;
                CI.IV_process_datastore_request_active = false;

            }.bind(CI),
            error: function (error) {
              
              if (error.status === 401) {
                window.G_firebase_auth.bi5forceTokenRefresh();
              }
              return_msg += "p2s7t3 failed with error data:" + JSON.stringify(error);
              CI.IV_process_datastore_request_active = false;
              CI.IV_process_datastore_last_run_time = now_time_epoch;
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI)
        });
        ////// </end> send the request        
        setTimeout(CI.bi7processDataStoreRequests.bind(CI),1000);
        return;
    }

    bi7BuildPresets() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7BuildPresets ";
        var task_id = "bi7_watchdog_firebase:bi7BuildPresets";
        var function_name = 'bi7BuildPresets';
        var CI = this;
        if(CI.IV_instance_initialized !== true || CI.IV_user_info['uid'] === 0) {
            setTimeout(CI.bi7BuildPresets.bind(CI),1000);
            return;
        }
        var date_object = new Date();
        //we set the last updated time in the past so that if an update occurs while the rebuild is happening it will be caught
        var last_updated_time = date_object.getTime() - 1000;
        if('all_preset' in CI.IV_last_updated_timestamps['presets'] === false || 
            CI.IV_last_updated_timestamps['presets']['all_preset'] < CI.IV_rebuild_data_requests['presets']['all_preset']
          ) {
            Vue.set(CI.IV_presets,'all_preset',CI.bi7BuildPresetsFlagOrgs(JSON.parse(JSON.stringify(CI.IV_org_structure)), null, '', '1'));
            CI.IV_last_updated_timestamps['presets']['all_preset'] = last_updated_time;
        }
        setTimeout(CI.bi7BuildPresets.bind(CI),3000);        
    }

    bi7BuildPresetsFlagOrgs(org, org_uid = null, parent_key = '', preset_id) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7BuildPresetsFlagOrgs ";
        var task_id = "bi7_watchdog_firebase:bi7BuildPresetsFlagOrgs";
        
        ////// input validation 
        if (org_uid !== null && org_uid !== undefined) {
          call_result = bi1_data_validation.is_org_uid(org_uid);
          debug_data.push(call_result);
        }
        call_result = bi1_data_validation.is_string(parent_key);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(preset_id);
        debug_data.push(call_result);

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }

        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        //////</end> input validation 
        
        var CI = this;
        var nodes = {};
        var system_nodes = [];
        var org_nodes = [];
        var sub_org_nodes = [];

        //we only want the last entry in a key to have the full prefix
        parent_key = parent_key.replace('org_', 'O');
        parent_key = parent_key.replace('sys_', 'S');
        ////if the org has systems add them to it
        if (org_uid !== null && org_uid !== undefined && org_uid in CI.IV_org_system_joins) {
            for (var system_uid in CI.IV_org_system_joins[org_uid]) {
                if (system_uid === "last_updated") { continue; }
                system_nodes.push({ 'isSys': true, 'uid': system_uid, 'key': preset_id + parent_key + system_uid });
            }
        }
        ////</end>if the org has systems add them to it
        for (var suborg in org) {

            //go a level deeper
            var lower_level_org_sys_dict = CI.bi7BuildPresetsFlagOrgs(org[suborg], suborg, parent_key + suborg, preset_id);
            if ('orgs' in lower_level_org_sys_dict === true || 'systems' in lower_level_org_sys_dict === true) {
                org_nodes.push({ 'uid': suborg, 'key': preset_id + parent_key + suborg, 'isOrg': true, 'nodes': lower_level_org_sys_dict });
            } else {
                org_nodes.push({ 'uid': suborg, 'key': preset_id + parent_key + suborg, 'isOrg': true });
            }
        }


        if (org_nodes.length > 0) {
            nodes['orgs'] = org_nodes;
        }
        if (system_nodes.length > 0) {
            nodes['systems'] = system_nodes;
        }
        return (nodes);
    }

    initObjectMetaDataListener(object_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:initObjectMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:initObjectMetaDataListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        var listener_location = 'objects/' + object_uid + '/meta_data/last_updated';
        CI.IV_listener_object_meta_data[object_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_object_meta_data[object_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_object_meta_data[object_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key


        /// using Cached data to show fast loading then the new data(if updated) will automatically be updated
        let cached_value = localStorage.getItem(`obj_meta_data_${object_uid}`);

        // We'll use the cache value here if we have.
        if (cached_value !== null || cached_value !== undefined) {
          Vue.set(CI.IV_objects_meta_data, object_uid, JSON.parse(cached_value));
        }
        ///</end> using Cached data to show fast loading then the new data(if updated) will automatically be updated

        CI.IV_listener_object_meta_data[object_uid].on("value",
            function (a_data) { CI.ObjectMetaDataListener(object_uid, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    ObjectMetaDataListener(object_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:ObjectMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:ObjectMetaDataListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        CI.bi7CreateDataStoreRequest('obj_meta_data',object_uid,firebase_data);

    }


    bi7initObjectAttributeValueListener(object_attribute_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7initObjectAttributeValueListener ";
        var task_id = "bi7_watchdog_firebase:bi7initObjectAttributeValueListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        var listener_location = 'newest_obj_atr_values/' + object_attribute_uid + '/';
        
        if (object_attribute_uid in CI.IV_object_attribute_values === false){
            Vue.set(CI.IV_object_attribute_values,object_attribute_uid,{});
        }
        if(object_attribute_uid in CI.IV_listener_object_attribute_values && 
          CI.IV_listener_object_attribute_values[object_attribute_uid] !== null &&
          CI.IV_listener_object_attribute_values[object_attribute_uid] !== undefined
        ) {
            return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        CI.IV_listener_object_attribute_values[object_attribute_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_object_attribute_values[object_attribute_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_object_attribute_values[object_attribute_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_object_attribute_values[object_attribute_uid].on("value",
            function (a_data) { CI.ObjectAttributeValueListener(object_attribute_uid, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    ObjectAttributeValueListener(object_attribute_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:ObjectMetaDataListener ";
        var task_id = "bi7_watchdog_firebase:ObjectMetaDataListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        if (firebase_data === null) { // the object attribute may have no data yet
          return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }        
        Vue.set(CI.IV_object_attribute_values[object_attribute_uid],'value', firebase_data['value']);
        Vue.set(CI.IV_object_attribute_values[object_attribute_uid],'last_updated', firebase_data['last_updated']);
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    InitUserInfoListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:InitUserInfoListener ";
        var task_id = "bi7_watchdog_firebase:InitUserInfoListener";
        var CI = this;

        if (CI.IV_instance_initialized === false) {
            return_msg += 'instance is not initialized';
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /*when a new user is made, these directories the server creates the users directory after the client 
        subscribes, creating the folder ensures that when the cserver creates the data, the client will get the 
        update.*/

        var folder_missing_flag = false;
        for(var key in CI.IV_user_folder_valid.folders) {
            if(CI.IV_user_folder_valid.folders[key] === false) {
                folder_missing_flag = true;
                var folder_name  = key.toString();
                var user_folder_created_callback = function() {
                    CI.IV_user_folder_valid.folders[folder_name] = true;
                }.bind(CI)

                CI.bi7CreateUserFolderIfNotExists(CI.IV_user_folder_path +  '/' + key ,user_folder_created_callback);
            }
        }

        if(folder_missing_flag !== false) {
            setTimeout(function() { CI.InitUserInfoListener();}.bind(CI),300);
            return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }


        var listener_location = CI.IV_user_folder_path +  '/meta_data';
        CI.IV_listener_user_info['info'] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_user_info['info']);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_user_info['info'];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_user_info['info'].on("value",CI.UserInfoListener.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    UserInfoListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:UserInfoListener ";
        var task_id = "bi7_watchdog_firebase:UserInfoListener";
        
        ////// input validation 
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        var firebase_data = data.val();

        for (var field in firebase_data) {
             if(field in CI.IV_user_info) {
                CI.IV_user_info[field] = firebase_data[field];
                CI.IV_user_folder_valid[field] = true;
            }
        }
        var fields_missing = false;
        for(var key in CI.IV_user_folder_valid) {
            if(CI.IV_user_folder_valid[key] === false) {
                fields_missing = true;
            }
        }
        if(fields_missing === true) { 
            return;
        }
        CI.callCallBackFunction(CI.IV_data_change_callbacks['IV_user_info']);
    }

    bi7CreateUserFolderIfNotExists(folder,finished_callback) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7CreateUserFolderIfNotExists ";
        var task_id = "bi7_watchdog_firebase:bi7CreateUserFolderIfNotExists";

        ////// input validation
        call_result = bi1_data_validation.is_string(folder);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_function(finished_callback);
        debug_data.push(call_result);

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }

        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////// </end> input validation

        var CI = this;
        if (CI.IV_instance_initialized === false) {
            return_msg += 'instance is not initialized';
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        var listener = CI.IV_firebase_db_object.ref(folder);
        if (listener === null) {
            return_msg += "failed to create listener for " + folder;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        var listener_callback = function (data,finished_callback) {
            var firebase_data = data.val();
            if (firebase_data === null) {
                listener.set({'deletion_prevention_key':'deletion_prevention_key'})
                listener.off();
            }
            CI.callCallBackFunction(finished_callback);
        }

        listener.once("value", function(data) { listener_callback(data,finished_callback);}.bind(this) ,
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
        
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7InitDoghouseListener(org_uid = null, sys_uid = null, obj_uid = null, obj_atr_uid = null,doghouse_active_flag=false,doghouse_history_flag = false) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitDoghouseListenerStep1 ";
        var task_id = "bi7_watchdog_firebase:bi7InitDoghouseListenerStep1";
        var CI = this;
        //////// input validation
        if (org_uid !== null && org_uid !== undefined) {
            call_result = bi1_data_validation.is_org_uid(org_uid);
            debug_data.push(call_result);
        } 
        if (sys_uid !== null && sys_uid !== undefined) {
            call_result = bi1_data_validation.is_system_uid(sys_uid);
            debug_data.push(call_result);
        }
        if (obj_uid !== null && obj_uid !== undefined) {
            call_result = bi1_data_validation.is_object_uid(obj_uid);
            debug_data.push(call_result);
        } 
        if (obj_atr_uid !== null && obj_atr_uid !== undefined) {
            call_result = bi1_data_validation.is_object_attribute_uid(obj_atr_uid);
            debug_data.push(call_result);
        } 

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }
        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////// </end> input validation

        ///// setup up listening folder paths
        var history_listen_folder = CI.IV_user_folder_path + '/dog_house_history/';
        var active_listen_folder = CI.IV_user_folder_path + '/dog_house_active/';
        if (org_uid !== null && org_uid !== undefined) {
            history_listen_folder += org_uid + '/';
            active_listen_folder += org_uid + '/';
        }
        if (sys_uid !== null && sys_uid !== undefined) {
            history_listen_folder += sys_uid + '/';
            active_listen_folder += sys_uid + '/';
        }
        if (obj_uid !== null && obj_uid !== undefined) {
            history_listen_folder += obj_uid + '/';
            active_listen_folder += obj_uid + '/';
        }
        if (obj_atr_uid !== null && obj_atr_uid !== undefined) {
            history_listen_folder += obj_atr_uid + '/';
            active_listen_folder += obj_atr_uid + '/';
        }
        /////</end> setup up listening folder paths


        ////// check if these paths are already being listened too
        if (doghouse_history_flag === true) {
            if(history_listen_folder in CI.IV_listener_doghouse_history) {
               doghouse_history_flag = false
            }
        }
        if (doghouse_history_flag === true) {
            for(var key in CI.IV_listener_doghouse_history) {
                if(key.indexOf(history_listen_folder)>=0) {
                    doghouse_history_flag = false;
                    break;
                }
            }
        }
        if (doghouse_active_flag === true) {
            if(active_listen_folder in CI.IV_listener_doghouse_active) {
                doghouse_active_flag = false
            }
        }
        if (doghouse_active_flag === true) {
            for(var key in CI.IV_listener_doghouse_active) {
                if(key.indexOf(active_listen_folder) >= 0) {
                    doghouse_active_flag = false;
                    break;
                }
            }
        }

        if (doghouse_active_flag === false && doghouse_history_flag === false) {
            return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        
        //////</end> check if these paths are already being listened too

        //// create paths for vue to monitor so reactivity works when data doesn't exist yet
        if(doghouse_history_flag === true) {
            Vue.set(CI.IV_component_loading_states, 'c5_doghouse_history', true);
            if (org_uid !== null && org_uid !== undefined && org_uid in CI.IV_doghouse_history === false) {
                Vue.set(CI.IV_doghouse_history,org_uid, {});
            }
            if (sys_uid !== null && sys_uid !== undefined && sys_uid in CI.IV_doghouse_history[org_uid] === false) {
                Vue.set(CI.IV_doghouse_history[org_uid],sys_uid, {});
            }
            if (obj_uid !== null && obj_uid !== undefined && obj_uid in CI.IV_doghouse_history[org_uid][sys_uid] === false) {
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid],obj_uid, {});
            }
            if (obj_atr_uid !== null && obj_atr_uid !== undefined && obj_atr_uid in CI.IV_doghouse_history[org_uid][sys_uid][obj_uid] === false) { 
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid][obj_uid],obj_atr_uid, {});
            }
            if (obj_atr_uid !== null && obj_atr_uid !== undefined && obj_atr_uid in CI.IV_doghouse_history[org_uid][sys_uid][obj_uid][obj_atr_uid] === false) { 
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid][obj_uid][obj_atr_uid],obj_atr_uid,null);            
            }
        }

        if(doghouse_active_flag === true) {
            if (org_uid !== null && org_uid !== undefined && org_uid in CI.IV_doghouse_active === false) {
                Vue.set(CI.IV_doghouse_active,org_uid, {});
            }
            if (sys_uid !== null && sys_uid !== undefined && sys_uid in CI.IV_doghouse_active[org_uid] === false) {
                Vue.set(CI.IV_doghouse_active[org_uid],sys_uid, {});
            }
            if (obj_uid !== null && obj_uid !== undefined && obj_uid in CI.IV_doghouse_active[org_uid][sys_uid] === false) {
                Vue.set(CI.IV_doghouse_active[org_uid][sys_uid],obj_uid, {});
            }
            if (obj_atr_uid !== null && obj_atr_uid !== undefined && obj_atr_uid in CI.IV_doghouse_active[org_uid][sys_uid][obj_uid] === false) { 
                Vue.set(CI.IV_doghouse_active[org_uid][sys_uid][obj_uid],obj_atr_uid, {});            
            }
            if (obj_atr_uid !== null && obj_atr_uid !== undefined && obj_atr_uid in CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_atr_uid] === false) { 
                Vue.set(CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_atr_uid],obj_atr_uid,null);            
            }
        }
        ////</end> create paths for vue to monitor so reactivity works when data doesn't exist yet


        var firebase_error_callback = function(error) {
            return_msg += "firebase read failed with error data:" + error;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        }
        
        /////// create the doghouse history listener
        if (doghouse_history_flag === true) {
            CI.IV_listener_doghouse_history[history_listen_folder] = null;

            var init_history_listener_callback = function() {
                if (history_listen_folder in CI.IV_listener_doghouse_history === false || CI.IV_listener_doghouse_history[history_listen_folder] === null) {
                    CI.IV_listener_doghouse_history[history_listen_folder] = CI.IV_firebase_db_object.ref(history_listen_folder);
                }

                ///// removing invalid firebase listener key
                call_result = CI.validateFirebaseListener(CI.IV_listener_doghouse_history[history_listen_folder]);
                debug_data.push(call_result)
                if (call_result[CR.success] !== RC.success) {
                  delete CI.IV_listener_doghouse_history[history_listen_folder];
                  return_msg += "failed to create listener for " + listener_location;
                  base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                  return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
                }
                ///// </end> removing invalid firebase listener key
                CI.IV_doghouse_history_listeners_count++;
                Vue.set(CI.IV_component_loading_states, 'c5_doghouse_history', true);
                CI.IV_listener_doghouse_history[history_listen_folder].on("value",
                    function (a_data) { CI.bi7DoghouseHistoryListener(a_data) }.bind(CI),
                    function (error) {firebase_error_callback(error)}.bind(this)
                );

                CI.IV_listener_doghouse_history[history_listen_folder].on("child_removed",
                    function (a_data) { CI.bi7DoghouseHistoryListener(a_data,true) }.bind(CI),
                    function (error) {firebase_error_callback(error)}.bind(this));
            };
    

            CI.IV_listener_doghouse_history[history_listen_folder]  = null;
            CI.bi7CreateUserFolderIfNotExists(history_listen_folder,init_history_listener_callback);
        }
        ///////</end> create the doghouse history listener

        /////// create the doghouse active listener
        if (doghouse_active_flag === true ) {
            CI.IV_listener_doghouse_active[active_listen_folder] = null;

            var init_active_listener_callback = function() {
                if (active_listen_folder in CI.IV_listener_doghouse_active === false || CI.IV_listener_doghouse_active[active_listen_folder] === null) {
                    CI.IV_listener_doghouse_active[active_listen_folder] = CI.IV_firebase_db_object.ref(active_listen_folder);
                }
                if (CI.IV_listener_doghouse_active[active_listen_folder] === null) {
                    return_msg += "failed to create listener for " + active_listen_folder;
                    base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                    return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
                }
                CI.IV_listener_doghouse_active[active_listen_folder].on("value",
                    function (b_data) { CI.bi7DoghouseActiveListener(b_data) }.bind(CI),
                    function (error) {firebase_error_callback(error)}.bind(this)
                );
                CI.IV_listener_doghouse_active[active_listen_folder].on("child_removed",
                function (b_data) { CI.bi7DoghouseActiveListener(b_data,true) }.bind(CI),
                function (error) {firebase_error_callback(error)}.bind(this)
                );
            };

            CI.IV_listener_doghouse_active[active_listen_folder] = null;
            CI.bi7CreateUserFolderIfNotExists(active_listen_folder,init_active_listener_callback);
        }
        ///////</end> create the doghouse active listener
    
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7initDogHouseActiveGlobalListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7initDogHouseActiveGlobalListener ";
        var task_id = "bi7_watchdog_firebase:bi7initDogHouseActiveGlobalListener";
        var CI = this;

        if(CI.IV_instance_initialized !== true || CI.IV_user_info['uid'] === 0) {
            setTimeout(CI.bi7initDogHouseActiveGlobalListener.bind(CI),500);
            return;
        }

        var firebase_error_callback = function(error) {
            return_msg += "firebase read failed with error data:" + error;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        }

        var active_listen_folder = CI.IV_user_folder_path + '/dog_house_active/';
        var path_ref = CI.IV_firebase_db_object.ref(active_listen_folder);
        path_ref.on("value",
            function (b_data) { CI.bi7DoghouseActiveListener(b_data) }.bind(CI),
            function (error) {firebase_error_callback(error)}.bind(this)
        );
    }

    bi7initDogHouseAcknowledgedGlobalListener() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7initDogHouseAcknowledgedGlobalListener ";
      var task_id = "bi7_watchdog_firebase:bi7initDogHouseAcknowledgedGlobalListener";
      var CI = this;

      if (CI.IV_instance_initialized !== true || CI.IV_user_info['uid'] === 0) {
        setTimeout(CI.bi7initDogHouseAcknowledgedGlobalListener.bind(CI),500);
        return;
      }

      var firebase_error_callback = function(error) {
        return_msg += "firebase read failed with error data:" + error;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }

      Vue.set(CI.IV_component_loading_states, 'c5_acknowledged_items', true);

      var active_listen_folder = CI.IV_user_folder_path + '/dog_house_ackowledged/';
      var path_ref = CI.IV_firebase_db_object.ref(active_listen_folder);
      path_ref.on("value",
        function (b_data) { CI.bi7DoghouseAcknowledgedListener(b_data) }.bind(CI),
        function (error) {firebase_error_callback(error)}.bind(this)
      );

      return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7InitDoghouseAcknowledgedListener(org_uid = null, sys_uid = null, obj_uid = null, obj_atr_uid = null) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7InitDoghouseAcknowledgedListener ";
      var task_id = "bi7_watchdog_firebase:bi7InitDoghouseAcknowledgedListener";
      var CI = this;
      Vue.set(CI.IV_component_loading_states, 'c5_acknowledged_items', true);
      //////// input validation
      if(org_uid != null) {
          call_result = bi1_data_validation.is_org_uid(org_uid);
          debug_data.push(call_result);
      } 
      if(sys_uid != null) {
          call_result = bi1_data_validation.is_system_uid(sys_uid);
          debug_data.push(call_result);
      }
      if(obj_uid != null) {
          call_result = bi1_data_validation.is_object_uid(obj_uid);
          debug_data.push(call_result);
      } 
      if(obj_atr_uid != null) {
          call_result = bi1_data_validation.is_object_attribute_uid(obj_atr_uid);
          debug_data.push(call_result);
      } 

      var validation_failed = false;
      for (var index in debug_data) {
          if (debug_data[index][CR.success] != RC.success) {
              validation_failed = true;
          }
      }
      if(validation_failed == true) {
          return_msg += "input validation failed";
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      /////// </end> input validation

      ///// setup up listening folder paths
      var listen_folder = CI.IV_user_folder_path + '/dog_house_ackowledged/';
      if(org_uid != null) {
          listen_folder += org_uid + '/';
      }
      if(sys_uid != null) {
          listen_folder += sys_uid + '/';
      }
      if(obj_uid != null) {
          listen_folder += obj_uid + '/';
      }
      if(obj_atr_uid != null) {
          listen_folder += obj_atr_uid + '/';
      }
      /////</end> setup up listening folder paths

      // we already have listener for this location
      if (listen_folder in CI.IV_listener_doghouse_acknowledge == true) {
        return;
      }

      if(org_uid != null && org_uid in CI.IV_doghouse_acknowledged == false) {
        Vue.set(CI.IV_doghouse_acknowledged,org_uid, {});
      }
      if(sys_uid != null && sys_uid in CI.IV_doghouse_acknowledged[org_uid] == false) {
        Vue.set(CI.IV_doghouse_acknowledged[org_uid],sys_uid, {});
      }
      if(obj_uid != null && obj_uid in CI.IV_doghouse_acknowledged[org_uid][sys_uid] == false) {
        Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid],obj_uid, {});
      }
      if(obj_atr_uid != null && obj_atr_uid in CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid] == false) { 
        Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid],obj_atr_uid, {});            
      }
      if(obj_atr_uid != null && obj_atr_uid in CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_atr_uid] == false) { 
        Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_atr_uid],obj_atr_uid,null);            
      }

      CI.IV_listener_doghouse_acknowledge[listen_folder] = CI.IV_firebase_db_object.ref(listen_folder);

      var init_listener_callback = function() {
        CI.IV_listener_doghouse_acknowledge[listen_folder].on("value",
          function (b_data) { CI.bi7DoghouseAcknowledgedListener(b_data) }.bind(CI),
          function (error) {
            return_msg += "firebase read failed with error data:" + error;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          }.bind(this)
        );
      }

      CI.bi7CreateUserFolderIfNotExists(listen_folder,init_listener_callback);

      return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7DoghouseAcknowledgedListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7DoghouseAcknowledgedListener ";
        var task_id = "bi7_watchdog_firebase:bi7DoghouseAcknowledgedListener";
    
        ///// input validation
        if (data == null) {
            Vue.set(CI.IV_component_loading_states, 'c5_acknowledged_items', false);
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /////</end> input validation

        var CI = this;
        var firebase_data = data.val()

        /// convert the nested object into a flat array since the data is json encoded we don't need the structure
        try {
            firebase_data  = bi6_misc.bi6FlattenObject(firebase_data)
        } catch(error) {
            Vue.set(CI.IV_component_loading_states, 'c5_acknowledged_items', false);
            return_msg += "failed to create flatten firebase_data with error:" + JSON.stringify(error);
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.general_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///</end> convert the nested object into a flat array since the data is json encoded we don't need the structure

        var entry,org_uid,sys_uid,obj_uid,obj_atr_uid,rule_uid;
        for(var key in firebase_data) {
            if (firebase_data[key] == 'deletion_prevention_key') {
                continue;
            }

            try {
                entry = JSON.parse(firebase_data[key])
                entry['rule_join_uid'] = entry['rule_uid']
                entry['rule_uid'] = entry['rule_join_uid'].split('|')[1]
            } catch(error) {
                var error_msg = return_msg + "failed to JSOn parse firebase data with error:" + error;
                debug_data.push(firebase_data[key])
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, error_msg, debug_data);
                continue;
            }
            
            org_uid = entry['org_uid'];
            sys_uid = entry['sys_uid'];
            obj_uid = entry['obj_uid'];
            obj_atr_uid = entry['obj_atr_uid'];
            rule_uid = entry['rule_uid']
            if(org_uid in CI.IV_doghouse_acknowledged == false) {
                Vue.set(CI.IV_doghouse_acknowledged,org_uid, {});
            }

            if(sys_uid in CI.IV_doghouse_acknowledged[org_uid] == false) {
                Vue.set(CI.IV_doghouse_acknowledged[org_uid],sys_uid, {});
            }

            if(obj_uid in CI.IV_doghouse_acknowledged[org_uid][sys_uid] == false) {
                Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid],obj_uid, {});
            }

            if(obj_atr_uid in CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid] == false) { 
                Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid],obj_atr_uid, {});
            }
            if(rule_uid in CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_atr_uid] == false) { 
                Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_atr_uid], rule_uid, {});
            }

            Vue.set(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_atr_uid], rule_uid, entry);
        }

        Vue.set(CI.IV_component_loading_states, 'c5_acknowledged_items', false);
        
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7DoghouseActiveListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7DoghouseActiveListener ";
        var task_id = "bi7_watchdog_firebase:bi7DoghouseActiveListener";
    
        ///// input validation
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /////</end> input validation

        var CI = this;
        var firebase_data = data.val()

        var active_entries = [];
        var entries_found_flag = false;
        var continue_flag = false;
        if (typeof(firebase_data) === 'string') {
            firebase_data = {'entry': firebase_data};
        }
        //// take the nested object and filter all un-needed entries, added the needed entries to a new list
        for( var key1 in firebase_data) {
            continue_flag = false;
            if (key1 === "deletion_prevention_key") { continue;}
            if (typeof(firebase_data[key1]) === 'string') {
              active_entries.push(firebase_data[key1]);
              entries_found_flag = true;
              continue_flag = true;
              continue;
            }
            for(var key2 in firebase_data[key1]) {
              if (key2 === "deletion_prevention_key") { continue;}
              if (typeof(firebase_data[key1][key2]) === 'string') {
                active_entries.push(firebase_data[key1][key2]);
                entries_found_flag = true;
                continue_flag = true;
                continue;
              }
              for(var key3 in firebase_data[key1][key2]) {
                if (key3 === "deletion_prevention_key") { continue;}
                if (typeof(firebase_data[key1][key2][key3]) === 'string') {
                    active_entries.push(firebase_data[key1][key2][key3]);
                    entries_found_flag = true;
                    continue_flag = true;
                    continue;
                  }
                
                for(var key4 in firebase_data[key1][key2][key3]) {
                  if (key4 === "deletion_prevention_key") { continue;}
                  if (typeof(firebase_data[key1][key2][key3][key4]) === 'string') {
                    active_entries.push(firebase_data[key1][key2][key3][key4]);
                    entries_found_flag = true;
                    continue_flag = true;
                    continue;
                    }
                  for(var key5 in firebase_data[key1][key2][key3][key4]) {
                    if (key5 === "deletion_prevention_key") { continue;}
                    if (typeof(firebase_data[key1][key2][key3][key4][key5]) === 'string') {
                        active_entries.push(firebase_data[key1][key2][key3][key4][key5]);
                        entries_found_flag = true;
                        continue_flag = true;
                        continue;
                    }
                    if(continue_flag === true) { continue;}
                  }
                  if(continue_flag === true) { continue;}
                }
                if(continue_flag === true) { continue;}
              }
              if(continue_flag === true) { continue;}
            }
            if(continue_flag === true) { continue;}
          }
        ////</end> take the nested object and filter all un-needed entries, added the needed entries to a new list
        
        if(entries_found_flag === false) {return;}

        var entry,org_uid,sys_uid,obj_uid,obj_atr_uid,rule_join_uid;
        for(var index1 in active_entries) {
            try {
                entry = JSON.parse(active_entries[index1])
                //legacy format for rule UIDs is the rule join uid
                if(entry['rule_uid'].indexOf("|") > -1) {
                  entry['rule_join_uid'] = entry['rule_uid']
                  entry['rule_uid'] = entry['rule_join_uid'].split('|')[1]
                } else {
                  entry['rule_join_uid'] = entry['obj_atr_uid'] + "|" + entry['rule_uid']
                }

                if (entry["tags"] === undefined || entry["tags"] === null) {
                  entry["tags"] = [];
                }
                
            } catch(error) {
                var error_msg = return_msg + "failed to JSOn parse firebase data with error:" + error;
                debug_data.push(active_entries[index1])
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, error_msg, debug_data);
                continue;
            }
            rule_join_uid = entry['rule_join_uid'];
            if(rule_join_uid in CI.IV_last_updated_timestamps['doghouse_active'] && 
            CI.IV_last_updated_timestamps['doghouse_active'][rule_join_uid] === entry['timestamp']) {
                continue;
            }
            org_uid = entry['org_uid'];
            sys_uid = entry['sys_uid'];
            obj_uid = entry['obj_uid'];
            obj_atr_uid = entry['obj_atr_uid'];
            if(org_uid in CI.IV_doghouse_active === false) {
                Vue.set(CI.IV_doghouse_active,org_uid, {});
            }
            this.bi7CreateDataStoreRequest('org_meta_data',org_uid,0)
            if(sys_uid in CI.IV_doghouse_active[org_uid] === false) {
                Vue.set(CI.IV_doghouse_active[org_uid],sys_uid, {});
            }
            this.bi7CreateDataStoreRequest('sys_meta_data',sys_uid,0)
            if(obj_uid in CI.IV_doghouse_active[org_uid][sys_uid] === false) {
                Vue.set(CI.IV_doghouse_active[org_uid][sys_uid],obj_uid, {});
            }
            this.bi7CreateDataStoreRequest('obj_meta_data',obj_uid,0)
            if(obj_atr_uid in CI.IV_doghouse_active[org_uid][sys_uid][obj_uid] === false) { 
                Vue.set(CI.IV_doghouse_active[org_uid][sys_uid][obj_uid],obj_atr_uid, {});
            }
            this.bi7CreateDataStoreRequest('obj_atr_meta_data',obj_atr_uid,0)

            if('delete' in entry === true) {
                CI.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/dog_house_active/' + org_uid + '/' + sys_uid + '/' + obj_uid + '/' + obj_atr_uid + '/' + entry['rule_uid'])
                CI.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/dog_house_ackowledged/' + org_uid + '/' + sys_uid + '/' + obj_uid + '/' + obj_atr_uid + '/' + entry['rule_uid'])
                if(entry['rule_uid'] in CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_atr_uid] === true) {
                    try {
                      Vue.delete(CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_atr_uid],entry['rule_uid']);
                      Vue.delete(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_atr_uid],entry['rule_uid']);
                    } catch (error){

                    }
                    CI.IV_last_updated_timestamps['doghouse_active'][rule_join_uid] = entry['timestamp'];
                }
            } else {
                Vue.set(CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_atr_uid], entry['rule_uid'],entry);
                CI.IV_last_updated_timestamps['doghouse_active'][rule_join_uid] = entry['timestamp']
            }
        }
    }


    bi7DoghouseHistoryListener(data,item_deleted=false) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7DoghouseHistoryListener ";
        var task_id = "bi7_watchdog_firebase:bi7DoghouseHistoryListener";

        ///// input validation
        if (data === null) {
            if(--CI.IV_doghouse_history_listeners_count === 0){
              Vue.set(CI.IV_component_loading_states, 'c5_doghouse_history', false);
            }
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /////</end> input validation

        var CI = this;
        var firebase_data = data.val()
        /// convert the nested object into a flat array since the data is json encoded we don't need the structure
        try {
            firebase_data  = bi6_misc.bi6FlattenObject(firebase_data)
        } catch(error) {
            if(--CI.IV_doghouse_history_listeners_count === 0){
              Vue.set(CI.IV_component_loading_states, 'c5_doghouse_history', false);
            }
            return_msg += "failed to create flatten firebase_data with error:" + JSON.stringify(error);
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.general_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///</end> convert the nested object into a flat array since the data is json encoded we don't need the structure

        var entry,org_uid,sys_uid,obj_uid,obj_atr_uid;
        for(var key in firebase_data) {
            if (firebase_data[key] === 'deletion_prevention_key') {
                continue;
            }
            try {
                entry = JSON.parse(firebase_data[key])
                //legacy format for rule UIDs is the rule join uid
                if(entry['rule_uid'].indexOf("|") > -1) {
                  entry['rule_join_uid'] = entry['rule_uid']
                  entry['rule_uid'] = entry['rule_join_uid'].split('|')[1]
                } else {
                  entry['rule_join_uid'] = entry['obj_atr_uid'] + "|" + entry['rule_uid']
                }

                if (entry["tags"] === undefined || entry["tags"] === null) {
                  entry["tags"] = [];
                }
            } catch(error) {
                var error_msg = return_msg + "failed to JSOn parse firebase data with error:" + error;
                debug_data.push(firebase_data[key])
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, error_msg, debug_data);
                continue;
            }
            
            org_uid = entry['org_uid'];
            sys_uid = entry['sys_uid'];
            obj_uid = entry['obj_uid'];
            obj_atr_uid = entry['obj_atr_uid'];
            if(org_uid in CI.IV_doghouse_history === false) {
                Vue.set(CI.IV_doghouse_history,org_uid, {});
            }
            this.bi7CreateDataStoreRequest('org_meta_data',org_uid)
            if(sys_uid in CI.IV_doghouse_history[org_uid] === false) {
                Vue.set(CI.IV_doghouse_history[org_uid],sys_uid, {});
            }
            this.bi7CreateDataStoreRequest('sys_meta_data',sys_uid)
            if(obj_uid in CI.IV_doghouse_history[org_uid][sys_uid] === false) {
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid],obj_uid, {});
            }
            this.bi7CreateDataStoreRequest('obj_meta_data',obj_uid)
            if(obj_atr_uid in CI.IV_doghouse_history[org_uid][sys_uid][obj_uid] === false) { 
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid][obj_uid],obj_atr_uid, {});
            }
            this.bi7CreateDataStoreRequest('obj_atr_meta_data',obj_atr_uid)
            if('delete' in entry) {
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid][obj_uid][obj_atr_uid], entry['timestamp'],null);
            } else {
                Vue.set(CI.IV_doghouse_history[org_uid][sys_uid][obj_uid][obj_atr_uid], entry['timestamp'], entry);
            }
        }
        if(--CI.IV_doghouse_history_listeners_count === 0){
          Vue.set(CI.IV_component_loading_states, 'c5_doghouse_history', false);
        }
    }


    bi7SubscribeSystemOnlineStatus(system_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7SubscribeSystemOnlineStatus ";
        var task_id = "bi7_watchdog_firebase:bi7SubscribeSystemOnlineStatus";

        ///// input validation
        call_result = bi1_data_validation.is_system_uid(system_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /////</end> input validation

        var CI = this;
         //// this tracks systems online status
         var system_online_attribute_uid = system_uid.replace('sys_','obj_atr_')
         //8 is a reserved UID for system online status
         system_online_attribute_uid += '-8'
         if (system_online_attribute_uid in CI.IV_object_attribute_values === false) {
             Vue.set(CI.IV_object_attribute_values, system_online_attribute_uid, {})
          }
        
        if (system_online_attribute_uid in CI.IV_object_attribute_rule_joins === false) {
            Vue.set(CI.IV_object_attribute_rule_joins, system_online_attribute_uid, {})
        }
        
        if (system_online_attribute_uid in CI.IV_listener_object_attribute_values === false) {
            CI.bi7initObjectAttributeValueListener(system_online_attribute_uid);
        }
    }

    bi7initRulesListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7initRulesListener ";
        var task_id = "bi7_watchdog_firebase:bi7initRulesListener";

        var CI = this;
        var listener_location = CI.IV_user_folder_path + '/notification_rules/';
        CI.IV_notification_rules_listener['rules'] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_notification_rules_listener['rules']);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_notification_rules_listener['rules'];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_notification_rules_listener['rules'].on("value",
            function (a_data) { CI.bi7RulesListener(a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    bi7RulesListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7RulesListener ";
        var task_id = "bi7_watchdog_firebase:bi7RulesListener";
        
        ///// input validation
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        var firebase_data = data.val();
        var entry;
        for( var key in firebase_data) {
            if(key === 'deletion_prevention_key') {
                continue;
            }
            entry = null;
            try {
                var entry = JSON.parse(firebase_data[key]);
            } catch(error) {
                return_msg += "failed to parse JSON data with error:" + error;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                return;
            }
            entry['uid'] = key;
            if ('delete' in entry) {
                Vue.delete(CI.IV_notification_rules,key);
                this.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/notification_rules/' + key);

            } else {
                Vue.set(CI.IV_notification_rules,key,entry);
            }
            
        }
    }

    
    bi7initNotificationRuleJoinsListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7initNotificationRuleJoinsListener ";
        var task_id = "bi7_watchdog_firebase:bi7initNotificationRuleJoinsListener";

        var CI = this;
        var listener_location = CI.IV_user_folder_path + '/notification_rule_joins/';
        CI.IV_notification_rule_joins_listener['entries'] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_notification_rule_joins_listener['entries']);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_notification_rule_joins_listener['entries'];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_notification_rule_joins_listener['entries'].on("value",
            function (a_data) { CI.bi7NotificationRuleJoinsListener(a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    bi7NotificationRuleJoinsListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7NotificationRuleJoinsListener ";
        var task_id = "bi7_watchdog_firebase:bi7NotificationRuleJoinsListener";
        
        ///// input validation
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        
        var CI = this;
        var firebase_data = data.val();
        var entry;
        for( var key in firebase_data) {
            if(key === 'deletion_prevention_key') {
                continue;
            }
            entry = null;
            try {
                var entry = JSON.parse(firebase_data[key]);
                entry['objectUid'] = 'obj_' + entry['object_uid'];
                entry['objectAttributeUid'] = 'obj_atr_' +  entry['object_uid'] + '-' + entry['attribute_uid']
                entry['uid'] = key;
            } catch(error) {
                return_msg += "failed to parse JSON data with error:" + error;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                continue;
            }
            
            if(key in CI.IV_last_updated_timestamps['notification_rule_joins'] && 
            CI.IV_last_updated_timestamps['notification_rule_joins'][key] === entry['last_updated']) {
                continue;
            }
            
            if ('delete' in entry) {
                Vue.delete(CI.IV_notification_rule_joins,key);
                Vue.delete(CI.IV_object_attribute_rule_joins[entry['objectAttributeUid']],entry['rule_uid']);
                this.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/notification_rule_joins/' + key);
            } else {
                if (entry['objectAttributeUid'] in CI.IV_object_attribute_rule_joins === false) {
                    Vue.set(CI.IV_object_attribute_rule_joins, entry['objectAttributeUid'], {})
                    }
                CI.IV_last_updated_timestamps['notification_rule_joins'][key] = entry['last_updated'];
                Vue.set(CI.IV_object_attribute_rule_joins[entry['objectAttributeUid']], entry['rule_uid'],entry)
                Vue.set(CI.IV_notification_rule_joins,key,entry);
            }
        }
    }

    bi7InitObjectAttributeParentSystemListener(object_uid,object_attribute_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitObjectAttributeParentSystemListener ";
        var task_id = "bi7_watchdog_firebase:bi7InitObjectAttributeParentSystemListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }
        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        //////</end> input validation 


        var CI = this;
        var listener_location = "objects/" + object_uid +  "/attribute_list/" + object_attribute_uid + '/processor_uid';
        CI.IV_listener_object_attribute_parent_system[object_attribute_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_object_attribute_parent_system[object_attribute_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_object_attribute_parent_system[object_attribute_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_object_attribute_parent_system[object_attribute_uid].on("value",
            function (a_data) { CI.bi7ObjectAttributeParentSystemListener(object_uid, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }
    
    bi7ObjectAttributeParentSystemListener(object_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7ObjectAttributeParentSystemListener ";
        var task_id = "bi7_watchdog_firebase:bi7ObjectAttributeParentSystemListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        Vue.set(CI.IV_system_object_joins_reverse_lookup,object_uid,firebase_data);
    }

    bi7GetObjectUidFromOjbectAttributeUid(object_attribute_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7GetObjectUidFromOjbectAttributeUid ";
        var task_id = "bi7_watchdog_firebase:bi7GetObjectUidFromOjbectAttributeUid";
        
        ///// input validation
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        /////</end> input validation

        var object_uid = '';
        var processsed_string;
        try {
            processsed_string = object_attribute_uid.replace('obj_atr_','obj_');
            processsed_string = processsed_string.split('-',1)[0]
        } catch(error) {
            return_msg += "failed to parse object attribute uid:" + error;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data,object_uid:object_uid };
        }

        
        call_result = bi1_data_validation.is_object_uid(processsed_string);
        debug_data.push(call_result)
        if (call_result['success'] !== RC.success) {
            return_msg += "created object_uid is not a valid object_uid. object_uid:" + JSON.stringify(processsed_string);
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data,object_uid:object_uid };
        }
        object_uid = processsed_string;
        return { success: RC.success, return_msg: return_msg, debug_data: debug_data,object_uid:object_uid };
        
    }

    bi7InitAccountNotificationsListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitAccountNotificationsListener ";
        var task_id = "bi7_watchdog_firebase:bi7InitAccountNotificationsListener";
        var CI = this;

        if (CI.IV_instance_initialized === false) {
            return_msg += 'instance is not initialized';
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        var listener_location = CI.IV_firebase_email_pointer.replace(/\./g,'-_-_-');
        listener_location = listener_location.replace('@','_-AT-_');
        listener_location = 'notifications/' + listener_location;
        CI.IV_listener_account_notifications['1'] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_account_notifications['1']);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_account_notifications['1'];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_account_notifications['1'].on("value",CI.bi7AccountNotificationsListener.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    bi7AccountNotificationsListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7AccountNotificationsListener ";
        var task_id = "bi7_watchdog_firebase:bi7AccountNotificationsListener";
        
        ////// input validation 
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation
        
        var CI = this;
        var firebase_data = data.val();

        for (var key in firebase_data) {
            //set the last updated timestamp for the permissions
            if(key === 'deletion_prevention_key') {
                continue;
            }
            entry = null;
            try {
                var entry = JSON.parse(firebase_data[key]);
            } catch(error) {
                return_msg += "failed to parse JSON data with error:" + error;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
                return;
            }
            
            if('delete' in entry) {
                Vue.delete(CI.IV_account_notificaitons,key);
            } else if(key in CI.IV_account_notificaitons === false) {
                Vue.set(CI.IV_account_notificaitons,key,entry);
            }
            
        }
    }

    
    bi7InitOrgUserPermissionsChangeListener(org_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitOrgUserPermissionsChangeListener ";
        var task_id = "bi7_watchdog_firebase:bi7InitOrgUserPermissionsChangeListener";

        ////// input validation 
        call_result = bi1_data_validation.is_org_uid(org_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        if (org_uid in CI.IV_org_users_permissions_last_updated === false) {
            Vue.set(CI.IV_org_users_permissions_last_updated,org_uid,{});
        }
        var listener_location = 'organization/' + org_uid + '/user_permissions';
        CI.IV_listener_org_user_permission_changes[org_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_org_user_permission_changes[org_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_org_user_permission_changes[org_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_org_user_permission_changes[org_uid].on("value",
            function (a_data) { CI.bi7OrgUserPermissionsChangeListener(org_uid, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    bi7OrgUserPermissionsChangeListener(org_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7OrgUserPermissionsChangeListener ";
        var task_id = "bi7_watchdog_firebase:bi7OrgUserPermissionsChangeListener";

        ////// input validation 
        call_result = bi1_data_validation.is_org_uid(org_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();

        for( var key in firebase_data) {
        if (key === "last_updated") {
            Vue.set(CI.IV_org_users_permissions_last_updated[org_uid],'last_updated',firebase_data[key]);
        }
    }
       
    }

    bi7RemoveOrgUserPermissionsChangeListener(org_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7RemoveOrgUserPermissionsChangeListener ";
        var task_id = "bi7_watchdog_firebase:bi7RemoveOrgUserPermissionsChangeListener";

        ////// input validation 
        call_result = bi1_data_validation.is_org_uid(org_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 

        var CI = this;
        try {
            CI.IV_listener_org_user_permission_changes[org_uid].off();
            CI.IV_listener_org_user_permission_changes[org_uid] = null;
            delete CI.IV_listener_org_user_permission_changes[org_uid];
            Vue.delete(CI.IV_org_users_permissions_last_updated,org_uid);
        } catch(error) {
            return_msg += 'failed to remove listener with error:' + JSON.stringify(error);
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            CI.IV_listener_org_user_permission_changes[org_uid] = null;
            delete CI.IV_listener_org_user_permission_changes[org_uid];
            return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        
    }


    bi7DeleteFirebaseLocation(folder) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7DeleteFirebaseLocation ";
        var task_id = "bi7_watchdog_firebase:bi7DeleteFirebaseLocation";
        var CI = this;
        if (CI.IV_instance_initialized === false) {
            return_msg += 'instance is not initialized';
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        var listener = CI.IV_firebase_db_object.ref(folder);
        if (listener === null) {
            return_msg += "failed to create listener for " + folder;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        listener.remove(function (errorObject) {
                if(errorObject === null) { return; }
                    return_msg += "firebase delete of '" + folder +"' failed with error data:" + errorObject;
                    base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
        
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7ClearDoghouseActiveEntry(rule_uid,rule_join_uid,org_uid,system_uid,object_uid,object_attribute_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7ClearDoghouseActiveEntry ";
        var task_id = "bi7_watchdog_firebase:bi7ClearDoghouseActiveEntry";
        var CI = this;
        if (CI.IV_instance_initialized === false) {
            return_msg += 'instance is not initialized';
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        //////// input validation
        if(org_uid !== null && org_uid !== undefined) {
            call_result = bi1_data_validation.is_org_uid(org_uid);
            debug_data.push(call_result);
        } 
        if(system_uid !== null && system_uid !== undefined) {
            call_result = bi1_data_validation.is_system_uid(system_uid);
            debug_data.push(call_result);
        }
        if(object_uid !== null && object_uid !== undefined) {
            call_result = bi1_data_validation.is_object_uid(object_uid);
            debug_data.push(call_result);
        } 
        if(object_attribute_uid !== null && object_attribute_uid !== undefined) {
            call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
            debug_data.push(call_result);
        }

        call_result = bi1_data_validation.is_string(rule_join_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(rule_uid);
        debug_data.push(call_result);
        

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }
        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////// </end> input validation

        CI.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/dog_house_active/' + org_uid + '/' + system_uid + '/' + object_uid + '/' + object_attribute_uid + '/' + rule_uid)
        CI.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/dog_house_ackowledged/' + org_uid + '/' + system_uid + '/' + object_uid + '/' + object_attribute_uid + '/' + rule_uid)
        try {
          Vue.delete(CI.IV_doghouse_active[org_uid][system_uid][object_uid][object_attribute_uid],rule_uid);
          Vue.delete(CI.IV_doghouse_acknowledged[org_uid][system_uid][object_uid][object_attribute_uid],rule_uid);
        } catch (error) {
          console.log(error);
        }
        
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7AcknowledgeDoghouseActiveEntry(rule_uid,rule_join_uid,org_uid,system_uid,object_uid,object_attribute_uid,value) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7AcknowledgeDoghouseActiveEntry ";
        var task_id = "bi7_watchdog_firebase:bi7AcknowledgeDoghouseActiveEntry";
        var CI = this;

        //////// input validation
        if(org_uid != null) {
            call_result = bi1_data_validation.is_org_uid(org_uid);
            debug_data.push(call_result);
        } 
        if(system_uid != null) {
            call_result = bi1_data_validation.is_system_uid(system_uid);
            debug_data.push(call_result);
        }
        if(object_uid != null) {
            call_result = bi1_data_validation.is_object_uid(object_uid);
            debug_data.push(call_result);
        } 
        if(object_attribute_uid != null) {
            call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
            debug_data.push(call_result);
        }

        call_result = bi1_data_validation.is_string(rule_join_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(rule_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(value);
        debug_data.push(call_result);

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] != RC.success) {
                validation_failed = true;
            }
        }

        if(validation_failed == true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////// </end> input validation

        var folder = CI.IV_user_folder_path + '/dog_house_ackowledged/' + org_uid + '/' + system_uid + '/' + object_uid + '/' + object_attribute_uid  + '/' + rule_uid;

        var reference = CI.IV_firebase_db_object.ref(folder);
        if (reference == null) {
          return_msg += "failed to create reference for " + folder;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        var timestamp = Math.ceil(new Date().getTime() / 1000);
        var data = {
          rule_uid: rule_join_uid, 
          org_uid: org_uid, 
          obj_atr_uid: object_attribute_uid, 
          sys_uid: system_uid, 
          obj_uid: object_uid,
          value: value
        }

        reference.child(timestamp).set(JSON.stringify(data), function(error) {
          if (error) {
            return_msg += "firebase write failed with error data:" + error;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          } else {
            return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
          }
        });

        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7MoveAcknowledgedItemToActiveAlert(rule_uid,rule_join_uid,org_uid,system_uid,object_uid,object_attribute_uid) {
      var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7AcknowledgeDoghouseActiveEntry ";
        var task_id = "bi7_watchdog_firebase:bi7AcknowledgeDoghouseActiveEntry";
        var CI = this;

        //////// input validation
        if(org_uid != null) {
            call_result = bi1_data_validation.is_org_uid(org_uid);
            debug_data.push(call_result);
        } 
        if(system_uid != null) {
            call_result = bi1_data_validation.is_system_uid(system_uid);
            debug_data.push(call_result);
        }
        if(object_uid != null) {
            call_result = bi1_data_validation.is_object_uid(object_uid);
            debug_data.push(call_result);
        } 
        if(object_attribute_uid != null) {
            call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
            debug_data.push(call_result);
        }

        call_result = bi1_data_validation.is_string(rule_join_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(rule_uid);
        debug_data.push(call_result);

        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] != RC.success) {
                validation_failed = true;
            }
        }

        if(validation_failed == true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        /////// </end> input validation

        CI.bi7DeleteFirebaseLocation(CI.IV_user_folder_path + '/dog_house_ackowledged/' + org_uid + '/' + system_uid + '/' + object_uid + '/' + object_attribute_uid + '/' + rule_uid);
        Vue.delete(CI.IV_doghouse_acknowledged[org_uid][system_uid][object_uid][object_attribute_uid],rule_uid);
        
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7initObjectAttributeCommandHistoryListener(object_attribute_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7initObjectAttributeCommandHistoryListener ";
        var task_id = "bi7_watchdog_firebase:bi7initObjectAttributeCommandHistoryListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        if (object_attribute_uid in CI.IV_object_attributes_command_history === false) {
            Vue.set(CI.IV_object_attributes_command_history,object_attribute_uid,{});
        }
        var listener_location = 'command_history_obj_atr/' + object_attribute_uid + '/';
        CI.IV_listener_object_attribute_command_history[object_attribute_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_object_attribute_command_history[object_attribute_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_object_attribute_command_history[object_attribute_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_object_attribute_command_history[object_attribute_uid].on("value",
            function (a_data) { CI.bi7ObjectAttributeCommandHistoryListener(object_attribute_uid, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    bi7ObjectAttributeCommandHistoryListener(object_attribute_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7ObjectAttributeCommandHistoryListener ";
        var task_id = "bi7_watchdog_firebase:bi7ObjectAttributeCommandHistoryListener";

        ////// input validation 
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;
        var firebase_data = data.val();
        var entry;

        for(var year in firebase_data) {
            if (firebase_data[year] === 'deletion_prevention_key') {
                continue;
            }
            var entry_preparse = '';
            for(var month in firebase_data[year]) {
                for(var date in firebase_data[year][month]) {
                    for(var timestamp in firebase_data[year][month][date]) {
                        try {
                            entry_preparse = firebase_data[year][month][date][timestamp];
                            entry = JSON.parse(firebase_data[year][month][date][timestamp])
                        } catch(error) {
                            var error_msg = return_msg + "failed to JSOn parse firebase data with error:" + error;
                            debug_data.push(firebase_data[year][month][date])
                            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, error_msg, debug_data);
                            continue;
                        }
                        entry['human_timestamp'] = bi6_misc.bi6UtcToLocalTime(entry['timestamp']);
                        Vue.set(CI.IV_object_attributes_command_history[object_attribute_uid],entry['timestamp'],entry);
                    }
                }
            }
            
        }

    }

    bi7RequestUserEmail(user_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7RequestUserEmail ";
        var task_id = "bi7_watchdog_firebase:bi7RequestUserEmail";

        ////// input validation 
        call_result = bi1_data_validation.is_user_uid(user_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        var CI = this;

        if (user_uid in CI.IV_users_contact_email === false) {
            Vue.set(CI.IV_users_contact_email,user_uid,'');
            CI.bi7CreateDataStoreRequest('usr_contact_email',user_uid,null);
        }
    }
    
    bi7InitObjectAttributeHistoryListener(object_attribute_uid,transcation_id,start_timestamp,end_timestamp) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitObjectAttributeHistoryListener ";
        var task_id = "bi7_watchdog_firebase:bi7InitObjectAttributeHistoryListener";

        ////// input validation 
        call_result = bi1_data_validation.is_string(transcation_id);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        
        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }

        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }
        //////</end> input validation 

        var CI = this;
        var listener_location = 'v2_history_obj_atr/history_' + object_attribute_uid + '/';
        if(object_attribute_uid in CI.IV_object_attribute_history_values === false) {
            CI.IV_object_attribute_history_values[object_attribute_uid] = [];
        }

        //if we already have a listener active, complete the transcation
        if(object_attribute_uid in CI.IV_listener_object_attribute_history_values &&
            CI.IV_listener_object_attribute_history_values[object_attribute_uid] !== null &&
            CI.IV_listener_object_attribute_history_values[object_attribute_uid] !== undefined
          ) {
            CI.IV_active_transcations[transcation_id] = false;
            Vue.set(CI.IV_vue_transcations,transcation_id,true);
            return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        CI.IV_active_transcations[transcation_id] = true;
        Vue.set(CI.IV_vue_transcations,transcation_id,false);
        CI.IV_listener_object_attribute_history_values[object_attribute_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_object_attribute_history_values[object_attribute_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_object_attribute_history_values[object_attribute_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_object_attribute_history_values[object_attribute_uid].on("value",
            function (a_data) { CI.bi7ObjectAttributeHistoryListener(object_attribute_uid,transcation_id, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    bi7ObjectAttributeHistoryListener(object_attribute_uid,transcation_id, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7ObjectAttributeHistoryListener ";
        var task_id = "bi7_watchdog_firebase:bi7ObjectAttributeHistoryListener";

        ////// input validation 
        call_result = bi1_data_validation.is_string(transcation_id);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        var validation_failed = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed = true;
            }
        }
        if(validation_failed === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return;
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        //////</end> input validation 
        
        var CI = this;
        var firebase_data = data.val();
        if(firebase_data === null) {return;}

        /// create the flag to track the newest value we have already read
        if (object_attribute_uid in CI.IV_object_attribute_history_last_time === false) {
            CI.IV_object_attribute_history_last_time[object_attribute_uid] = 0;
        }

        for(var year in firebase_data) {
            for(var month in firebase_data[year]) {
                for(var day in firebase_data[year][month]) {
                    for(var timestamp in firebase_data[year][month][day]) {
                        var vue_timestamp = 0;
                        try {
                            vue_timestamp  = timestamp * 1000;              
                                                                            
                        } catch (error) {
                            var error_msg = 'failed to get timestamp for history data with exception';
                            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, error_msg, error);
                            continue;
                        }
                        //this prevents adding the same data twice since
                        if(vue_timestamp <= CI.IV_object_attribute_history_last_time[object_attribute_uid]) {
                            continue;
                        } else {                        
                            CI.IV_object_attribute_history_last_time[object_attribute_uid] = vue_timestamp;
                        }
                        var entry_object = {};
                        entry_object.date = vue_timestamp;
                        entry_object.value = firebase_data[year][month][day][timestamp];
                        CI.IV_object_attribute_history_values[object_attribute_uid].push(entry_object);
                    }
                }
            }
        }
        CI.IV_active_transcations[transcation_id] = false;
        Vue.set(CI.IV_vue_transcations,transcation_id, true);
    }

    updateLastJoinListenerStartTime() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:updateLastJoinListenerStartTime ";
      var task_id = "bi7_watchdog_firebase:updateLastJoinListenerStartTime";
      var CI = this;
      
      var date_object = new Date();
      CI.IV_last_join_listener_started_time = date_object.getTime()  / 1000;
    }

    updateLastJoinDataChanged() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:updateLastJoinDataChanged ";
      var task_id = "bi7_watchdog_firebase:updateLastJoinDataChanged";
      var CI = this;
      
      var date_object = new Date();
      CI.IV_last_join_data_change = date_object.getTime()  / 1000; 
    }

    validateFirebaseListener(listener_object) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:validateFirebaseListener ";
      var task_id = "bi7_watchdog_firebase:validateFirebaseListener";
      var CI = this;

      try {
        call_result = bi1_data_validation.is_string(listener_object['database']['app']['options_']['apiKey']);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(listener_object['key']);
        debug_data.push(call_result);
      } catch (err) {
        return_msg += "object is not a valid firebase listener, errors:" + JSON.stringify(err.message);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }

      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] !== RC.success) {
          validation_failed = true;
        }
      }
      if(validation_failed === true) {
        return_msg += "object is not a valid firebase listener";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7LogClearDoghouseActiveEntry(rule_uid, rule_join_uid, org_uid, system_uid, object_uid, object_attribute_uid, tags) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7ClearDoghouseActiveEntry ";
      var task_id = "bi7_watchdog_firebase:bi7ClearDoghouseActiveEntry";
      var CI = this;

      if (CI.IV_instance_initialized === false) {
        return_msg += 'instance is not initialized';
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }

      //////// input validation
      if(org_uid !== null && org_uid !== undefined) {
        call_result = bi1_data_validation.is_org_uid(org_uid);
        debug_data.push(call_result);
      } 
      if(system_uid !== null && system_uid !== undefined) {
        call_result = bi1_data_validation.is_system_uid(system_uid);
        debug_data.push(call_result);
      }
      if(object_uid !== null && object_uid !== undefined) {
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
      } 
      if(object_attribute_uid !== null && object_attribute_uid !== undefined) {
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
      }

      call_result = bi1_data_validation.is_string(rule_join_uid);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_string(rule_uid);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_array(tags);
      debug_data.push(call_result);


      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] !== RC.success) {
          validation_failed = true;
        }
      }
      if (validation_failed === true) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      /////// </end> input validation

      var folder = CI.IV_user_folder_path + '/dog_house_history/' + org_uid + '/' + system_uid + '/' + object_uid + '/' + object_attribute_uid + '/' + rule_uid;

      var reference = CI.IV_firebase_db_object.ref(folder);
      if (reference === null) {
        return_msg += "failed to create reference for " + folder;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
      }

      var timestamp = Math.ceil(new Date().getTime() / 1000);
      var data = {
        timestamp: timestamp.toString(), 
        entry_type: "MANUAL", 
        rule_uid: rule_join_uid, 
        value: "Manually Cleared", 
        org_uid: org_uid, 
        obj_atr_uid: object_attribute_uid, 
        sys_uid: system_uid, 
        obj_uid: object_uid,
        tags: tags
      }

      reference.child(timestamp).set(JSON.stringify(data), function(error) {
        if (error) {
          return_msg += "firebase write failed with error data:" + error;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        } else {
          Vue.delete(CI.IV_doghouse_active[org_uid][system_uid][object_uid][object_attribute_uid],rule_uid);
          return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }
      });
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }


    bi7UpdateCachedJoinData() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7UpdateCachedJoinData ";
      var task_id = "bi7_watchdog_firebase:bi7UpdateCachedJoinData";
      var CI = this;

      var date_object = new Date();
      var time_now = date_object.getTime() / 1000;
      //if a system is deleted the organization structure has to be rebuilt
      var systems_deleted_flag = false;
      //// resetting the lockout if lockout time is greater than 40 secs
      if (time_now - CI.IV_last_update_cached_join_data_run_time > 40) {
        CI.IV_save_join_data_to_cache_lockout = false;
      }
      // preventing if another insance is already running.
      if (CI.IV_save_join_data_to_cache_lockout === true) {
        return;
      } else {
        // acquiring lock.
        CI.IV_save_join_data_to_cache_lockout = true;
      }

      // return if last join listener started in last 10 seconds
      if(time_now - CI.IV_last_join_listener_started_time < 10) {
        CI.IV_save_join_data_to_cache_lockout = false;
        return;
      }

      
       ////// removing old data from localStorage
      
      // /// remove old system org associations              
      // var system_remove_list = [];
      // for(var sys_uid in CI.IV_system_org_joins) {
      //     if(sys_uid === 'last_updated') {continue;}
      //   if( sys_uid in CI.IV_system_live_uids === false) { 
      //       system_remove_list.push(sys_uid);
      //     }
      // }
      // for(var index in system_remove_list) {
      //   var sys_uid = system_remove_list[index];
      //   var org_uid = CI.IV_system_org_joins[sys_uid];
      //   localStorage.removeItem('org_sys_join-' + org_uid);
      //   Vue.delete(CI.IV_system_org_joins,sys_uid);
      //   Vue.delete(CI.IV_org_system_joins[org_uid],sys_uid);
      //   if(systems_deleted_flag !== true) { systems_deleted_flag = true;}
      // }
      // ///</end> remove old system org associations

      /// remove old system object associations
      let object_remove_list = [];
      for (let object_uid in CI.IV_system_object_joins_reverse_lookup) {
        let system_uid = CI.IV_system_object_joins_reverse_lookup[object_uid];

        // an object whose system exist in the listeners means we are getting live data for system
        // But object_uid that has no listener for its meta data means:
        // its an object that has been deleted in firebase but is still in cache.
        if (system_uid in CI.IV_listener_system_all_object_and_attributes_joins === true &&
          object_uid in CI.IV_object_live_uids === false) { 
          object_remove_list.push(object_uid);
        }
      }

      // We'll remove all those object's data that has been deleted in firebase but is still in cache.
      for (let obj_index in object_remove_list) {
        let object_uid = object_remove_list[obj_index];
        let system_uid = CI.IV_system_object_joins_reverse_lookup[object_uid];

        localStorage.removeItem('obj_atr_join-' + object_uid);
        Vue.delete(CI.IV_system_object_joins[system_uid], object_uid, object_uid);
        Vue.delete(CI.IV_system_object_joins_reverse_lookup, object_uid);
      }
      ///</end> remove old system object associations

      /// remove old object attribute associations
      let attribute_remove_list = [];
      for (let attribute_uid in CI.IV_object_attribute_joins_reverse_lookup) {
        let object_uid = CI.IV_object_attribute_joins_reverse_lookup[attribute_uid];
        let system_uid = CI.IV_system_object_joins_reverse_lookup[object_uid];

        // an attribute whose object exist in its system's listeners means we are getting live data for it's system.
        // But attribute that is no listener for its meta data means:
        // its an attribute that has been deleted in firebase but is still in cache.
        if (system_uid in CI.IV_listener_system_all_object_and_attributes_joins === true && 
          attribute_uid in CI.IV_object_attribute_live_uids === false) { 
          attribute_remove_list.push(attribute_uid);
        }
      }

      // We'll remove all those object's data that has been deleted in firebase but is still in cache/dictionaries.
      for (let atr_index in attribute_remove_list) {
        let attr_id = attribute_remove_list[atr_index];
        let object_uid = CI.IV_object_attribute_joins_reverse_lookup[attribute_uid];

        localStorage.removeItem('obj_atr_join-' + object_uid);
        Vue.delete(CI.IV_object_attribute_joins[object_uid], attr_id, attr_id);
        Vue.delete(CI.IV_object_attribute_joins_reverse_lookup, attr_id);
      }
      
      ///</end> remove old object attribute associations

      //////</end> removing old data from localStorage

      
      //// saving data to localStorage
      // for (var org_uid in CI.IV_listener_org_system_joins) {
      //   if (org_uid.indexOf('org_') === 0) {
      //     var data_dict = {
      //       last_updated: time_now,
      //       value: CI.IV_org_system_joins[org_uid]
      //     }

      //     ///// caching data to localstorage only when data updated
      //     var cached_value = localStorage.getItem('org_sys_join-' + org_uid)
      //     if (cached_value !== null) {
      //       var cached_data = JSON.parse(cached_value)["value"];
      //       // only set if value is updated or not present in cache
      //       if (JSON.stringify(cached_data) !== JSON.stringify(data_dict["value"])) {
      //         localStorage.setItem('org_sys_join-' + org_uid, JSON.stringify(data_dict));
      //       }
      //     } else {
      //       localStorage.setItem('org_sys_join-' + org_uid, JSON.stringify(data_dict));
      //     }
      //     /////</end> caching data to localstorage only when data updated
      //   }
      // }

      for (var sys_uid in CI.IV_listener_system_all_object_and_attributes_joins) {
        if (sys_uid.indexOf('sys_') === 0) {
          var data_dict = {
            last_updated: time_now,
            value: CI.IV_system_object_joins[sys_uid]
          }

          ///// caching data to localstorage only when data updated
          var cached_value = localStorage.getItem('sys_obj_join-' + sys_uid)
          if (cached_value !== null && cached_value !== undefined) {
            var cached_data = JSON.parse(cached_value)["value"];
            // only set if value is updated or not present in cache
            if (JSON.stringify(cached_data) !== JSON.stringify(data_dict["value"])) {
              localStorage.setItem('sys_obj_join-' + sys_uid, JSON.stringify(data_dict));
            }
          } else {
            localStorage.setItem('sys_obj_join-' + sys_uid, JSON.stringify(data_dict));
          }
          /////</end> caching data to localstorage only when data updated
        }

        for (var obj_uid in CI.IV_system_object_joins[sys_uid]) {
          if (obj_uid.indexOf('obj_') === 0) {
            var data_dict = {
              last_updated: time_now,
              value: CI.IV_object_attribute_joins[obj_uid]
            }
            ///// caching data to localstorage only when data updated
            var cached_value = localStorage.getItem('obj_atr_join-' + obj_uid)
            if (cached_value !== null && cached_value !== undefined) {
              var cached_data = JSON.parse(cached_value)["value"];
              // only set if value is updated or not present in cache
              if (JSON.stringify(cached_data) !== JSON.stringify(data_dict["value"])) {
                localStorage.setItem('obj_atr_join-' + obj_uid, JSON.stringify(data_dict));
              }
            } else {
              localStorage.setItem('obj_atr_join-' + obj_uid, JSON.stringify(data_dict));
            }
            /////</end> caching data to localstorage only when data updated
          }
        }
      }
      ////</end> saving data to localStorage

      CI.IV_last_update_cached_join_data_run_time = date_object.getTime() / 1000;
      
      
      //this forces the organization system tree view data to refresh so the user sees a deleted system go away
      if(systems_deleted_flag === true) {
        CI.IV_last_updated_timestamps['presets']['all_preset'] =  CI.IV_last_update_cached_join_data_run_time;
      }
      // releasing lock.
      CI.IV_save_join_data_to_cache_lockout = false;
      return;
    }

    bi7LoadCachedJoinData(type=null, uid=null) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7LoadCachedJoinData ";
      var task_id = "bi7_watchdog_firebase:bi7LoadCachedJoinData";
      var CI = this;

      //// input validation
      call_result = bi1_data_validation.is_string(type);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_string(uid);
      debug_data.push(call_result);

      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] !== RC.success) {
          validation_failed = true;
        }
      }

      if (validation_failed === false &&
          // type.indexOf("org_sys_join-") !== 0 &&
          type.indexOf("sys_obj_join-") !== 0 &&
          type.indexOf("obj_atr_join-") !== 0) {
        return_msg += "type argument is invalid";
        validation_failed = true;
      }

      if (validation_failed === true) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      //// </end> input validation

      var cached_value = localStorage.getItem(type + uid);
      var json_data = JSON.parse(cached_value);
      var data = null;
      if (json_data) {
        data = json_data["value"]
      }
      
      switch(type) {
        // case 'org_sys_join-':
        // if (data && Object.keys(data).length > 0) {
        //     for (var key in data) {
        //       if (key in CI.IV_org_system_joins[uid] === false) {
        //         Vue.set(CI.IV_org_system_joins[uid],key,key);
        //         Vue.set(CI.IV_system_org_joins,key,uid)
        //       }
        //     }
        // }
        // break;

        case 'sys_obj_join-':
        if (data && Object.keys(data).length > 0) {
          for (var key in data) {
            if (key in CI.IV_system_object_joins[uid] === false || CI.IV_system_object_joins[uid][key] !== key) {
              Vue.set(CI.IV_system_object_joins[uid],key,key);
              Vue.set(CI.IV_system_object_joins_reverse_lookup,key,uid);

              // It will load object attributes joins data as well 
              // because now we are not listening objec attribute join separately.
              if (key in CI.IV_object_attribute_joins === false) {
                CI.IV_object_attribute_joins[key] = {};
              }
              CI.bi7LoadCachedJoinData('obj_atr_join-', key);
            }
          }
        }
        break;

        case 'obj_atr_join-':
        if (data && Object.keys(data).length > 0) {
          for (var key in data) {
            if (key in CI.IV_object_attribute_joins[uid] === false) {
              Vue.set(CI.IV_object_attribute_joins[uid],key,key);
              Vue.set(CI.IV_object_attribute_joins_reverse_lookup,key,uid);
            }
          }
        }
        break;
      }
      
      return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    bi7UnsubscribeSpecificListener(listener_type, uid, component_id) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7UnsubscribeSpecificListener ";
      var task_id = "bi7_watchdog_firebase:bi7UnsubscribeSpecificListener";
      var CI = this;

      ///// input validation
      call_result = bi1_data_validation.is_string(listener_type);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_string(uid);
      debug_data.push(call_result);

      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] !== RC.success) {
          validation_failed = true;
        }
      }

      if (!validation_failed && !Object.keys(this.IV_firebase_listeners_lookup).includes(listener_type)) {
        validation_failed = true;
        return_msg += "listener type agrument is invalid";
      }

      if(validation_failed === true) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      /////</end> input validation

      // new listener_key_id will generate component specific listeners key.
      var listener_key_id = uid;
      if (component_id !== null && component_id !== undefined) {
        listener_key_id = component_id+"_"+uid
      }

      ///// unsubscribe logic
      if (eval("CI." + CI.IV_firebase_listeners_lookup[listener_type])[listener_key_id]) {
        var specific_firebase_listener = eval("CI." + CI.IV_firebase_listeners_lookup[listener_type]);
        try {
          specific_firebase_listener[listener_key_id].off();
          specific_firebase_listener[listener_key_id] = null;
          delete specific_firebase_listener[listener_key_id];
        } catch(error) {
          debug_data.push(JSON.stringify(error))
          return_msg += `failed to turn ${CI.IV_firebase_listeners_lookup[listener_type]} listener off for uid: ${listener_key_id}`;
          specific_firebase_listener[listener_key_id] = null;
          delete specific_firebase_listener[listener_key_id];
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
      }
      /////</end> unsubscribe logic

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7StopDoghouseHistoryListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7StopDoghouseHistoryListener ";
        var task_id = "bi7_watchdog_firebase:bi7StopDoghouseHistoryListener";
        var CI = this;

        ///// unsubscribe logic
        for (var key in CI.IV_listener_doghouse_history) {
            try {
              CI.IV_listener_doghouse_history[key].off();
              CI.IV_listener_doghouse_history[key] = null;
              delete CI.IV_listener_doghouse_history[key];
            } catch(error) {
              debug_data.push(JSON.stringify(error))
              return_msg += `failed to turn ${CI.IV_listener_doghouse_history[key]} listener off.`;
              CI.IV_listener_doghouse_history[key] = null;
              delete CI.IV_listener_doghouse_history[key];
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
              return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
            }
            
        }
            
        /////</end> unsubscribe logic
        return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7StopDoghouseAcknowledgedListener() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7StopDoghouseAcknowledgedListener ";
      var task_id = "bi7_watchdog_firebase:bi7StopDoghouseAcknowledgedListener";
      var CI = this;

      ///// unsubscribe logic
      for (var key in CI.IV_listener_doghouse_acknowledge) {
          try {
            CI.IV_listener_doghouse_acknowledge[key].off();
            CI.IV_listener_doghouse_acknowledge[key] = null;
            delete CI.IV_listener_doghouse_acknowledge[key];
          } catch(error) {
            debug_data.push(JSON.stringify(error))
            return_msg += `failed to turn ${CI.IV_listener_doghouse_acknowledge[key]} listener off.`;
            CI.IV_listener_doghouse_acknowledge[key] = null;
            delete CI.IV_listener_doghouse_acknowledge[key];
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
          }
          
      }
          
      /////</end> unsubscribe logic
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7UnsubscribeSystemMonitoring(system_uid) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7UnsubscribeSystemMonitoring ";
      var task_id = "bi7_watchdog_firebase:bi7UnsubscribeSystemMonitoring";
      var CI = this;

      ///// input validation
      call_result = bi1_data_validation.is_system_uid(system_uid);
      debug_data.push(call_result);
      if (call_result[CR.success] !== RC.success) {
          return_msg += "input validation failed";
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      /////</end> input validation

      ///// unsubscribing main system listener
      try {
          CI.IV_listener_system_all_object_and_attributes_joins[system_uid].off();
          CI.IV_listener_system_all_object_and_attributes_joins[system_uid] = null;
          delete CI.IV_listener_system_all_object_and_attributes_joins[system_uid];
      } catch(error) {
          debug_data.push(JSON.stringify(error))
          return_msg += `failed to turn listener_system_all_object_and_attributes_joins listener off for uid: ${system_uid}`;
          CI.IV_listener_system_all_object_and_attributes_joins[system_uid] = null;
          delete CI.IV_listener_system_all_object_and_attributes_joins[system_uid];
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
      }
      /////</end> unsubscribing main system listener

      if (system_uid in CI.IV_system_object_joins === true) {
          for (let obj_uid in CI.IV_system_object_joins[system_uid]) {
            if (obj_uid in CI.IV_listener_object_meta_data === true) {
              CI.bi7UnsubscribeSpecificListener('object_meta_data', obj_uid) 
            }
          }
      }

      for (let objec_uid in CI.IV_deleted_object_uids) {
        Vue.delete(CI.IV_deleted_object_uids, objec_uid);
      }
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7InitReportingListenersAndDownloadCSVData(org_uid, sys_uid=null, time_range, history_flag=true, current_flag=false, filters={}) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7InitReportingListenersAndDownloadCSVData ";
      var task_id = "bi7_watchdog_firebase:bi7InitReportingListenersAndDownloadCSVData";
      var CI = this;
      var sys_obj_and_attribute_joins_promises = []
      var attr_history_promises = []
      var attr_current_value_promises = []
      const history_values_flag = history_flag;
      const current_values_flag = current_flag;
      const required_filters = filters;
      var objects_count = 0;
      var attributes_count = 0;

      // Setting loading to true before starting listeners and data preparation. 
      Vue.set(CI.IV_component_loading_states, 'c2m9_c2m10_OrgReporting', true);
      Vue.set(CI.IV_items_count_for_csv_report, 'objects', 0);
      Vue.set(CI.IV_items_count_for_csv_report, 'attributes', 0);

      /// input validation
      call_result = bi1_data_validation.is_org_uid(org_uid);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_array(time_range, 2, 2);
      debug_data.push(call_result);

      if (sys_uid !== null && sys_uid !== undefined) {
        call_result = bi1_data_validation.is_system_uid(sys_uid);
        debug_data.push(call_result);
      }

      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] !== RC.success) {
          validation_failed = true;
        }
      }

      if (validation_failed === true) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      ///</end> input validation

      // making callback function for firebase failure
      var firebase_failure = function (errorObject) {
          return_msg += "firebase read failed with error data:" + errorObject;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(this)

      /// callback functions to start listeners and push promises to promises array
      var init_system_objects_and_attributes_join_listeners = function (uid) {
        var listener_location = 'systems/' + uid;
        var listener_ref = CI.IV_firebase_db_object.ref(listener_location);

        return listener_ref.once("value").then(
          function (a_data) {
            return [a_data.val(), uid];
          }.bind(CI),
          firebase_failure
        )
      }

      // we'll need this if we're creating CSV file for all attributes history data.
      var init_attribute_history_listeners = function (uid) {
        var listener_location = 'v2_history_obj_atr/history_' + uid + '/';
        var listener_ref = CI.IV_firebase_db_object.ref(listener_location);

        return listener_ref.once("value").then(
          function (a_data) {
            return [a_data.val(), uid];
          }.bind(CI),
          firebase_failure
        )
      }

      // we'll need this if we're creating CSV file for current values of all attribute with specific name.
      var init_attribute_current_value_listeners = function (uid) {
        var listener_location = 'newest_obj_atr_values/' + uid + '/';
        var listener_ref = CI.IV_firebase_db_object.ref(listener_location);

        return listener_ref.once("value").then(
          function (a_data) {
            return [a_data.val(), uid];
          }.bind(CI),
          firebase_failure
        )
      }
      ///</end> callback functions to start listeners and push promises to promises array

      /// checking if we are preparing data for a system or all systems under org.

      // if we get system id it means we are downloading data only for attributes under this system.
      if (sys_uid !== null && sys_uid !== undefined) {
        CI.IV_system_object_joins[sys_uid] = {};
        sys_obj_and_attribute_joins_promises.push(init_system_objects_and_attributes_join_listeners(sys_uid))

        // calling attribute histery listener for connected to watchdog for this system

        var connected_to_watchdog_uid = sys_uid.replace("sys_", "obj_atr_") + "-8"

        if (connected_to_watchdog_uid in CI.IV_object_attributes_meta_data === false) {
          CI.bi7objectAttributeMetaDataRequestForCSVData(connected_to_watchdog_uid);
        }
        if (history_values_flag === true) {
          CI.IV_object_attribute_history_values[connected_to_watchdog_uid] = [];
          attr_history_promises.push(init_attribute_history_listeners(connected_to_watchdog_uid));
        } else if (current_values_flag === true ) {
          if (connected_to_watchdog_uid in CI.IV_object_attribute_values === false) {
            CI.IV_object_attribute_values[connected_to_watchdog_uid] = {};
          }
          attr_current_value_promises.push(init_attribute_current_value_listeners(connected_to_watchdog_uid));
        }
        //</end> calling attribute histery listener for connected to watchdog for this system

      // if we are getting only org_id it means we are downloading data at the organization level.
      } else {

        /// starting listeners for all systems from nested sub orgs.
        var sub_orgs_ids_list = [];
        var search_string = org_uid + "org_";
        
        for (var key in CI.IV_org_location_strings) {
          if (CI.IV_org_location_strings[key].indexOf(search_string) >= 0) {
            sub_orgs_ids_list.push(key);
          }
        }

        sub_orgs_ids_list.push(org_uid);

        for (let index in sub_orgs_ids_list) {
          for (var system_id in CI.IV_org_system_joins[sub_orgs_ids_list[index]]) {
            if (system_id === "last_updated" || system_id === 'deletion_prevention_key') { continue; }

            CI.IV_system_object_joins[system_id] = {};
            sys_obj_and_attribute_joins_promises.push(init_system_objects_and_attributes_join_listeners(system_id))

            // calling attribute histery listener for connected to watchdog for this system
            var connected_to_watchdog_uid = system_id.replace("sys_", "obj_atr_") + "-8"

            if (connected_to_watchdog_uid in CI.IV_object_attributes_meta_data === false) {
              CI.bi7objectAttributeMetaDataRequestForCSVData(connected_to_watchdog_uid);
            }
            if (history_values_flag === true) {
              CI.IV_object_attribute_history_values[connected_to_watchdog_uid] = [];
              attr_history_promises.push(init_attribute_history_listeners(connected_to_watchdog_uid));
            } else if (current_values_flag === true ) {
              if (connected_to_watchdog_uid in CI.IV_object_attribute_values === false) {
                CI.IV_object_attribute_values[connected_to_watchdog_uid] = {};
              }
              attr_current_value_promises.push(init_attribute_current_value_listeners(connected_to_watchdog_uid));
            }
            //</end> calling attribute histery listener for connected to watchdog for this system
          }
        }
        ///<end> starting listeners for all systems from nested sub orgs.
      }
      ///</end> checking if we are preparing data for a system or all systems under org.

      /// calling all nested listener once for system's objects, object's attributes and attribute's history/current values.
      /// Then Calling bi7GetAttributesCsvDataStep1 to filter data on attribute's name/value and request necessory object's names.

      // It will wait until all sys_obj_and_attribute_joins_promises get completed.
      Promise.all(sys_obj_and_attribute_joins_promises).then((values) => {
        for (let index in values) {
          var system_data = values[index];
          //// data validation
          if (Array.isArray(system_data) === false || system_data.length < 2
          || system_data[0] === undefined || system_data[1] === undefined
           || system_data[0] === null || system_data[1] === null) {
             continue;
           }
           ////</end> data validation

          var system_uid = system_data[1];
          var system_object_uids = system_data[0]['object_uids'];
          var system_attribute_uids = system_data[0]['object_attributes'];

          //// Setting system object joins 
          if (system_object_uids !== null && system_object_uids !== undefined) {
            for (let obj_key in system_object_uids) {

              if (system_object_uids[obj_key][0] === 'd') {
                continue;
              }
              //ignore last updated entries, the system is technically an object but we don't list it with the objects under the system
              if (obj_key === "last_updated" || 
                  obj_key === 'deletion_prevention_key' ||
                  obj_key === system_uid.replace('sys_','obj_')
                  ) {
                continue;
              }

              if (obj_key in CI.IV_object_attribute_joins === false) {
                CI.IV_object_attribute_joins[obj_key] = {};
              }
              
              if (obj_key in CI.IV_system_object_joins[system_uid] === false || CI.IV_system_object_joins[system_uid][obj_key] !== obj_key) {
                CI.IV_system_object_joins[system_uid][obj_key] = obj_key;
                CI.IV_system_object_joins_reverse_lookup[obj_key] = system_uid;
              }

              objects_count += 1;
              Vue.set(CI.IV_items_count_for_csv_report, 'objects', objects_count);
            }
          }
          ////</end> Setting system object joins 

          //// Setting system object_attribute joins 
          if (system_attribute_uids !== null && system_attribute_uids !== undefined) {
            for (let attr_key in system_attribute_uids) {

              //ignore last updated entries
              if (attr_key === "last_updated" || attr_key === 'deletion_prevention_key') {
                continue;
              }

              var attribute_object_uid = "";
              try {
                attribute_object_uid = `obj_${CI.bi7ExtractNumbers(attr_key.split("-")[0])}`;
              } catch(error) {
                return_msg += "failed to JSOn parse firebase data with error:" + error;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
                continue;
              }

              // checking if the attribute belongs to any object under this system
              if (attribute_object_uid in CI.IV_object_attribute_joins === false) {
                continue;
              }
              //</end> checking if the attribute belongs to any object under this system

              if (attr_key in CI.IV_object_attribute_joins[attribute_object_uid] === false) {
                CI.IV_object_attribute_joins[attribute_object_uid][attr_key] = attr_key;
                CI.IV_object_attribute_joins_reverse_lookup[attr_key] = attribute_object_uid;
              }
              
              if (attr_key in CI.IV_object_attributes_meta_data === false) {
                CI.bi7objectAttributeMetaDataRequestForCSVData(attr_key);
              }


              if (history_values_flag === true) {
                CI.IV_object_attribute_history_values[attr_key] = [];
                attributes_count += 1;
                Vue.set(CI.IV_items_count_for_csv_report, 'attributes', attributes_count);
                attr_history_promises.push(init_attribute_history_listeners(attr_key));
              } else if (current_values_flag === true) {
                if (attr_key in CI.IV_object_attribute_values === false) {
                  attributes_count += 1;
                  Vue.set(CI.IV_items_count_for_csv_report, 'attributes', attributes_count);
                  CI.IV_object_attribute_values[attr_key] = {};
                }
                attr_current_value_promises.push(init_attribute_current_value_listeners(attr_key));
              }
            }
          }
          ////</end> Setting system object_attribute joins           
        }

        if (history_values_flag === true) {
          // It will wait until all attr_history_promises get completed.
          Promise.all(attr_history_promises).then((values) => {
            for (let index in values) {
              let value_data = values[index]

              for(var year in value_data[0]) {
                for(var month in value_data[0][year]) {
                  for(var day in value_data[0][year][month]) {
                    for(var timestamp in value_data[0][year][month][day]) {
                      var entry_object = {};
                      entry_object.date = timestamp * 1000;
                      entry_object.value = value_data[0][year][month][day][timestamp];
                      CI.IV_object_attribute_history_values[value_data[1]].push(entry_object);
                    }
                  }
                }
              }
            }
            CI.bi7GetAttributesCsvDataStep1(org_uid, sys_uid, time_range, history_values_flag, current_values_flag, required_filters)
          })
        } else {
          // It will wait until all attr_current_value_promises get completed.
          Promise.all(attr_current_value_promises).then((values) => {
            for (let index in values) {
              let value_data = values[index];
              if(value_data === null || value_data[0] === null) { continue; }
              if ('value' in value_data[0] !== undefined && 'value' in value_data[0] !== null) {
                CI.IV_object_attribute_values[value_data[1]]['value'] = value_data[0]['value'];
              } else {
                CI.IV_object_attribute_values[value_data[1]]['value'] = "";
              }

              if ('last_updated' in value_data[0] !== undefined && 'last_updated' in value_data[0] !== null) {
                CI.IV_object_attribute_values[value_data[1]]['last_updated'] = value_data[0]['last_updated'] * 1000;
              } else {
                CI.IV_object_attribute_values[value_data[1]]['last_updated'] = 0;
              }
            }
              CI.bi7GetAttributesCsvDataStep1(org_uid, sys_uid, time_range, history_values_flag, current_values_flag, required_filters);
          });
        }
      })
      ///</end> calling all nested listener once for system's objects, object's attributes and attribute's history/current values.
      /// Then Calling bi7GetAttributesCsvDataStep1 to filter data on attribute's name/value and request necessory object's names.
    }

    bi7objectAttributeMetaDataRequestForCSVData(uid) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7objectAttributeMetaDataRequestForCSVData ";
      var task_id = "bi7_watchdog_firebase:bi7objectAttributeMetaDataRequestForCSVData";
      var CI = this;

      //// input validation 
      call_result = bi1_data_validation.is_object_attribute_uid(uid);
      debug_data.push(call_result);
      
      if (call_result[CR.success] !== RC.success) {
          return_msg += "input validation failed";
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
      }
      ////</end> input validation


      // We'll make meta data request for this attribute in 2 conditions.
      // Attribute is renamed, we'll get this information from (IV_renamed_obj_attributes_uids)
      // OR
      // The attribute is not renamed but we don't have name in IV_default_obj_attribute_names.
      // In this case we'll make request for one attribute and rest of the attributes with same uid will use the name
      var uid_num_part = uid.split("-")[1];
      if (uid in CI.IV_renamed_obj_attributes_uids === false) {

        if (uid_num_part in CI.IV_default_obj_attribute_names === true) {

          if (uid in CI.IV_object_attributes_meta_data === false) {
            CI.IV_object_attributes_meta_data[uid] = {}
          }

          // We'll delete all these entries IV_object_attributes_meta_data once we complete building CSV.
          // This is a flag to get name from IV_default_obj_attribute_names while generating CSV file.
          CI.IV_object_attributes_meta_data[uid]['name'] = true;
          return;
        }

        // To make sure we don't make request again for this attribute.
        // Name will be set in processDatarequest function.
        CI.IV_default_obj_attribute_names[uid_num_part] = "";
      }
      CI.IV_deletion_items_keys_after_csv.push(uid);
      CI.bi7CreateDataStoreRequest('obj_atr_meta_data', uid, null, false);
    }

    bi7GetAttributesCsvDataStep1(org_uid, sys_uid=null, time_range, history_flag=true, current_flag=false, filters={}) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetAttributesCsvDataStep1 ";
      var task_id = "bi7_watchdog_firebase:bi7GetAttributesCsvDataStep1";
      var CI = this;
      var response_data = {};
      var filter_name_flag = false;
      var filter_value_flag = false;
      var attribute_names_to_filter = [];
      var search_string_num_part = null;

      //if we are still processsing requests to get object attriubte names and values, we don't want to run this function yet
      if(current_flag === true && CI.IV_process_datatore_last_request_count > 50) {
        setTimeout(function() {
          CI.bi7GetAttributesCsvDataStep1(org_uid, sys_uid, time_range, history_flag, current_flag, filters);
        }, 3000);
        return;
      }

      /// Setting filter flags for filtering attribute names or attribute values
      if (filters !== null && filters !== undefined) {
        if (filters['name'] !== null && filters['name'] !== undefined) {
          if (filters['name']['mode'] !== null && filters['name']['mode'] !== undefined && 
              filters['name']['search_text'] !== null && filters['name']['search_text'] !== undefined) {
            attribute_names_to_filter = filters['name']['search_text'].split(",").map(function(item) {
              return item.trim().toLocaleLowerCase();
            });
            filter_name_flag = true;
          }
        }
        if (filters['value'] !== null && filters['value'] !== undefined) {
          if (filters['value']['mode'] !== null && filters['value']['mode'] !== undefined && 
              filters['value']['search_text'] !== null && filters['value']['search_text'] !== undefined) {
            if (["greater", "less"].includes(filters['value']['mode'])) {
              search_string_num_part = CI.bi7ExtractNumbers(filters['value']['search_text']);
            }
            filter_value_flag = true;
          }
        }
      }
      ///</end> Setting filter flags for filtering attribute names or attribute values

      // if we get system id it means we are downloading data only for attributes under this system.
      if (sys_uid !== null && sys_uid !== undefined) {
        var response = CI.bi7GetObjectsDataUnderSystem(sys_uid, time_range, history_flag, current_flag);
        response_data[org_uid] = {}
        response_data[org_uid][sys_uid] = response.objects_data

      // if we are getting only org_id it means we are downloading data at the organization level.
      } else {

        /// getting CSV Data of all attributes for all systems under all nested sub orgs. 
        var sub_orgs_ids_list = [];
        var search_string = org_uid + "org_";
        
        for (var key in CI.IV_org_location_strings) {
          if (CI.IV_org_location_strings[key].indexOf(search_string) >= 0) {
            sub_orgs_ids_list.push(key);
          }
        }

        // Adding this org itself in list.
        sub_orgs_ids_list.push(org_uid);

        for (let index in sub_orgs_ids_list) {
          var response = CI.bi7GetSystemsDataUnderOrg(sub_orgs_ids_list[index], time_range, history_flag, current_flag)
          response_data[sub_orgs_ids_list[index]] = response.systems_data
        }
        ///</end> getting CSV Data of all attributes for all systems under all nested sub orgs. 
      }

      // We'll store filtered out data to this dictionary to pass to step2 function.
      var filtered_response_data = {};

      /// Filtering response_data with filters from arguments CSV data from all response data.
      for (let org_key in response_data) {
        for (let sys_key in response_data[org_key]) {
          for (let obj_key in response_data[org_key][sys_key]) {
            for (let attr_key in response_data[org_key][sys_key][obj_key]) {
              for (let time in response_data[org_key][sys_key][obj_key][attr_key]) {
                let value = response_data[org_key][sys_key][obj_key][attr_key][time]

                let attr_name = attr_key;

                if (attr_key in CI.IV_object_attributes_meta_data === true && 'name' in CI.IV_object_attributes_meta_data[attr_key]) {
                  attr_name = CI.IV_object_attributes_meta_data[attr_key].name;

                  // if we get binary true as attribute name.
                  // it means we'll get this attribute's name from IV_default_obj_attribute_names
                  if (attr_name === true) {
                    let uid_num_part = attr_key.split("-")[1];
                    if (uid_num_part in CI.IV_default_obj_attribute_names === true && CI.IV_default_obj_attribute_names[uid_num_part] !== "") {
                      attr_name = CI.IV_default_obj_attribute_names[uid_num_part];
                    } else {
                      attr_name = attr_key;
                    }
                  }
                }

                //// Filtering attributes with names / values.
                if (filter_name_flag === true) {
                  let search_mode = filters["name"]["mode"];
                  if (search_mode === "equals") {
                    if (!attribute_names_to_filter.includes(attr_name.toLocaleLowerCase())) {
                      continue;
                    }
                  } else {
                    if (attribute_names_to_filter.find((str) => attr_name.toLocaleLowerCase().includes(str)) === undefined) {
                      continue;
                    }
                  }
                }
                if (filter_value_flag === true) {
                  let search_mode = filters["value"]["mode"];
                  let search_string = filters["value"]["search_text"].toLocaleLowerCase();
                  let attr_name_num_part = CI.bi7ExtractNumbers(value);

                  let lowercase_value = '';
                  if (value !== null && value !== undefined) {
                    lowercase_value = value.toString().toLocaleLowerCase();
                  }

                  if (search_mode === "contains") {
                    if (lowercase_value.indexOf(search_string) === -1) {
                      continue;
                    }
                  } else if (search_mode === "not_contains") {
                    if (lowercase_value.indexOf(search_string) !== -1) {
                      continue;
                    }
                  } else if (search_mode === "greater") {
                    if (!(attr_name_num_part > search_string_num_part)) {
                      continue;
                    }
                  } else if (search_mode === "less") {
                    if (!(attr_name_num_part < search_string_num_part)) {
                      continue;
                    }
                  } else if (search_mode === "equals") {
                    if (lowercase_value !== search_string) {
                      continue;
                    }
                  }
                }


                ////</end> Filtering attributes with names / values.

                /// Adding filtered attribute entries in filtered_response_data.
                /// And requesting necessory objects names
                if (org_key in filtered_response_data === false) {
                  filtered_response_data[org_key] = {};
                }
                if (sys_key in filtered_response_data[org_key] === false) {
                  filtered_response_data[org_key][sys_key] = {};
                }
                if (obj_key in filtered_response_data[org_key][sys_key] === false) {
                  filtered_response_data[org_key][sys_key][obj_key] = {};
                }
                if (attr_key in filtered_response_data[org_key][sys_key][obj_key] === false) {
                  filtered_response_data[org_key][sys_key][obj_key][attr_key] = {};
                }
                if (time in filtered_response_data[org_key][sys_key][obj_key][attr_key] === false) {
                  filtered_response_data[org_key][sys_key][obj_key][attr_key][time] = "";
                }

                filtered_response_data[org_key][sys_key][obj_key][attr_key][time] = value;

                if (obj_key in CI.IV_objects_meta_data === false) {
                  CI.IV_deletion_items_keys_after_csv.push(obj_key);
                  this.bi7CreateDataStoreRequest('obj_meta_data',obj_key, null, false);
                } 

                ///</end> Adding filtered attribute entries in filtered_response_data.
                ///</end> And requesting necessory objects names
              }
            }
          }
        }
      }
      ///</end> Filtering response_data with filters from arguments CSV data from all response data.
      CI.bi7GetAttributesCsvDataStep2(filtered_response_data, org_uid, 0);
    }

    bi7GetAttributesCsvDataStep2(csv_data, base_org_uid, run_count=0) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetAttributesCsvDataStep2 ";
      var task_id = "bi7_watchdog_firebase:bi7GetAttributesCsvDataStep2";
      var CI = this;

      //if we are still processsing requests to get object names, we don't want to run the step3 function yet
      if(Object.keys(CI.IV_meta_data_requests['obj_meta_data']).length > 1) {
        setTimeout(function() {
          CI.bi7GetAttributesCsvDataStep2(csv_data, base_org_uid, run_count++);
        }, 3000);
        return;
      }

      CI.bi7GetAttributesCsvDataStep3(csv_data, base_org_uid);
    }

    bi7GetAttributesCsvDataStep3(csv_data, base_org_uid) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetAttributesCsvDataStep3 ";
      var task_id = "bi7_watchdog_firebase:bi7GetAttributesCsvDataStep3";
      var CI = this;

      const head_row = [
        "Organization Name", 
        "Organization Uid Path", 
        "System Name", 
        "System Uid", 
        "Object Name", 
        "Object Uid", 
        "Attribute Name", 
        "Attribute Uid", 
        "Date",
        "Time", 
        "Week Day",
        "UTC Timestamp",
        "Value",
        "Reporting page URL"
      ].join(",");

      let csvContent = "";
      if (window.G_dev_flag === 0) {
        var base_reporting_page_url = "https://watchdog.dgnet.cloud/dashboard/p2s1~c2m4~c6~c27~/"
      } else {
        var base_reporting_page_url = "https://dev-watchdog.dgnet.cloud/dashboard/p2s1~c2m4~c6~c27~/"
      }
      csvContent += head_row + "\r\n";

      for (let org_key in csv_data) {
        for (let sys_key in csv_data[org_key]) {
          for (let obj_key in csv_data[org_key][sys_key]) {
            for (let attr_key in csv_data[org_key][sys_key][obj_key]) {
              for (let time in csv_data[org_key][sys_key][obj_key][attr_key]) {
                let value = csv_data[org_key][sys_key][obj_key][attr_key][time]

                //// creating org names path and org uids path for CSV column 
                let org_location = CI.IV_org_locations[org_key];
                let org_index = org_location.findIndex((org) => org === base_org_uid.replace("org_", ""));
                let sub_orgs_list = org_location.slice(org_index);
                sub_orgs_list = sub_orgs_list.map((id) => id = "org_"+id)

                let org_uid_path = sub_orgs_list.join(" > ")
                let org_name_path = sub_orgs_list.map((val) => {
                  if (val in CI.IV_org_meta_data === true && 'name' in CI.IV_org_meta_data[val]) {
                    return val = CI.IV_org_meta_data[val].name;
                  }
                  return val;
                }).join(" > ")
                ////</end> creating org names path and org uids path for CSV column

                //// Setting up names for org, system, object, attribute from metadata
                const moment_time = moment(+time);
                let sys_name = sys_key, obj_name = obj_key, attr_name = attr_key,
                    formated_date = moment_time.format("YYYY-MM-DD"), formated_time = moment_time.format("h : mm A Z");

                var obj_sys_key = sys_key.replace("sys_", "obj_");
                if (obj_sys_key in CI.IV_objects_meta_data === true && 'name' in CI.IV_objects_meta_data[obj_sys_key]) {
                  sys_name = CI.IV_objects_meta_data[obj_sys_key].name;
                }
                if (obj_key in CI.IV_objects_meta_data === true && 'name' in CI.IV_objects_meta_data[obj_key]) {
                  obj_name = CI.IV_objects_meta_data[obj_key].name;
                }

                if (attr_key in CI.IV_object_attributes_meta_data === true && 'name' in CI.IV_object_attributes_meta_data[attr_key]) {
                  attr_name = CI.IV_object_attributes_meta_data[attr_key].name;

                  // it means we'll get this attribute's name from IV_default_attribute_names
                  if (attr_name === true) {
                    let uid_num_part = attr_key.split("-")[1];
                    if (uid_num_part in CI.IV_default_obj_attribute_names === true && CI.IV_default_obj_attribute_names[uid_num_part] !== "") {
                      attr_name = CI.IV_default_obj_attribute_names[uid_num_part];
                    } else {
                      attr_name = attr_key;
                    }
                  }
                }
                ////</end> Setting up names for org, system, object, attribute from metadata

                // Connected to watchdog attribute open directly under c2m4 instead of c6.
                var reporting_url = base_reporting_page_url;
                if (attr_key.slice(-2) === "-8") {
                  reporting_url = base_reporting_page_url.replace("c6~", "")
                }

                let row = [
                  org_name_path.replace(/,/g, " |"), org_uid_path, 
                  sys_name.replace(/,/g, " |"), sys_key, 
                  obj_name.replace(/,/g, " |"), obj_key, 
                  attr_name.replace(/,/g, " |"), attr_key, 
                  formated_date, formated_time, 
                  moment_time.format("dddd"),
                  time, value.replace(/\r?\n|\r|\n/g, " ").replace(/,/g, " |"),
                  `${reporting_url}org/${org_key}/sys/${sys_key}/obj/${obj_key}/obj_atr/${attr_key}`
                ]
                csvContent += row + "\r\n";
              }
            }
          }
        }
      }

      /// Clearing the boolean value metadata for this attribute
      for (let attr_uid in CI.IV_object_attributes_meta_data) {
        if ('name' in CI.IV_object_attributes_meta_data[attr_uid] && CI.IV_object_attributes_meta_data[attr_uid].name === true) {
          Vue.delete(CI.IV_object_attributes_meta_data, attr_uid);
        }
      }
      ///</end> Clearing the boolean value metadata for this attribute

      /// Clearing the object attribute's metadata from keys IV_deletion_items_keys_after_csv
      for (let index in CI.IV_deletion_items_keys_after_csv) {
        let id = CI.IV_deletion_items_keys_after_csv[index];

        if (id.indexOf("obj_atr_") === 0) {
          Vue.delete(CI.IV_object_attributes_meta_data, id);
        } else if (id.indexOf("obj_") === 0) {
          Vue.delete(CI.IV_objects_meta_data, id);
        }
      }
      CI.IV_deletion_items_keys_after_csv = [];
      ///</end> Clearing the object attribute's metadata from keys IV_deletion_items_keys_after_csv

      /// Preparing CSV data to download
      var blob = new Blob([ csvContent ], {
        type : "application/csv;charset=utf-8;"
      });
      
      if (window.navigator.msSaveBlob) {
        // FOR IE BROWSER
        navigator.msSaveBlob(blob, "Reporting CSV data.csv");
      } else {
        // FOR OTHER BROWSERS
        var link = document.createElement("a");
        var csvUrl = URL.createObjectURL(blob);
        link.href = csvUrl;
        link.style = "visibility:hidden";
        link.download = "Reporting CSV data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Resetting loading to false after starting data downloading
      Vue.set(CI.IV_component_loading_states, 'c2m9_c2m10_OrgReporting', false)

      //</end> Preparing CSV data to download
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };

    }

    //// function for extracting numbers from string if there are any.
    bi7ExtractNumbers(string_value) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7ExtractNumbers ";
      var task_id = "bi7_watchdog_firebase:bi7ExtractNumbers";
      let point = -1, extract = ''

      //// input validation 
      call_result = bi1_data_validation.is_string(string_value);
      debug_data.push(call_result);
      
      if (call_result[CR.success] !== RC.success) {
          return_msg += "input validation failed";
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
      }
      ////</end> input validation


      const nums = '1234567890'.split('')
      let s = string_value;
      for (let i = 0; i < s.length; i++) {
        if (nums.indexOf(s[i]) !== -1) {
          extract += s[i]
        } else if (
          s[i] === '.' &&
          point === -1 &&
          i < s.length - 1 &&
          nums.indexOf(s[i - 1]) !== -1 &&
          nums.indexOf(s[i + 1]) !== -1
        ) {
          point = i
          extract += s[i]
        }
      }
      if (extract.length === 0) return NaN
      return parseFloat(extract)
    }
    
    bi7GetSystemsDataUnderOrg(org_uid, time_range, history_flag=true, current_flag=false) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetSystemsDataUnderOrg ";
      var task_id = "bi7_watchdog_firebase:bi7GetSystemsDataUnderOrg";
      var CI = this;
      var systems_data = {};

      for (var system_uid in CI.IV_org_system_joins[org_uid]) {
        var response = CI.bi7GetObjectsDataUnderSystem(system_uid, time_range, history_flag, current_flag)
        systems_data[system_uid] = response.objects_data
      }
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'systems_data': systems_data };
    }

    bi7GetObjectsDataUnderSystem(sys_uid, time_range, history_flag=true, current_flag=false) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetObjectsDataUnderSystem ";
      var task_id = "bi7_watchdog_firebase:bi7GetObjectsDataUnderSystem";
      var CI = this;
      var objects_data = {};

      if (sys_uid in CI.IV_system_object_joins === true) {
        for(var object_uid in CI.IV_system_object_joins[sys_uid]) {
          var response = CI.bi7GetObjectAttributesDataUnderObject(object_uid, time_range, history_flag, current_flag)
          objects_data[object_uid] = response.attributes_data
        }
      }

      // getting history records for connected to watchdog values.
      
      if (sys_uid !== "last_updated" && sys_uid !== 'deletion_prevention_key') {
        var connected_to_watchdog_uid = sys_uid.replace("sys_", "obj_atr_") + "-8";
        var object_uid = sys_uid.replace("sys_", "obj_");

        if (object_uid in objects_data === false) {
          objects_data[object_uid] = {};
        }
        if (history_flag === true) {
          var response = CI.bi7GetAttributeHistoryValues(connected_to_watchdog_uid, time_range)
          objects_data[object_uid][connected_to_watchdog_uid] = response.attributes_value_data
        } else if (current_flag === true ) {
          var response = CI.bi7GetAttributeCurrentValue(connected_to_watchdog_uid);
          objects_data[object_uid][connected_to_watchdog_uid] = response.attributes_value_data
        }
      }
      //</end getting history records for connected to watchdog values.

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'objects_data': objects_data };
    }

    bi7GetObjectAttributesDataUnderObject(obj_uid, time_range, history_flag=true, current_flag=false) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetObjectAttributesDataUnderObject ";
      var task_id = "bi7_watchdog_firebase:bi7GetObjectAttributesDataUnderObject";
      var CI = this;
      var attributes_data = {};

      if (obj_uid in CI.IV_object_attribute_joins === true) {
        for(var attribute_uid in CI.IV_object_attribute_joins[obj_uid]) {
          if (history_flag === true) {
            var response = CI.bi7GetAttributeHistoryValues(attribute_uid, time_range);
          } else {
            var response = CI.bi7GetAttributeCurrentValue(attribute_uid);
          }
          attributes_data[attribute_uid] = response.attributes_value_data
        }
      }

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'attributes_data': attributes_data };
    }

    bi7GetAttributeHistoryValues(attr_uid, time_range) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetAttributeHistoryValues ";
      var task_id = "bi7_watchdog_firebase:bi7GetAttributeHistoryValues";
      var CI = this;
      var attributes_value_data = {};

      // getting history records for attribute_uid in parameter
      if (attr_uid in CI.IV_object_attribute_history_values === true) {
        for(var index in CI.IV_object_attribute_history_values[attr_uid]) {
          let time = CI.IV_object_attribute_history_values[attr_uid][index].date;
          let value = CI.IV_object_attribute_history_values[attr_uid][index].value;

          if (time > time_range[0] && time < time_range[1]) {
            attributes_value_data[time] = value;
          }
        }
      }
      //</end> getting history records for attribute_uid in parameter

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'attributes_value_data': attributes_value_data };
    }

    bi7GetAttributeCurrentValue(attr_uid) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7GetAttributeHistoryValues ";
      var task_id = "bi7_watchdog_firebase:bi7GetAttributeHistoryValues";
      var CI = this;
      var attributes_value_data = {};

      // getting current value records for attribute_uid in parameter
      if (attr_uid in CI.IV_object_attribute_values === true) {
        for(var index in CI.IV_object_attribute_values[attr_uid]) {

          if (attr_uid in CI.IV_object_attribute_values === false) {
            continue;
          }
          let time = CI.IV_object_attribute_values[attr_uid]['last_updated'];
          let value = CI.IV_object_attribute_values[attr_uid]['value'];

          if (time === undefined || time === null || value === undefined || value === null) {
            continue;
          }

          attributes_value_data[time] = value;
        }
      }
      //</end> getting current records for attribute_uid in parameter

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'attributes_value_data': attributes_value_data };
    }

    bi7InitRxTxLoggingListener(object_uid) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7InitRxTxLoggingListener ";
        var task_id = "bi7_watchdog_firebase:bi7InitRxTxLoggingListener";

        var CI = this;
        //// input validation 
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ////</end> input validation

        var object_rxtx_key_id = `history_obj_txrx_${object_uid.replace("obj_", "")}`;
        var listener_location = `history_obj_txrx/${object_rxtx_key_id}/`;
        CI.IV_listener_rx_tx_logging[object_uid] = CI.IV_firebase_db_object.ref(listener_location);

        ///// removing invalid firebase listener key
        call_result = CI.validateFirebaseListener(CI.IV_listener_rx_tx_logging[object_uid]);
        debug_data.push(call_result)
        if (call_result[CR.success] !== RC.success) {
          delete CI.IV_listener_rx_tx_logging[object_uid];
          return_msg += "failed to create listener for " + listener_location;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///// </end> removing invalid firebase listener key

        CI.IV_listener_rx_tx_logging[object_uid].on("value",
            function (a_data) { CI.rxTxLoggingListener(object_uid, a_data) }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(CI));
    }

    rxTxLoggingListener(object_uid, data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:rxTxLoggingListener ";
        var task_id = "bi7_watchdog_firebase:rxTxLoggingListener";
        var CI = this;

        ////// input validation 
        call_result = bi1_data_validation.is_object_uid(object_uid);
        debug_data.push(call_result);
        if (call_result[CR.success] !== RC.success) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
        }
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }

        /// create the flag to track the newest value we have already read
        if (object_uid in CI.IV_rx_tx_last_time === false) {
            CI.IV_rx_tx_last_time[object_uid] = 0;
        }

        //////</end> input validation 
        var firebase_data = data.val();
        for(var year in firebase_data) {
            for(var month in firebase_data[year]) {
                for(var day in firebase_data[year][month]) {
                    for(var timestamp in firebase_data[year][month][day]) {
                        var vue_timestamp = 0;

                        try {
                            vue_timestamp  = timestamp * 1000;
                        } catch (error) {
                            console.log("tst");
                            continue;
                        }

                        //this prevents adding the same data twice since
                        if(vue_timestamp <= CI.IV_rx_tx_last_time[object_uid]) {
                            continue;
                        } else {                        
                            CI.IV_rx_tx_last_time[object_uid] = vue_timestamp;
                        }

                        var entry_object = {RxData: [], TxData: [], date: 0};                        
                        
                        // raw_string format 
                        // "<||:RX~>2017/7/17/3-05-37>asdf1<||:TX~>2017/7/17/3-05-37>fdsa1"
                        var raw_string = firebase_data[year][month][day][timestamp]
                        
                        //some systems send the data as "<||:RX~>2017/7/17/3-05-37>", others as "<||:RX~>/2017/7/17/3-05-37>"
                        raw_string = raw_string.replace(/<\|\|:TX~>\//g,"<||:TX~>")
                        raw_string = raw_string.replace(/<\|\|:RX~>\//g,"<||:RX~>")
                        var splited_values = raw_string.split("<||:")
                        
                        // rempving first part will be ""
                        if (splited_values[0] === "") {splited_values.shift()}

                        entry_object.date = vue_timestamp;

                        // Parsing all possible entries for Rx and Tx values in single firebase location.
                        for (var index in splited_values) {
                          var value = splited_values[index];

                          if (value.includes("RX~>")) {
                            value = value.replace("RX~>", "").split(">");

                            let data_hash = {
                              // bi6BeautifyRxTxDateTime (cpu time, entry time)
                              // entry time will be used to get offset 
                              date: bi6_misc.bi6BeautifyRxTxDateTime(value[0], vue_timestamp),
                              value: value[1]
                            }

                            entry_object.RxData.push(data_hash);

                          } else if (value.includes("TX~>")) {
                            value = value.replace("TX~>", "").split(">");

                            let data_hash = {
                              // bi6BeautifyRxTxDateTime (cpu time, entry time)
                              // entry time will be used to get offset 
                              date: bi6_misc.bi6BeautifyRxTxDateTime(value[0], vue_timestamp),
                              value: value[1]
                            }

                            entry_object.TxData.push(data_hash);
                          }
                        }
                        //</end> Parsing all possible entries for Rx and Tx values in single firebase location.

                        if(object_uid in CI.IV_rx_tx_log_data === false) {
                            Vue.set(CI.IV_rx_tx_log_data,object_uid,{})
                        }
                        if (year in CI.IV_rx_tx_log_data[object_uid] === false) {
                            Vue.set(CI.IV_rx_tx_log_data[object_uid],year,{});
                        }
                        if (month in CI.IV_rx_tx_log_data[object_uid][year] === false) {
                            Vue.set(CI.IV_rx_tx_log_data[object_uid][year],month,{});
                        }
                        if (day in CI.IV_rx_tx_log_data[object_uid][year][month] === false) {
                            Vue.set(CI.IV_rx_tx_log_data[object_uid][year][month],day,[]);
                        }

                        CI.IV_rx_tx_log_data[object_uid][year][month][day].push(entry_object);
                    }
                }
            }
        }
    }

    bi7initGlobalRenamedObjectAttributesListener() {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:bi7initGlobalRenamedObjectAttributesListener ";
        var task_id = "bi7_watchdog_firebase:bi7initGlobalRenamedObjectAttributesListener";
        var CI = this;

        // We'll wait the firebase to connect before trying to start listener.
        if(CI.IV_instance_initialized !== true || CI.IV_user_info['uid'] === 0) {
            setTimeout(CI.bi7initGlobalRenamedObjectAttributesListener.bind(CI),500);
            return;
        }

        var listener_location = 'renamed_obj_atrs';

        CI.IV_global_listener_renamed_obj_attributes = CI.IV_firebase_db_object.ref(listener_location);

        CI.IV_global_listener_renamed_obj_attributes.on("value",
            function (a_data) {
                CI.GlobalRenamedObjecAttributesListener(a_data);              
            }.bind(CI),
            function (errorObject) {
                return_msg += "firebase read failed with error data:" + errorObject;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
            }.bind(this)
        );
    }

    GlobalRenamedObjecAttributesListener(data) {
        var debug_data = [];
        var call_result = {};
        var return_msg = "bi7_watchdog_firebase:GlobalRenamedObjecAttributesListener ";
        var task_id = "bi7_watchdog_firebase:GlobalRenamedObjecAttributesListener";
        var CI = this;

        /// input validation
        if (data === null) {
            return_msg += "data argument is null";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
        }
        ///</end> input validation

        var firebase_data = data.val();

        for (var obj_attribute_uid in firebase_data) {
            //set the last updated timestamp for the permissions
            if (obj_attribute_uid === "last_updated" || obj_attribute_uid === 'deletion_prevention_key') {
                continue;
            }

            if (obj_attribute_uid in CI.IV_renamed_obj_attributes_uids === false) {
                // We'll just store boolean value here because we can get the uid from key.
                CI.IV_renamed_obj_attributes_uids[obj_attribute_uid] = true;
            }
        }
    }

    bi7FetchAllAttributes(org_uid, filter, filter_text) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7FetchAllAttributes ";
      var task_id = "bi7_watchdog_firebase:bi7FetchAllAttributes";
      var CI = this;
      var filtered_attributes_list = [];
      ////// input validation 
      call_result = bi1_data_validation.is_org_uid(org_uid);
      debug_data.push(call_result);
      if (call_result[CR.success] !== RC.success) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
      }
      //////</end> input validation 
      Vue.set(CI.IV_component_loading_states, 'c2m3_mass_apply_rules', true);

      var sys_obj_and_attribute_joins_promises = []

      // making callback function for firebase failure
      var firebase_failure = function (errorObject) {
          return_msg += "firebase read failed with error data:" + errorObject;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(this)

      /// callback functions to start listeners and push promises to promises array
      var init_system_objects_and_attributes_join_listeners = function (uid) {
        var listener_location = 'systems/' + uid;
        var listener_ref = CI.IV_firebase_db_object.ref(listener_location);

        return listener_ref.once("value").then(
          function (a_data) {
            return [a_data.val(), uid];
          }.bind(CI),
          firebase_failure
        )
      }

      var sub_orgs_ids_list = [];
      var search_string = org_uid + "org_";
      
      for (var key in CI.IV_org_location_strings) {
        if (CI.IV_org_location_strings[key].indexOf(search_string) >= 0) {
          sub_orgs_ids_list.push(key);
        }
      }

      sub_orgs_ids_list.push(org_uid);

      for (let index in sub_orgs_ids_list) {
        for (var system_id in CI.IV_org_system_joins[sub_orgs_ids_list[index]]) {
          if (system_id === "last_updated" || system_id === 'deletion_prevention_key') { continue; }

          CI.IV_system_object_joins[system_id] = {};
          sys_obj_and_attribute_joins_promises.push(init_system_objects_and_attributes_join_listeners(system_id))

          // calling attribute histery listener for connected to watchdog for this system
          var connected_to_watchdog_uid = system_id.replace("sys_", "obj_atr_") + "-8"

          if (connected_to_watchdog_uid in CI.IV_object_attributes_meta_data == false) {
            // we'll use this function here to reuse the code about fetching only attribute names which are renamed
            CI.bi7objectAttributeMetaDataRequestForCSVData(connected_to_watchdog_uid);
          }
        }
      }

      Promise.all(sys_obj_and_attribute_joins_promises).then((values) => {
        for (let index in values) {
          var system_data = values[index];
          //// data validation
          if (Array.isArray(system_data) === false || system_data.length < 2
          || system_data[0] === undefined || system_data[1] === undefined
           || system_data[0] === null || system_data[1] === null) {
             continue;
           }
           ////</end> data validation

          var system_uid = system_data[1];
          var system_object_uids = system_data[0]['object_uids'];
          var system_attribute_uids = system_data[0]['object_attributes'];

          //// Setting system object joins 
          if (system_object_uids !== null && system_object_uids !== undefined) {
            for (let obj_key in system_object_uids) {

              if (system_object_uids[obj_key][0] === 'd') {
                continue;
              }
              //ignore last updated entries, the system is technically an object but we don't list it with the objects under the system
              if (obj_key === "last_updated" || 
                  obj_key === 'deletion_prevention_key' ||
                  obj_key === system_uid.replace('sys_','obj_')
                  ) {
                continue;
              }

              if (obj_key in CI.IV_object_attribute_joins == false) {
                CI.IV_object_attribute_joins[obj_key] = {};
              }
              
              if (obj_key in CI.IV_system_object_joins[system_uid] === false || CI.IV_system_object_joins[system_uid][obj_key] !== obj_key) {
                CI.IV_system_object_joins[system_uid][obj_key] = obj_key;
                CI.IV_system_object_joins_reverse_lookup[obj_key] = system_uid;
              }
            }
          }
          ////</end> Setting system object joins 

          //// Setting system object_attribute joins 
          if (system_attribute_uids !== null && system_attribute_uids !== undefined) {
            for (let attr_key in system_attribute_uids) {

              //ignore last updated entries
              if (attr_key === "last_updated" || attr_key === 'deletion_prevention_key') {
                continue;
              }

              var attribute_object_uid = "";
              try {
                attribute_object_uid = `obj_${CI.bi7ExtractNumbers(attr_key.split("-")[0])}`;
              } catch(error) {
                return_msg += "failed to JSON parse firebase data with error:" + error;
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
                continue;
              }

              // checking if the attribute belongs to any object under this system
              if (attribute_object_uid in CI.IV_object_attribute_joins === false) {
                continue;
              }
              //</end> checking if the attribute belongs to any object under this system

              if (attr_key in CI.IV_object_attribute_joins[attribute_object_uid] === false) {
                CI.IV_object_attribute_joins[attribute_object_uid][attr_key] = attr_key;
                CI.IV_object_attribute_joins_reverse_lookup[attr_key] = attribute_object_uid;
              }
              
              if (attr_key in CI.IV_object_attributes_meta_data === false) {
                // we'll use this function here to reuse the code about fetching only attribute names which are renamed
                CI.bi7objectAttributeMetaDataRequestForCSVData(attr_key);
              }

            }
          }
          ////</end> Setting system object_attribute joins           
        }
        CI.bi7FetchAllAttributesStep2(org_uid, filter, filter_text);
      })
    }

    bi7InitMassAppliedRulesHistoryListener() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7InitMassAppliedRulesHistoryListener ";
      var task_id = "bi7_watchdog_firebase:bi7InitMassAppliedRulesHistoryListener";
      var CI = this;

      var listen_folder = CI.IV_user_folder_path + '/mass_applied_rules_history/';

      // we already have listener for this location
      if (CI.IV_listener_mass_applied_rules_history != null) {
        return;
      }

      CI.IV_listener_mass_applied_rules_history = CI.IV_firebase_db_object.ref(listen_folder);

      var init_listener_callback = function() {
        CI.IV_listener_mass_applied_rules_history.on("value",
          function (b_data) { CI.MassAppliedRulesHistoryListener(b_data) }.bind(CI),
          function (error) {
            return_msg += "firebase read failed with error data:" + error;
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
          }.bind(this)
        );
      }

      CI.bi7CreateUserFolderIfNotExists(listen_folder,init_listener_callback);
    }

    MassAppliedRulesHistoryListener(data) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:MassAppliedRulesHistoryListener ";
      var task_id = "bi7_watchdog_firebase:MassAppliedRulesHistoryListener";
      var CI = this;

      ///// input validation
      if (data == null) {
        return_msg += "data argument is null";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }
      /////</end> input validation

      var firebase_data = data.val()

      for (let rule_uid in firebase_data) {
        if (rule_uid == "deletion_prevention_key") {continue};

        if (rule_uid in CI.IV_mass_applied_rules_history == false) {
          Vue.set(CI.IV_mass_applied_rules_history, rule_uid, {});
        }

        for (let attribute_uid in firebase_data[rule_uid]) {
          if (attribute_uid == "deletion_prevention_key") {continue};
          Vue.set(CI.IV_mass_applied_rules_history[rule_uid], attribute_uid, true);
        }
      }
    }

    bi7WriteMassAppliedRuleHistory(rule_uid, attribute_uids) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7WriteMassAppliedRuleHistory ";
      var task_id = "bi7_watchdog_firebase:bi7WriteMassAppliedRuleHistory";
      var CI = this;

      ///// input validation
      call_result = bi1_data_validation.is_string(rule_uid);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_array(attribute_uids, 1);
      debug_data.push(call_result);

      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] != RC.success) {
          validation_failed = true;
        }
      }
      if(validation_failed == true) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return;
      }
      /////</end> input validation

      var folder = CI.IV_user_folder_path + '/mass_applied_rules_history/' + rule_uid;
      var updates = {};

      for (let index in attribute_uids) {
        let atr_uid = attribute_uids[index]
        updates[`${folder}/${atr_uid}`] = true;
      }
      
      /// writing data in user's mass_applied_rules_history history folder
      CI.IV_firebase_db_object.ref().update(updates, function(error) {
        if (error) {
          return_msg += "firebase write failed with error data:" + error;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        } else {
          return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
        }
      });

      ///</end> writing data in user's mass_applied_rules_history history folder
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7FetchAllAttributesStep2(org_uid, filter, filter_text) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7FetchAllAttributesStep2 ";
      var task_id = "bi7_watchdog_firebase:bi7FetchAllAttributesStep2";
      var CI = this;
      var attributes_list = [];

      //if we are still processsing requests to get object attriubte names and values, we don't want to run this function yet
      if(Object.keys(CI.IV_meta_data_requests['obj_atr_meta_data']).length > 5) {
        setTimeout(function() {
          CI.bi7FetchAllAttributesStep2(org_uid, filter, filter_text);
        }, 3000);
        return;
      }

      var sub_orgs_ids_list = [];
      var search_string = org_uid + "org_";
      
      for (var key in CI.IV_org_location_strings) {
        if (CI.IV_org_location_strings[key].indexOf(search_string) >= 0) {
          sub_orgs_ids_list.push(key);
        }
      }

      // Adding this org itself in list.
      sub_orgs_ids_list.push(org_uid);

      for (let index in sub_orgs_ids_list) {
        let org_key = sub_orgs_ids_list[index];

        for (var system_uid in CI.IV_org_system_joins[org_key]) {
          if (system_uid in CI.IV_system_object_joins === true) {

            // adding connected to watchdog uid for this system.
            let connected_to_watchdog_uid = system_uid.replace("sys_", "obj_atr_") + "-8";
            attributes_list.push({id: connected_to_watchdog_uid});

            for(var object_uid in CI.IV_system_object_joins[system_uid]) {
              if (object_uid in CI.IV_object_attribute_joins === true) {
                for(var attribute_uid in CI.IV_object_attribute_joins[object_uid]) {
                  attributes_list.push({id: attribute_uid});
                }
              }
            }
          }
        }
      }

      var filtered_attributes_list = [];

      for (let index1 in attributes_list) {
        let attribute_item = attributes_list[index1];
        let attribute_uid = attribute_item.id;

        let attr_name = attribute_uid;
        if (attribute_uid in CI.IV_object_attributes_meta_data === true && 
            CI.IV_object_attributes_meta_data[attribute_uid] !== null &&
            CI.IV_object_attributes_meta_data[attribute_uid] !== undefined &&
            'name' in CI.IV_object_attributes_meta_data[attribute_uid]) {
          attr_name = CI.IV_object_attributes_meta_data[attribute_uid].name;

          // if we get binary true as attribute name.
          // it means we'll get this attribute's name from IV_default_obj_attribute_names
          if (attr_name === true) {
            let uid_num_part = attribute_uid.split("-")[1];
            if (uid_num_part in CI.IV_default_obj_attribute_names === true && CI.IV_default_obj_attribute_names[uid_num_part] !== "") {
              attr_name = CI.IV_default_obj_attribute_names[uid_num_part];
            } else {
              attr_name = attribute_uid;
            }
          }
        }
        if (filter !== null && filter_text !== null) {
          if (filter === 'equals') {
            if (filter_text.toLocaleLowerCase() !== attr_name.toLocaleLowerCase()) {continue;}
          } else {
            if (!attr_name.toLocaleLowerCase().includes(filter_text.toLocaleLowerCase())) {continue;}
          }
        }

        attribute_item['name'] = attr_name;
        filtered_attributes_list.push(attribute_item);
      }
      
      /// Clearing the boolean value metadata for this attribute
      for (let attr_uid in CI.IV_object_attributes_meta_data) {
        if (CI.IV_object_attributes_meta_data[attr_uid] !== null &&
            CI.IV_object_attributes_meta_data[attr_uid] !== undefined &&
            'name' in CI.IV_object_attributes_meta_data[attr_uid] && 
            CI.IV_object_attributes_meta_data[attr_uid].name === true) {
          try {
            Vue.delete(CI.IV_object_attributes_meta_data, attr_uid);
            delete (CI.IV_last_updated_timestamps["obj_atr_meta_data"][attr_uid]);
          } catch (e) {}
        }
      }
      ///</end> Clearing the boolean value metadata for this attribute

      // We also need to clear last updated timestams for these attributes
      // so that when user opens system details 
      // processDataStoreRequest function can get updated names.
      for (let index in CI.IV_deletion_items_keys_after_csv) {
        let key = CI.IV_deletion_items_keys_after_csv[index];
        if (key in CI.IV_last_updated_timestamps["obj_atr_meta_data"] === true) {
          delete (CI.IV_last_updated_timestamps["obj_atr_meta_data"][key]);
        }
      }

      Vue.set(CI.IV_filtered_attributes_list, 'filtered_attributes', [])
      Vue.set(CI.IV_filtered_attributes_list, 'filtered_attributes', filtered_attributes_list);
      Vue.set(CI.IV_component_loading_states, 'c2m3_mass_apply_rules', false)
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data, 'attributes_list': filtered_attributes_list };
    }

    bi7ClearFilteredAttributesListAndListeners() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7ClearFilteredAttributesList ";
      var task_id = "bi7_watchdog_firebase:bi7ClearFilteredAttributesList";
      var CI = this;

      Vue.set(CI.IV_filtered_attributes_list, 'filtered_attributes', []);

      try {
        CI.IV_listener_mass_applied_rules_history.off();
        CI.IV_listener_mass_applied_rules_history = null;
      } catch(error) {
        debug_data.push(JSON.stringify(error))
        return_msg += `failed to turn ${CI.IV_listener_mass_applied_rules_history} listener off.`;
        CI.IV_listener_mass_applied_rules_history = null;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
      }

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data};

    }

    bi7InitDoghouseTagsListener() {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7InitDoghouseTagsListener ";
      var task_id = "bi7_watchdog_firebase:bi7InitDoghouseTagsListener";
      var CI = this;

      var listen_folder = CI.IV_user_folder_path + '/dog_house_tags/';

      // we already have listener for this location
      if (CI.IV_listener_dog_house_tags !== null) {
        return;
      }

      CI.IV_listener_dog_house_tags = CI.IV_firebase_db_object.ref(listen_folder);

      CI.IV_listener_dog_house_tags.on("value",
        function (b_data) { CI.DoghouseTagsListener(b_data) }.bind(CI),
        function (error) {
          return_msg += "firebase read failed with error data:" + error;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        }.bind(this)
      );

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data};
    }

    DoghouseTagsListener(data) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:DoghouseTagsListener ";
      var task_id = "bi7_watchdog_firebase:DoghouseTagsListener";
      var CI = this;

      ///// input validation
      if (data === null || data === undefined) {
        return_msg += "data argument is null";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }
      /////</end> input validation

      var firebase_data = data.val()

      for (let tag_id in firebase_data) {
        if (tag_id === "deletion_prevention_key") {continue};


        var entry = {};
        try {
          entry = JSON.parse(firebase_data[tag_id])
        } catch (e) {
          return_msg += "Failed to parse JSON, errors:" + JSON.stringify(e.message);
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
        }

        if (tag_id in CI.IV_dog_house_tags === false || CI.IV_dog_house_tags[tag_id]["name"] !== entry["name"]) {
          Vue.set(CI.IV_dog_house_tags, tag_id, {});
        }

        entry["id"] = tag_id;
        Vue.set(CI.IV_dog_house_tags, tag_id, entry);
      }

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data};
    }

    bi7AddOrUpdateDoghouseTag(name, tag_id=null) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7AddOrUpdateDoghouseTag ";
      var task_id = "bi7_watchdog_firebase:bi7AddOrUpdateDoghouseTag";
      var CI = this;

      ////// input validation
      call_result = bi1_data_validation.is_string(name);
      debug_data.push(call_result);
      if (tag_id !== null) {
        call_result = bi1_data_validation.is_string(tag_id);
        debug_data.push(call_result);
      }

      var validation_failed = false;
      for (var index in debug_data) {
        if (debug_data[index][CR.success] !== RC.success) {
          validation_failed = true;
        }
      }

      if(validation_failed === true) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
      }
      /////// </end> input validation

      var firebase_error_callback = function(error) {
        if (error) {
          return_msg += "firebase write failed with error data:" + error;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        }
      };

      if (tag_id === null) {
        let folder_path = CI.IV_user_folder_path + '/dog_house_tags/';
        let reference = CI.IV_firebase_db_object.ref(folder_path);

        let data = {name: name}
        reference.push().set(JSON.stringify(data), firebase_error_callback);
      } else {
        let folder_path = CI.IV_user_folder_path + `/dog_house_tags/${tag_id}`;
        let reference = CI.IV_firebase_db_object.ref(folder_path);

        let data = {name: name}
        reference.set(JSON.stringify(data), firebase_error_callback);
      }

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7AssignOrUnAssignDoghouseTag(doghouse_entry, tag_id, assign_flag, unassign_flag) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7AssignDoghouseTag ";
      var task_id = "bi7_watchdog_firebase:bi7AssignDoghouseTag";
      var CI = this;

      ///// input validation
      call_result = bi1_data_validation.is_string(tag_id);
      debug_data.push(call_result);

      if (call_result[CR.success] !== RC.success) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }

      if (doghouse_entry === null) {
        return_msg += "doghouse_entry argument is null";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }
      /////</end> input validation

      var folder_path = CI.IV_user_folder_path + 
                    '/dog_house_active/' + 
                    doghouse_entry["org_uid"] + '/' + 
                    doghouse_entry["sys_uid"] + '/' + 
                    doghouse_entry["obj_uid"] + '/' + 
                    doghouse_entry["obj_atr_uid"] + '/' + 
                    doghouse_entry['rule_uid'];

      let tag_ids = doghouse_entry["tags"];
      if (assign_flag === true) {
        if (!tag_ids.includes(tag_id)) {
          tag_ids.push(tag_id);
        }
      } else if (unassign_flag === true) {
        if (tag_ids.includes(tag_id)) {
          let index = tag_ids.indexOf(tag_id);
          tag_ids.splice(index, 1);
        }
      } else {return;}

      var data_object = {
        "timestamp": doghouse_entry["timestamp"],
        "sys_uid": doghouse_entry["sys_uid"],
        "rule_uid": doghouse_entry["rule_uid"],
        "value": doghouse_entry["value"],
        "org_uid": doghouse_entry["org_uid"],
        "obj_atr_uid": doghouse_entry["obj_atr_uid"],
        "obj_uid": doghouse_entry["obj_uid"],
        "tags": tag_ids
      };

      let reference = CI.IV_firebase_db_object.ref(folder_path);

      reference.set(JSON.stringify(data_object), function(error) {
        if (error) {
          return_msg += "firebase write failed with error data:" + error;
          base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        }
      });

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7DeleteDoghouseTag(tag_id) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7DeleteDoghouseTag ";
      var task_id = "bi7_watchdog_firebase:bi7DeleteDoghouseTag";
      var CI = this;

      ///// input validation
      call_result = bi1_data_validation.is_string(tag_id);
      debug_data.push(call_result);

      if (call_result[CR.success] !== RC.success) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }
      ////</end> input validation

      var folder_path = CI.IV_user_folder_path + "/dog_house_tags/" + tag_id;

      CI.bi7DeleteFirebaseLocation(folder_path);
      Vue.delete(CI.IV_dog_house_tags, tag_id);
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    bi7ClearActiveAlertsForRule(rule_uid) {
      var debug_data = [];
      var call_result = {};
      var return_msg = "bi7_watchdog_firebase:bi7ClearActiveAlertsForRule ";
      var task_id = "bi7_watchdog_firebase:bi7ClearActiveAlertsForRule";
      var CI = this;

      ///// input validation
      call_result = bi1_data_validation.is_string(rule_uid);
      debug_data.push(call_result);

      if (call_result[CR.success] !== RC.success) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
      }
      ////</end> input validation

      let firebase_locations_to_delete = [];

      for (let org_uid in CI.IV_doghouse_active) {
        for (let sys_uid in CI.IV_doghouse_active[org_uid]) {
          for (let obj_uid in CI.IV_doghouse_active[org_uid][sys_uid]) {
            for (let obj_attr_uid in CI.IV_doghouse_active[org_uid][sys_uid][obj_uid]) {
              for (let rule_join_uid in CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_attr_uid]) {
                let entry = CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_attr_uid][rule_join_uid];
                if (entry === null || entry === undefined) {continue;}

                if (entry.rule_uid === rule_uid) {
                  let active_location = CI.IV_user_folder_path + '/dog_house_active/' + entry.org_uid + '/' + entry.sys_uid + '/' + entry.obj_uid + '/' + entry.obj_atr_uid + '/' + entry.rule_uid;
                  let acknowledged_location = CI.IV_user_folder_path + '/dog_house_ackowledged/' + entry.org_uid + '/' + entry.sys_uid + '/' + entry.obj_uid + '/' + entry.obj_atr_uid + '/' + entry.rule_uid;
                  CI.bi7DeleteFirebaseLocation(active_location)
                  CI.bi7DeleteFirebaseLocation(acknowledged_location)
                  try {
                    Vue.delete(CI.IV_doghouse_active[org_uid][sys_uid][obj_uid][obj_attr_uid], rule_join_uid)
                    Vue.delete(CI.IV_doghouse_acknowledged[org_uid][sys_uid][obj_uid][obj_attr_uid], rule_join_uid);
                  } catch (error) {}
                  
                }
              }
            }
          }
        }
      }

      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }

}

export default bi7_watchdog_firebase
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
window.loaded_includes['base_i7'] = true;
