/* eslint-disable */
import { CR, RC, AJRS } from "./base_i2_success_codes";
import bi1_data_validation from "./base_i1_datavalidation";
import base_i3_log from "./base_i3_logging";
import { ajax } from "noquery-ajax";
window.firebase = require('firebase')

class bi5_firebase {
  constructor() {
    var CI = this;
    CI.CV_token_refresh_time = 1000;
    CI.IV_next_token_refresh = 0;
    CI.IV_email_address = '';
    CI.IV_first_name = "";
    CI.IV_last_name = "";
    CI.IV_emailVerified = false;
    CI.IV_photoURL = "";
    CI.IV_uid = '';
    CI.IV_is_guest = false;
    CI.IV_providerData = null;
    CI.IV_token_received = false;
    CI.IV_id_token = '';
    CI.IV_token_update_count = 0;
    CI.IV_token_verified = false;
    CI.IV_token_verification_loop_active = false;
    CI.IV_signout_requested_flag = false;
    CI.IV_guest_login_requested = false;
    CI.IV_user_is_anonymous = false;
    CI.IV_displayName = '';
    CI.IV_login_page_callbacks = {
      'signing_in': null, 'signed_in': null, 'sign_in_failed': null,
      'passwordless_email_sent': null, 'passwordless_email_failed': null,
      'email_valid': null, 'email_invalid': null, 'password_valid': null,
      'password_invalid': null, 'create_user_failed': null, 'password_reset_sent': null,
      'password_reset_failed': null
    };

    CI.IV_site_page_callbacks = {
      'signing_in': null, 'signed_in': null, 'sign_in_failed': null
    }
    CI.IV_signed_in_global_callback = null;
    CI.IV_signed_out_global_callback = null;
    CI.IV_token_updated_global_callback = null;
    CI.IV_initialized = false;

    if (window.G_dev_flag === 1) {
      var config = {
        apiKey: "AIzaSyBj8wTCYHQwyhxixJpaHYgP-zyIqPWuStY",
        authDomain: "dev-watchdog-user-interface.firebaseapp.com",
        databaseURL: "https://dev-watchdog-user-interface.firebaseio.com",
        projectId: "dev-watchdog-user-interface",
        storageBucket: "dev-watchdog-user-interface.appspot.com",
        messagingSenderId: "830658011085",
      };
    } else {
      var config = {
          apiKey: "AIzaSyCNAlmG-FswW0FVnhoIPABrU_HXhkUlrbs",
          authDomain: "watchdog-user-interface.firebaseapp.com",
          databaseURL: "https://watchdog-user-interface.firebaseio.com",
          projectId: "watchdog-user-interface",
          storageBucket: "watchdog-user-interface.appspot.com",
          messagingSenderId: "193211188789",
      };
    }
    firebase.initializeApp(config);
  }

  get bi5FirebaseUidProperty() {
    var CI = this;
    return CI.IV_uid;
  }
  get bi5FirebaseGuestFlagProperty() {
    var CI = this;
    return CI.IV_is_guest;
  }
  get bi5FirebaseEmailAddressProperty() {
    var CI = this;
    return CI.IV_email_address;
  }
  get bi5TokenProperty() {
    var CI = this;
    return CI.IV_id_token;
  }

