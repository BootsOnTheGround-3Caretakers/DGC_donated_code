const FirebaseAuth = require('../../../includes/firebase_auth.js');
const configs = require('../../configs');
const querystring = require('querystring');
const axios = require('axios')

var firebase_auth = new FirebaseAuth();
var request_time = 0;
var request_url = "https://js-logging-dot-dev-watchdog-user-interface.appspot.com/js-logging/p2s8t2-log-metrics";

var params = {
    p2s8_firebase_email: configs.user_email,
    p2s8_token: '',
    p2s8t2_user_uid: configs.user_uid.replace("usr_", ""),
    p2s8t2_operation_id: "1",
    p2s8t2_operation_name: "Operation 1",
    p2s8t2_started_at: "1569931494394",
    p2s8t2_finished_at: "1569937167825",
    p2s8t2_finishing_type: "Successful"
};

var verify_token_success_callback = function(token) {
  params['p2s8_token'] = token;
  request_time = new Date().getTime();

  axios.post(request_url, querystring.stringify(params))
    .then(function (response) {
      let time_taken = new Date().getTime() - request_time;
      console.log(`Time took by request to complete is: ${time_taken/1000} seconds`);
      console.log(`Test passed: Response Success Code: ${response.status}`);
    })
    .catch(function (error) {
      let time_taken = new Date().getTime() - request_time;
      console.log(`Time took by request to complete is: ${time_taken/1000} seconds`);
      console.log(`There was an error while performing this operation. Error: ${error.response.status}`);
    });
}

firebase_auth.loginUser(configs.user_email, configs.user_password, verify_token_success_callback)
