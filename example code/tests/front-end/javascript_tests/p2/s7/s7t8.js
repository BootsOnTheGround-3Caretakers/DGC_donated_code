const FirebaseAuth = require('../../../includes/firebase_auth.js');
const configs = require('../../configs');
const querystring = require('querystring');
const axios = require('axios')

var firebase_auth = new FirebaseAuth();
var request_time = 0;
var request_url = configs.base_domain_url + "/json-requests/p2s7t8-unassign-notification-rule";

var params = {
    p2s7_firebase_email: configs.user_email,
    p2s7_token: '',
    p2s7t8_rule_uid: "28-e84lTGBgHsdUOioj8X1i-2020-01-01-07-34-45-826795",
    p2s7t8_rule_type: '1',
    p2s7t8_object_attribute_uid: "obj_atr_277-341",
};

var verify_token_success_callback = function(token) {
  params['p2s7_token'] = token;
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
