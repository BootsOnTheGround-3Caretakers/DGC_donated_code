/* eslint-disable */
import { CR, RC, AJRS } from "./base_i2_success_codes";
import bi1_data_validation from "./base_i1_datavalidation";
import base_i3_log from "./base_i3_logging";

class bi6_misc_functions {

  // this function is from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
  //thank you Ege Özcan
  static bi6ListPropertySort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      var result = (a[property] < b[property]) ? - 1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  // this function is from https://coderwall.com/p/w22s0w/recursive-merge-flatten-objects-in-plain-old-vanilla-javascript
  //thank you Mike Timofiiv
  static bi6MergeObjects(objects) {
    var out = {};
  
    for (var i = 0; i < objects.length; i++) {
      for (var p in objects[i]) {
        out[p] = objects[i][p];
      }
    }

    return out;
  }

  // this function is from https://coderwall.com/p/w22s0w/recursive-merge-flatten-objects-in-plain-old-vanilla-javascript
  //thank you Mike Timofiiv
  static bi6FlattenObject(obj,max_depth=0,current_depth=0,name, stem) {
    current_depth+=1
    var CI = this;
    var out = {};
    var newStem = (typeof stem !== 'undefined' && stem !== '') ? stem + '|' + name : name;
  
    if (typeof obj !== 'object' || (max_depth !== 0 && current_depth >= max_depth)) {
      out[newStem] = obj;
      return out;
    }
  
    for (var p in obj) {
      var prop = bi6_misc_functions.bi6FlattenObject(obj[p],max_depth,current_depth, p, newStem);
      out = bi6_misc_functions.bi6MergeObjects([out, prop]);
    }
  
    return out;
  };

  static bi6UtcToLocalTime(timestamp) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi6_misc_functions:bi6UtcToEstTime ";
    var task_id = "bi6_misc_functions:bi6UtcToEstTime";

    ////// input validation 
    call_result = bi1_data_validation.is_number(timestamp);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
        return '';
    }
    //////</end> input validation
    
    //// check if the browser supports locales
    var locales_support = false;
    try {
      new Date().toLocaleTimeString('i');
    } catch (error) {
      if (error.name === 'RangeError') {
        locales_support = true;
      }
    }
    
    var date_object = new Date(timestamp * 1000);
    if (locales_support) {
      return date_object.toLocaleDateString() + ' ' + date_object.toLocaleTimeString();
    } else { }
  }

  static bi6setCharAt(str,index,chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  static bi6BeautifyRxTxDateTime(cpuDateTime, dbEntryTime) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi6_misc_functions:bi6BeautifyRxTxDateTime ";
    var task_id = "bi6_misc_functions:bi6BeautifyRxTxDateTime";
    var formattedDate = null;

    ////// input validation 
    call_result = bi1_data_validation.is_string(cpuDateTime);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
        return_msg += "input validation failed";
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
          return '';
    }
    //////</end> input validation

    // cpuDateTime = "2017/7/17/3-05-37"
    var separatorIndex = cpuDateTime.indexOf("-");
    var datePart = cpuDateTime.substr(0,separatorIndex).split("/");
    var timePart = cpuDateTime.substr(separatorIndex+1).split("-");

    // removing first empty value from array.
    //datePart.shift();

    // ["2017", "7", "17", "3", "7", "5"]
    var partsArray = datePart.concat(timePart); 
    formattedDate = new Date(
                      partsArray[0],
                      partsArray[1] - 1,
                      partsArray[2],
                      partsArray[3],
                      partsArray[4],
                      partsArray[5]
                    ).getTime();

    /// adding offset to "cpu entry time" by UTC epoch timestamp from "DB entry time key".
    let offset = new Date(dbEntryTime) - formattedDate;

    return new Date(formattedDate + offset);
    ///</end> adding offset to "cpu time" by UTC epoch timestamp from "DB entry time key".
  }
}

export default bi6_misc_functions