/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'

function getUserOrgSystemData(firebase_email, firebase_token, user_id) {
    return new Promise(function (resolve, reject) {
        var return_msg = "";
        var debug_data = [];
        var call_result = {};
        var task_id = "p2s7t9getUserOrgSystemData";
        var response_data = {};

        ///// input validation
        call_result = bi1_data_validation.is_user_uid(user_id);
        debug_data.push(call_result);
        call_result = bi1_data_validation.is_string(user_id);
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
          reject({ success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data, response_data: response_data });
        }
        /////</end> input validation

        ajax({
            url: window.G_ajax_test_domain + '/json-requests/p2s7t9-get-user-orgs-systems',
            method: 'POST',
            dataType: "json",
            data: {
              'p2s7t9-user-uid': user_id,
              'p2s7_token': firebase_token,
              'p2s7_firebase_email': firebase_email
            },
            success: function (result) {
              response_data = result;
              resolve({ success: RC.general_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
            },
            error: function (result) {
              if (result.status === 401) {
                window.G_firebase_auth.bi5forceTokenRefresh();
              }
              return_msg += "failed to get user's org and system data, error data:" + JSON.stringify(result);
              base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
              reject({ success: RC.general_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
            }
        })

    });
};


export default getUserOrgSystemData
