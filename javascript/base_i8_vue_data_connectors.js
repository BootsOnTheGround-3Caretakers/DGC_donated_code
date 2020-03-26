/* eslint-disable */
import { CR, RC, AJRS } from './base_i2_success_codes'
import bi1_data_validation from './base_i1_datavalidation'
import base_i3_log from './base_i3_logging'
import checkIfWatchdogUserExists from './legacy_calls/p2s1t1_CheckIfUserExists'
import p2s1t3_CreateNewUser from './legacy_calls/p2s1t3_CreateNewUser'
import 'vue'

class bi8_vue_data_connectors {

  //when we do website updates we want don't old cached data causing issues
  static bi8LocalStorageVersionCheck(version) {
    var current_version = localStorage.getItem('watchdog_cache_version');
    
    if (current_version !== version || current_version === null) {
      localStorage.clear();
      localStorage.setItem('watchdog_cache_version',version)
      console.log('clearing local storage');
    }
  }
  static bi8SetVueUserInfoSuccess() {
    window.vue_instance.$root.$data.userInfo.firstName = window.G_watchdog_data.IV_user_info['first_name']
    window.vue_instance.$root.$data.userInfo.lastName = window.G_watchdog_data.IV_user_info['last_name']
    window.vue_instance.$root.$data.userInfo.contactEmail =  window.G_watchdog_data.IV_user_info['contact_email']
    
    if (window.vue_instance.$root.$data.userInfo.uid !== window.G_watchdog_data.IV_user_info['uid']) {
      window.vue_instance.$root.$data.userInfo.uid = window.G_watchdog_data.IV_user_info['uid']
      window.G_watchdog_data.InitOrgListeners()
      window.G_watchdog_data.bi7initRulesListener()
      window.G_watchdog_data.bi7initNotificationRuleJoinsListener()
      window.G_watchdog_data.bi7InitAccountNotificationsListener()
      window.vue_instance.$root.$data.watchdog.watchdogDbConnected = true;
    }
  }

  static bi8SignInCallback() {
    if (window.G_firebase_auth.IV_token_received === false || typeof G_firebase_auth.IV_uid !== 'string' ||  G_firebase_auth.IV_uid.length < 5) {
      setTimeout(bi8_vue_data_connectors.bi8SignInCallback,300);
    }
    window.vue_instance.$root.$data.userInfo.isGuest = window.G_firebase_auth.IV_is_guest;
    window.vue_instance.$root.$data.userInfo.authenticated = window.G_firebase_auth.IV_token_received;

    window.G_watchdog_data.setFirebaseParams(
      window.firebase.database(),
      window.G_firebase_auth.bi5TokenProperty,
      window.G_firebase_auth.bi5FirebaseUidProperty,
      window.G_firebase_auth.bi5FirebaseEmailAddressProperty,
      window.G_firebase_auth.bi5FirebaseGuestFlagProperty
    );

    //refresh user info
    if(!G_firebase_auth.IV_is_guest) {
      checkIfWatchdogUserExists(window.G_firebase_auth.IV_email_address).then(
        function(){},
        function() {
          p2s1t3_CreateNewUser(
            G_firebase_auth.IV_email_address, 
            G_firebase_auth.IV_first_name,
            G_firebase_auth.IV_last_name,
            G_firebase_auth.IV_uid
          ); 
        }
      );
    }
    window.G_watchdog_data.InitUserInfoListener();
  }

  static bi8SignOutCallback() {
    window.vue_instance.$root.$data.watchdog.watchdogDbConnected = false;
    localStorage.clear();
    localStorage.removeItem('vuex');
    location.assign(window.location.origin + '/');
  }

  static bi8FirebaseTokenUpdatedCallback() {
    window.G_watchdog_data.bi7SetFirebaseToken(G_firebase_auth.bi5TokenProperty);
  }
}

export default bi8_vue_data_connectors
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
window.loaded_includes['base_i8'] = true;
