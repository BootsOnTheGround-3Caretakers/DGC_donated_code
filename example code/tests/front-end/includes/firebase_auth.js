var firebase = require('firebase');
const configs = require('../javascript_tests/configs');
const querystring = require('querystring');
const axios = require('axios')
var retry_count = 0;

class FirebaseAuth {
  constructor() {
    var config = {
      apiKey: "AIzaSyBj8wTCYHQwyhxixJpaHYgP-zyIqPWuStY",
      authDomain: "dev-watchdog-user-interface.firebaseapp.com",
      databaseURL: "https://dev-watchdog-user-interface.firebaseio.com",
      projectId: "dev-watchdog-user-interface",
      storageBucket: "dev-watchdog-user-interface.appspot.com",
      messagingSenderId: "830658011085",
    };

    firebase.initializeApp(config); 
  }

  loginUser(email, password, success_callback) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(
      (user) => {
        console.log("Logged in successfully!");
        this.loginSuccessCallback(success_callback);
      },
      (error) => {
        console.log("Failed in login");
      }
    );
  }

  loginSuccessCallback(success_callback) {
    this.getUserToken().then(
      (accessToken) => {
        console.log("Fetched user's access token from firebase successfully!");
        this.tokenSuccessCallback(accessToken, success_callback);
      },
      (error) => {
        console.log("Failed to retreive user's access token"+error);
      }
    )
  }

  tokenSuccessCallback(accessToken, success_callback) {
    var verify_token_params = {
      p2s7_token: accessToken,
      p2s7_firebase_email: configs.user_email
    };

    axios.post(configs.verify_token_url, querystring.stringify(verify_token_params)) //#debug
      .then(function (response) {
        console.log(`Successfully verified token, Success code: ${response.status}`);
        success_callback(accessToken);
      })
      .catch(function (error) {
        console.log(error);
        console.log(`There was an error while verifying token. Error: ${error.response.status}`);

        // Refreshing user's firbase token if in case the old one not working
        if (retry_count < 2) {
          retry_count++;
          console.log("retry call token verify");
          this.loginSuccessCallback(success_callback);
        }
      });
  }

  getUserToken() {
    return firebase.auth().currentUser.getIdToken(true);
  }
}

module.exports = FirebaseAuth;