/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'


function unassignNotificationRule(firebase_email, firebase_token,rule_uid,object_attribute_uid) {
    return new Promise(function (resolve, reject) {
        var return_msg = "";
        var debug_data = [];
        var call_result = {};
        var task_id = "p2s7t8unassignNotificationRule";
        var org_permissions = [];

        ///// input validation
        call_result = bi1_data_validation.is_object_attribute_uid(object_attribute_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(rule_uid);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_email_address(firebase_email);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(firebase_token);
        debug_data.push(call_result);

        var validation_failed_flag = false;
        for (var index in debug_data) {
            if (debug_data[index][CR.success] !== RC.success) {
                validation_failed_flag = true;
                break;
            }
        }

        if (validation_failed_flag === true) {
            return_msg += "input validation failed";
            base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
            reject({ success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data });
        }
        /////</end> input validation

        ajax({
            url: window.G_ajax_test_domain + '/json-requests/p2s7t8-unassign-notification-rule',
            method: 'POST',
            dataType: "text",
            data: {
                'p2s7t8_rule_uid': rule_uid,
                'p2s7t8_rule_type': '1',
                'p2s7t8_object_attribute_uid': object_attribute_uid,
                'p2s7_token': firebase_token,
                'p2s7_firebase_email': firebase_email
            },
            success: function (result) {
                resolve({ success: RC.general_failure, return_msg: return_msg, debug_data: debug_data});
            },
            error: function (result) {
                if (result.status === 401) {
                  window.G_firebase_auth.bi5forceTokenRefresh();
                }
                return_msg += "failed to unassign rule, error data:" + JSON.stringify(result);
                base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
                reject({ success: RC.general_failure, return_msg: return_msg, debug_data: debug_data});
            }
        })

    });
};


export default unassignNotificationRule
