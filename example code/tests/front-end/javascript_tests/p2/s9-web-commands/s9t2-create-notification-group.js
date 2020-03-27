const FirebaseAuth = require('../../../includes/firebase_auth.js');
const configs = require('../../configs');
const querystring = require('querystring');
const axios = require('axios')

var firebase_auth = new FirebaseAuth();
var request_time = 0;
var request_url = configs.base_domain_url + "/web-commands/p2s9t2-create-notification-group";

var params = {
    p2s9_firebase_email: configs.user_email,
    p2s9_token: '',
    p2s9t2_user_uid: configs.user_uid,
    p2s9t2_org_uid: "org_4",
    p2s9t2_ngp_name: "Test Group From P2",
    p2s9t2_ngp_description: "Test Group From P2 Javascript Tests"
};

var verify_token_success_callback = function(token) {
  params['p2s9_token'] = token;
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
