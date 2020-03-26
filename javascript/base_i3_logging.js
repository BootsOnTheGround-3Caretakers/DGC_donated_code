/* eslint-disable */
function base_i3_log(username = " ", ip = " ", page_id = " ", task_id = " ", success_code = RC.general_failure, msg = " ", debug_data = " ") {
  var log_msg = "username:" + username + " ip:" + ip + " page_id:" + page_id + " task_id:" + task_id + " success_code:" + success_code + " msg:" + msg + " debug_data:" + JSON.stringify(debug_data);
  console.log(log_msg);
  //window.document.write(log_msg);
}


export default base_i3_log
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes == "undefined") { window.loaded_includes = {} }
window.loaded_includes['base_i3'] = true;