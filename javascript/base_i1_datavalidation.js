/* eslint-disable */
import { CR, RC } from './base_i2_success_codes'
class bi1_data_validation {

  static is_email_address(email_address) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:email_address ";

    if (typeof email_address !== 'string') {
      return_msg += "email address should be a string but this value is a '" + typeof email_address + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)$/.test(email_address) !== true) {
      return_msg += "email address failed regexp check. email:'" + email_address + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    } else {
      return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
    }
  };

  static is_string(value,min_length=null,max_length=null) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_string ";

    if (typeof value !== 'string') {
      return_msg += "string should be a string but this value is a '" + typeof value + "'. value:" + JSON.stringify(value);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    if (typeof min_length === 'number' && value.length < min_length) {
      return_msg += "string should more than " + min_length.toString() + " in length, however its " + value.length + ". value:" + typeof value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    if (typeof max_length === 'number' && value.length > max_length) {
      return_msg += "string should less than " + max_length.toString() + " in length, however its " + value.length + ". value:" + typeof value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }


  static is_string_number(value, include_float) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_string_number ";
    var call_result = {};

    //verify its a string
    call_result = bi1_data_validation.is_string(value);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }
    if (typeof include_float !== "undefined") {
      if (typeof include_float !== "boolean") {
        return_msg += "argument include_float should be boolean; instead it is '" + typeof include_float + "'.";
        return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data};
      }
      value = value.replace(".", "")
    }

    if (/^\d+$/.test(value) !== true){
      return_msg += "string should be all numbers " +
        (include_float ? "with max 1 point " : "") +
        "but it is '" + value + "'" ;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static is_number(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_number ";
    if (typeof value !== 'number') {
        return_msg += "number should be a number but this value is a '" + typeof value + "'." ;
        return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static is_org_uid(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_org_uid ";
    var call_result = {};
    //verify its a string
    call_result = bi1_data_validation.is_string(value);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify it starts with org_
    if (value.indexOf('org_') !== 0) {
      return_msg += "an organization uid should start with 'org_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify there is only a number after org_
    var after_prefix = value.substring(value.indexOf("_") + 1);
    if (Object.is(parseInt(after_prefix), NaN)) {
      return_msg += "an organization uid should have a number after 'org_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }



  static is_system_uid(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_system_uid ";
    var call_result = {};
    //verify its a string
    call_result = bi1_data_validation.is_string(value);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify it starts with sys_
    if (value.indexOf('sys_') !== 0) {
      return_msg += "a system uid should start with 'sys_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify there is only a number after sys_
    var after_prefix = value.substring(value.indexOf("_") + 1);
    if (Object.is(parseInt(after_prefix), NaN)) {
      return_msg += "a system uid should have a number after 'sys_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static is_user_uid(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_user_uid ";
    var call_result = {};
    //verify its a string
    call_result = bi1_data_validation.is_string(value);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify it starts with the right prefix
    if (value.indexOf('usr_') !== 0) {
      return_msg += "a user uid should start with 'usr_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify there is only a number after prefix
    var after_prefix = value.substring(value.indexOf("_") + 1);
    if (Object.is(parseInt(after_prefix), NaN)) {
      return_msg += "a user uid should have a number after 'usr_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static is_object_uid(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_object_uid ";
    var call_result = {};
    //verify its a string
    call_result = bi1_data_validation.is_string(value);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify it starts with org_
    if (value.indexOf('obj_') !== 0 || value.indexOf('obj_atr_') >= 0) {
      return_msg += "an object uid should start with 'obj_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify there is only a number after org_
    var after_prefix = value.substring(value.indexOf("_") + 1);
    if (Object.is(parseInt(after_prefix), NaN)) {
      return_msg += "an object uid should have a number after 'obj_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }


  static is_object_attribute_uid(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_object_attribute_uid ";
    var call_result = {};
    //verify its a string
    call_result = bi1_data_validation.is_string(value);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify it starts with obj_atr_
    if (value.indexOf('obj_atr_') !== 0) {
      return_msg += "an object uid should start with 'obj_atr_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify there is only a number after obj_atr_
    var after_prefix = value.substring(value.lastIndexOf("_") + 1);
    if (Object.is(parseInt(after_prefix), NaN)) {
      return_msg += "an object uid should have a number after 'obj_atr_' this value does not. value:" + value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static element_id_list(values) {
    var debug_data = [];
    var task_id = "bi1_data_validation:element_id_list";
    var return_msg = "bi1_data_validation:element_id_list ";
    var call_result = {};
    if (Array.isArray(values) === false) {
      return_msg += "element IDs list should be an array but this value is a '" + typeof value + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    var validation_failed = false;
    var loop1 = 0;
    for (loop1 = 0; loop1 < values.length; loop1++) {
      call_result = bi1_data_validation.element_id(values[loop1])
      debug_data.push(call_result);
      if (call_result['success'] !== RC.success) {
        return_msg += " .input validation failed on values[" + loop1 + "] ";
        validation_failed = true;
      }
    }

    if (validation_failed === true) {
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  };

  static is_function(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_function ";
    if (typeof value !== 'function') {
      return_msg += "a function should be type function but this value is a '" + typeof value + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static element_id(value) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:element_id ";
    if (typeof value !== 'string') {
      return_msg += "element IDs should be strings but this value is a '" + typeof value + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    if (value.length < 1) {
      return_msg += "element ID is an empty string";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    var element = document.getElementById(value);
    if (element === null) {
      return_msg += "specified elmement_id does not exist. element_id:'" + value + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  };

  static is_appropriate_time(time_frame_type, time, all_time_frames) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi1_data_validation:is_appropriate_time ";

    //// input validation
    call_result = bi1_data_validation.is_string(time_frame_type);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    if (!Object.keys(all_time_frames).includes(time_frame_type)) {
      return_msg += "type of time cannot be '" + time_frame_type + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };


    //verify the end time is within range
    call_result = bi1_data_validation.is_number(time);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    if (time < all_time_frames[time_frame_type][0] || time > all_time_frames[time_frame_type][1]) {
      return_msg += "time type of '" + time_frame_type + "' " +
        "should be inside of [" + all_time_frames[time_frame_type] + "] but it is '" + time + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  };

  static is_appropriate_time_frame(time_frame_type, time_frame, all_time_frames) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi1_data_validation:is_appropriate_time_frame ";

    //// input validation
    call_result = bi1_data_validation.is_string(time_frame_type);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    if (!Object.keys(all_time_frames).includes(time_frame_type)) {
      return_msg += "type of time frame cannot be '" + time_frame_type + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    if (!Array.isArray(time_frame)) {
      return_msg += "time frame should be an array but it is a '" + typeof time_frame + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    if (time_frame.length !== 2) {
      return_msg += "time frame should have two values but it has '" + time_frame.length + "' value(s)";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    //verify the start time is within range
    call_result = bi1_data_validation.is_appropriate_time(time_frame_type, time_frame[0], all_time_frames);
    debug_data.push(call_result);
    if(call_result[CR.success] !== RC.success) {
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    //verify the end time is within range
    call_result = bi1_data_validation.is_appropriate_time(time_frame_type, time_frame[1], all_time_frames);
    debug_data.push(call_result);
    if(call_result[CR.success] !== RC.success) {
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    // verify if stop time is greater then start time
    if (time_frame[0] <= time_frame[1] !== true) {
      return_msg += "time frame stop time should be greater then start time";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  };

  static is_array(value, min_length, max_length) {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_array ";
    if (!Array.isArray(value)) {
      return_msg += "array should be an array but this value is a '" + typeof value + "'";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    };

    if(typeof min_length === 'number' && value.length < min_length) {
      return_msg += "array should more than " + min_length.toString() + " in length, however its " + value.length + ". value:" + typeof value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };

    }
    if(typeof max_length === 'number' && value.length > max_length) {
      return_msg += "array should less than " + max_length.toString() + " in length, however its " + value.length + ". value:" + typeof value;
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };

    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  static is_not_null(value, value_name="Value") {
    var debug_data = [];
    var return_msg = "bi1_data_validation:is_not_null ";
    if (value === null || value === undefined) {
      return_msg += "Value should not be null or undefined. " + value_name + " is undefined or null";
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }
};



export default bi1_data_validation
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
window.loaded_includes['base_i1'] = true;
