/* eslint-disable */
class CallResultsFields {}

CallResultsFields.success = 'success'
CallResultsFields.return_msg = 'return_msg'
CallResultsFields.debug_data = 'debug_data'

class ReturnCodes {}

// anything below this number is retried, above is perma-failed
ReturnCodes.retry_threshold = 1000
ReturnCodes.success = 1
ReturnCodes.failed_retry = 0
ReturnCodes.general_failure = 2
ReturnCodes.input_validation_failed = 1001
ReturnCodes.ACL_check_failed = 1002
ReturnCodes.firebase_failure = 3
ReturnCodes.authError = 5
ReturnCodes.ajax_failure = 6


// used for ajax requests
class AjaxRequestStatus {}
AjaxRequestStatus.data_not_set = 0
AjaxRequestStatus.invalid_data = 1
AjaxRequestStatus.data_sent = 2
AjaxRequestStatus.success = 3
AjaxRequestStatus.failure = 4

export {CallResultsFields as CR, ReturnCodes as RC, AjaxRequestStatus as AJRS}
// once the file is loaded put it in the list of loaded includes

if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
window.loaded_includes['base_i2'] = true