  callCallBackFunction(callback, args = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:callCallBackFunction";
    var task_id = "bi5_firebase:callCallBackFunction";
    if (callback === null) {
      return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    try {
      if (Array.isArray(args)) {
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

  bi5SetLoginPageCallbacks(signing_in = null, signed_in = null, sign_in_failed = null, passwordless_email_sent = null, passwordless_email_failed = null,
    email_valid = null, email_invalid = null, password_valid = null, password_invalid = null, create_user_failed = null, password_reset_sent = null,
    password_reset_failed = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5SetLoginPageCallbacks";
    var task_id = "bi5_firebase:bi5SetLoginPageCallbacks";
    var CI = this;

    var callback_id_list = [
      'signing_in', 'signed_in', 'sign_in_failed',
      'passwordless_email_sent', 'passwordless_email_failed',
      'email_valid', 'email_invalid', 'password_valid', 
      'password_invalid', 'create_user_failed', 'password_reset_sent', 
      'password_reset_failed'
    ]
    var callback_list = [
      signing_in, signed_in, sign_in_failed, passwordless_email_sent, 
      passwordless_email_failed, email_valid, email_invalid, 
      password_valid, password_invalid, create_user_failed, 
      password_reset_sent, password_reset_failed
    ]

    ////// if a callback is set validate and store its reference, otherwise set that callback to null
    for (var index in callback_list) {
      if (callback_list[index] === null) {
        CI.IV_login_page_callbacks[callback_id_list[index]] = null;
        continue;
      }

      call_result = bi1_data_validation.is_function(callback_list[index]);
      debug_data.push(call_result);
      if (call_result[CR.success] === RC.success) {
        CI.IV_login_page_callbacks[callback_id_list[index]] = callback_list[index];
      } else {
        CI.IV_login_page_callbacks[callback_id_list[index]] = null;
      }
    }
    //////</end> if a callback is set validate and store its reference, otherwise set that callback to null

    /////// input validation
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
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    /////</end> input validation

    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  
  bi5SetSitePageCallbacks(signing_in = null, signed_in = null, sign_in_failed = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5SetSitePageCallbacks";
    var task_id = "bi5_firebase:bi5SetSitePageCallbacks";
    var CI = this;

    var callback_id_list = ['signing_in', 'signed_in', 'sign_in_failed']
    var callback_list = [signing_in, signed_in, sign_in_failed]

    ////// if a callback is set validate and store its reference, otherwise set that callback to null
    for (var index in callback_list) {
      if (callback_list[index] === null) {
        CI.IV_site_page_callbacks[callback_id_list[index]] = null;
        continue;
      }

      call_result = bi1_data_validation.is_function(callback_list[index]);
      debug_data.push(call_result);
      if (call_result[CR.success] === RC.success) {
        CI.IV_site_page_callbacks[callback_id_list[index]] = callback_list[index];
      } else {
        CI.IV_site_page_callbacks[callback_id_list[index]] = null;
      }
    }
    //////</end> if a callback is set validate and store its reference, otherwise set that callback to null

    /////// input validation
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
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    /////</end> input validation

    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  setSignedInGlobalCallback(callback = null) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi5_firebase:setSignedInGlobalCallback ";
    var task_id = "bi5_firebase:setSignedInGlobalCallback";
    var CI = this;
    call_result = bi1_data_validation.is_function(callback);
    debug_data.push(call_result);
    
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    CI.IV_signed_in_global_callback = callback;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  setSignedOutGlobalCallback(callback = null) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi5_firebase:setSignedOutGlobalCallback ";
    var task_id = "bi5_firebase:setSignedOutGlobalCallback";
    var CI = this;

    call_result = bi1_data_validation.is_function(callback);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    CI.IV_signed_out_global_callback = callback;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  bi5SetTokenUpdatedCallback(callback = null) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi5_firebase:bi5SetTokenUpdatedCallback ";
    var task_id = "bi5_firebase:bi5SetTokenUpdatedCallback";
    var CI = this;

    call_result = bi1_data_validation.is_function(callback);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    CI.IV_token_updated_global_callback = callback;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  bi5InitFirebase() {
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5InitFirebase";
    var task_id = "bi5_firebase:bi5InitFirebase";
    var CI = this;

    if (CI.IV_initialized === true) {
      return_msg += "attempt to call bi5InitFirebase after the instance has already been initialized";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      //we return success here because an instance already exists, so any code after calling this function should still work
      return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    }

    firebase.auth().onAuthStateChanged(
      CI.bi5OnAuthStateChanged.bind(CI),
      CI.bi5FirebaseError.bind(CI)
    );
    CI.IV_initialized = true;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  bi5OnAuthStateChanged(user) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5OnAuthStateChanged";
    var task_id = "bi5_firebase:bi5OnAuthStateChanged";
    var user_auth_flag = false;

    var CI = this;
    /////determine user sign in state logic

    //if the global email var is set it should match user.email. the wrong user is logged in

    if (user_auth_flag === false && user !== null && user.email !== null && email !== null && email !== undefined && user.email !== email) {
      user_auth_flag = false;
    }
    // if the user is not null and the email isn't null but the global email is null this is a page reresh
    else if (user_auth_flag === false && user !== null && user.email !== null) {
      user_auth_flag = true;
    }

    /////</end> determine user sign in state logic

    /////passwordless login with email link
    if (user_auth_flag === false && firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again.
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      firebase.auth().signInWithEmailLink(email, window.location.href).then(
        function (result) {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          user_auth_flag = true;
          return;
        })
        .catch(function (error) {
          alert("error logging in with sign in link. Error: " + error);
          return;
        });
    }
    /////</end> passwordless login with email link

    ///// look for the sign in flags
    var login_flag = false;

    var pathname = window.location.pathname.toLowerCase();
    //this detects email link logins
    if (pathname.indexOf('apiKey=') === 0) {
      login_flag = true;
    }
    if (pathname.indexOf('mode=') === 0) {
      login_flag = true;
    }
    // public pages don't load as guest
    if (pathname.toLowerCase().indexOf('/login') === 0 ||
        pathname.toLowerCase().indexOf('/home~' ) === 0 ||
        pathname.toLowerCase().indexOf('/about~' ) === 0 ||
        pathname.toLowerCase().indexOf('/downloads~' ) === 0) {
        login_flag = true;
    }

    if (pathname.toLowerCase().indexOf('/automatic_user_creation/') === 0) {
      login_flag = true;
    }
    ///// look for the sign in flags

    ///// anonymous login logic
    if (user_auth_flag === false && user === null && login_flag === false) {
      CI.bi5GuestSignIn()
      return;
    }

    if (user !== null && user.isAnonymous === true && (login_flag === false || CI.IV_guest_login_requested === true)) {
      user_auth_flag = true;
    }
    /////</end> anonymous login logic

    //// user is signed in or an anonymous user
    if (user_auth_flag === true) {
      //// set user information from firebase object
      if (user.isAnonymous === true) {
          CI.IV_user_is_anonymous = true;
          CI.IV_displayName = "Guest User";
          CI.IV_email_address = "guest@watchdog.dgnet.cloud";
          CI.IV_is_guest = true;
      } else {
          CI.IV_is_guest = false;
          CI.IV_email_address = user.email;
          CI.IV_emailVerified = user.emailVerified;
          CI.IV_photoURL = user.photoURL;
      }
      CI.IV_uid = user.uid;
      CI.IV_providerData = user.providerData;
      ////</end> set user information from firebase object

      ////// if they are a guest, set guest name. if they are a user separate display name into first and last name
      if (user.displayName === null) {
        CI.IV_first_name = "DGnet Watchdog User";
        CI.IV_last_name = " ";
        CI.IV_displayName = "DGnet Watchdog User";
      } else {
        CI.IV_displayName = user.displayName;
        if (CI.IV_displayName.indexOf(" ") > 0) {
          CI.IV_first_name = CI.IV_displayName.substring(
              0,
              CI.IV_displayName.indexOf(" ")
          );
          CI.IV_last_name = CI.IV_displayName.substring(
              CI.IV_displayName.indexOf(" ") + 1,
              CI.IV_displayName.length
          );
        } else {
          CI.IV_first_name = CI.IV_displayName;
          CI.IV_last_name = " ";
        }
      }
      //////</end> if they are a guest, set guest name. if they are a user separate display name into first and last name
      if (CI.IV_token_verification_loop_active === true) {
        CI.bi5forceTokenRefresh()
      } else {
        CI.bi5forceTokenRefresh(true /*this param starts the verifaciton loop every X minutes*/)
      }

      return;
    }
    //// user is signed in or an anonymous user

    //if another tab signed the user out this will catch it
    if (user_auth_flag === false && CI.IV_signout_requested_flag === false && CI.IV_token_update_count > 1) {
      CI.IV_token_update_count = 0;
      CI.callCallBackFunction(CI.IV_signed_out_global_callback);
    }
  }

  bi5AttemptPasswordSignIn(email_address = null, password = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5AttemptPasswordSignIn";
    var task_id = "bi5_firebase:bi5AttemptPasswordSignIn";
    var CI = this;
    ///// input validation
    call_result = bi1_data_validation.is_email_address(email_address);
    debug_data.push(call_result);
    if (call_result["success"] !== RC.success) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_invalid'])
      return false;
    } else {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_valid'])
    }

    call_result = bi1_data_validation.is_string(password);
    debug_data.push(call_result);
    if (call_result["success"] === RC.success && password.length > 0) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['password_valid'])
    } else {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['password_invalid'])
      return false;
    }
    /////</end> input validation
    
    CI.IV_token_update_count = 0;
    CI.IV_guest_login_requested = false;
    CI.IV_token_verification_loop_active = false;
    firebase.auth().signInWithEmailAndPassword(email_address, password).then(
      function (user) { }.bind(CI),
      function (error) {
        CI.callCallBackFunction(CI.IV_login_page_callbacks['sign_in_failed'], error)
        CI.callCallBackFunction(CI.IV_site_page_callbacks['sign_in_failed'], error)
      }.bind(CI)
    );
    return true;
  }

  bi5AttemptPasswordlessSignIn(email_addresss = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5AttemptPasswordlessSignIn";
    var task_id = "bi5_firebase:bi5AttemptPasswordlessSignIn";
    var CI = this;

    ////// input validation
    call_result = bi1_data_validation.is_email_address(email_addresss);
    debug_data.push(call_result);
    if (call_result["success"] !== RC.success) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_invalid'])
      return;
    } else {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_valid'])
    }
    //////</end> input validation

    var actionCodeSettings = {
      url: window.location.href,
      //per documentaiotn this must be true.
      handleCodeInApp: true
    };
    localStorage.removeItem('firebase_token');
    localStorage.removeItem('firebase_token_expiration');
    CI.IV_token_update_count = 0;
    CI.IV_guest_login_requested = false;
    CI.IV_token_verification_loop_active = false;
    firebase.auth().sendSignInLinkToEmail(email_addresss, actionCodeSettings).then(
      function () {
        // Save the email locally so you don't need to ask the user for it again
        window.localStorage.setItem("emailForSignIn", email_addresss);
        CI.callCallBackFunction(CI.IV_login_page_callbacks['passwordless_email_sent']);
      }.bind(CI))
      .catch(function (error) {
        CI.callCallBackFunction(CI.IV_login_page_callbacks['passwordless_email_failed'], error);
      }.bind(CI));
  }

  bi5GuestSignIn() {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5GuestSignIn";
    var task_id = "bi5_firebase:bi5GuestSignIn";
    var CI = this;
    CI.IV_token_update_count = 0;
    CI.IV_guest_login_requested = true;
    //if they are already signed in as a guest manually run the auth changed state
    var user = firebase.auth().currentUser;
    if ( user !== null && firebase.auth().currentUser.isAnonymous){
      CI.callCallBackFunction(CI.IV_login_page_callbacks['signed_in']);
      return;
    }
    
    localStorage.removeItem('firebase_token');
    localStorage.removeItem('firebase_token_expiration');
    CI.IV_token_verification_loop_active = false;
    firebase.auth().signInAnonymously().then(
      function (result) {
        return; //onauth handler will handle the success
      })
      .catch(function (error) {
        CI.callCallBackFunction(CI.IV_login_page_callbacks['sign_in_failed'], error);
        return_msg += "guest sign in failed with error:" + JSON.stringify(error);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return;
      });
    }

  bi5CreateUser(email = null, password = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5CreateUser";
    var task_id = "bi5_firebase:bi5CreateUser";
    var CI = this;
    CI.IV_token_update_count = 0;
    CI.IV_guest_login_requested = false;
    
    ////// input validation
    call_result = bi1_data_validation.is_email_address(email);
    debug_data.push(call_result);
    if (call_result[CR.success] === RC.success) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_valid']);
    } else {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_invalid']);
      return false;
    }

    call_result = bi1_data_validation.is_string(password,1,100);
    debug_data.push(call_result);
    if (call_result[CR.success] === RC.success) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['password_valid']);
    } else {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['password_invalid']);
      return false;    
    }
    //////</end> input validation

    localStorage.removeItem('firebase_token');
    localStorage.removeItem('firebase_token_expiration');
    CI.IV_token_update_count = 0;
    CI.IV_guest_login_requested = false;
    CI.IV_token_verification_loop_active = false;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['create_user_failed'], error)
      return_msg += "user creation failed with error:" + JSON.stringify(error);
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return;
    });
  }

  bi5ResetPassword(email_addresss = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5ResetPassword";
    var task_id = "bi5_firebase:bi5ResetPassword";
    var CI = this;
    
    ////// input validation
    call_result = bi1_data_validation.is_email_address(email_addresss);
    debug_data.push(call_result);
    if (call_result["success"] !== RC.success) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_invalid'])
      return;
    } else {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['email_valid'])
    }
    //////</end> input validation
    
    firebase.auth().sendPasswordResetEmail(email_addresss).then(function () {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['password_reset_sent'])
    }).catch(function (error) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['password_reset_failed'], error)
    });
  }
  bi5FirebaseError(error) {
    console.log(error);
  }

  bi5forceTokenRefresh(start_verification_loop=false,callback_function=null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5forceTokenRefresh";
    var task_id = "bi5_firebase:bi5forceTokenRefresh";
    var CI = this;

    //once someone is logged out we don't refresh their token
    var firebase_user = firebase.auth().currentUser
    if ( firebase_user === null) {
      CI.IV_token_verification_loop_active  = false;
      return;
    }

    var date_object = new Date();
    var now_time = (date_object.getTime() /1000);
    if (CI.IV_next_token_refresh > now_time) {
      setTimeout(function () { CI.bi5forceTokenRefresh(start_verification_loop,callback_function); }.bind(CI), 2000);
      return;
    }
    var stored_token_expiration = localStorage.getItem('firebase_token_expiration');
    if (stored_token_expiration !== null) {
      stored_token_expiration === JSON.parse(stored_token_expiration);
    }

    if (
      stored_token_expiration !== null && 
      Object.is(parseInt(stored_token_expiration), NaN) && 
      stored_token_expiration > now_time
    ) {
      var stored_token = localStorage.getItem('firebase_token');
      if (stored_token !== null && CI.IV_next_token_refresh < now_time) {
        stored_token = JSON.parse(stored_token)
        CI.IV_id_token = stored_token;
        CI.IV_token_received = true;
        CI.bi5VerifyToken(start_verification_loop,callback_function);
        return;
      }      
    }

    firebase.auth().currentUser.getIdToken(true).then(
      function (accessToken) {
        CI = this;
        CI.IV_id_token = accessToken;
        CI.IV_token_received = true;
        CI.bi5VerifyToken(start_verification_loop);
      }.bind(CI))
    .catch(
      function (error) {
        CI = this;
        return_msg+= "firebase.auth().currentUser.getIdToken failed" + JSON.stringify(error);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        
        CI.IV_token_received = false;
        setTimeout(function () { CI.bi5forceTokenRefresh(); }.bind(CI), 1500);
      }.bind(CI)
    );
  }

  bi5SignOut() {
    var debug_data = [];
    var call_result = {};
    var task_id = "base_i5_firebase_auth:bi5SignOut:";
    var return_msg = "base_i5_firebase_auth:bi5SignOut: ";
    var CI = this;
   
    localStorage.removeItem('firebase_token');
    localStorage.removeItem('firebase_token_expiration');
    CI.IV_signout_requested_flag = true;
    firebase.auth().signOut().then(
      function () {
        CI.IV_token_update_count = 0;
        CI.IV_token_verified = false;
        CI.IV_token_received = false;
        CI.IV_guest_login_requested = false;
        CI.IV_token_verification_loop_active = false;
        CI.IV_is_guest = false;
        CI.callCallBackFunction(CI.IV_signed_out_global_callback());
      },
      function (error) {
        return_msg += "failed to signout." + JSON.stringify(error);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }
    );
  }

  first_time_verification_run() {
    var CI = this;
    var call_result = {};
    var debug_data = [];
    if (CI.IV_token_received === true && CI.IV_token_verified === true) {
      CI.callCallBackFunction(CI.IV_signed_in_global_callback, CI);
      CI.callCallBackFunction(CI.IV_login_page_callbacks['signed_in']);
      CI.callCallBackFunction(CI.IV_site_page_callbacks['signed_in']);
    }
  }

  bi5VerifyToken(start_verification_loop=false,callback_function=null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi5_firebase:bi5VerifyToken";
    var task_id = "bi5_firebase:bi5VerifyToken";
    var CI = this;

    //show the signing in feedback
    if (CI.IV_token_update_count === 0) {
      CI.callCallBackFunction(CI.IV_login_page_callbacks['signing_in'])
      CI.callCallBackFunction(CI.IV_site_page_callbacks['signing_in'])
    }
    ajax({
      url: window.G_ajax_test_domain + "/json-requests/p2s7t1-oauth2-verify",
      method: "POST",
      dataType: "text",
      data: {
        p2s7_token: CI.IV_id_token,
        p2s7_firebase_email: CI.IV_email_address,
      },

      success: function (result) {
        CI = this;
        CI.IV_token_verified = true;
        localStorage.setItem('firebase_token',JSON.stringify(CI.IV_id_token));
        var date_object = new Date();
        localStorage.setItem('firebase_token_expiration',JSON.stringify((date_object.getTime() /1000) + CI.CV_token_refresh_time ));
        CI.IV_next_token_refresh = (date_object.getTime() /1000) + CI.CV_token_refresh_time;
        if (CI.IV_token_update_count === 0) {
          CI.first_time_verification_run();
        }

        CI.IV_token_update_count += 1;
        CI.callCallBackFunction(CI.IV_token_updated_global_callback);
        CI.callCallBackFunction(callback_function);

        if(start_verification_loop === true) {
          setTimeout(function () { CI.bi5forceTokenRefresh(start_verification_loop); }.bind(CI),2000);
          CI.IV_token_verification_loop_active = true;
        }
      }.bind(CI),
      error: function (result) {
        return_msg += "could not verify token." + JSON.stringify(result);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
        CI.IV_token_verified = false;
        setTimeout(function () { CI.bi5forceTokenRefresh(start_verification_loop); }.bind(CI), 2000);
        CI.IV_next_token_refresh = 0;
        localStorage.removeItem('firebase_token');
        localStorage.removeItem('firebase_token_expiration');
      }.bind(CI),
    });
  }
}

export default bi5_firebase;
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") {
  window.loaded_includes = {};
}
window.loaded_includes["base_i5"] = true;