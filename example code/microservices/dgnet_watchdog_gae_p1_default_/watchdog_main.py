from __future__ import unicode_literals
import webapp2
from google.appengine.ext import ndb
from google.appengine import datastore
import logging
import os
import sys
cwd = os.getcwd()
sys.path.insert(0,'includes')


from back_end_datastores import Datastores as GSB_datastores
from datastore_functions import DatastoreFunctions as DSF
from datastore_functions import ReplicateToFirebaseFlag
from datastore_functions import ReplicateToDatastoreFlag
from GCP_return_codes import FunctionReturnCodes as RC
from GCP_datastore_logging import LoggingFuctions as LF
from task_queue_functions import TaskQueueFunctions


class P1DsReplicationCursors(ndb.Model,DSF):
    datastore_kind= ndb.StringProperty(required=True)
    _rule_datastore_kind = [True,unicode,"len>0"]
    cursor_value = ndb.StringProperty(required=True)
    _rule_cursor_value = [True,unicode,"len>0"]
    records_processed = ndb.IntegerProperty(required=True)
    _rule_records_processed = [True,long]


class ReplicateDatastoresToFirebase(webapp2.RequestHandler):
    def get(self):

        #if we cache records the system will run out of memory, also the same record is never read twice
        ndb_context = ndb.get_context()
        ndb_context.set_cache_policy(False)
        ndb_context.set_memcache_policy(False)

        logger = LF()
        exclude_large_datastores = [GSB_datastores.object_attribute_record,GSB_datastores.object_rx_tx_messages]
        #for datastore in GSB_datastores.datastore_list:
        datastore_list = [GSB_datastores.objects_attributes_joins]
        for datastore_type in datastore_list:
            if datastore_type in exclude_large_datastores:
                continue
            new_entity = datastore_type()
            if issubclass(new_entity.__class__,ReplicateToFirebaseFlag):
                datastore_kind = datastore_type._get_kind()
                cursor_storage_key = ndb.Key("firebase_" + P1DsReplicationCursors._get_kind(),datastore_type._get_kind())
                more_flag = True
                cursor = None
                records_processed = 0
                cursor_datastore_entry = P1DsReplicationCursors(id=unicode(datastore_kind))  # type: P1DsReplicationCursors
                self.response.write("processing datastore kind: " + datastore_kind + "\n")

            ##get the last cursor position from datastore
                if cursor is None:
                    call_result = DSF.kget(cursor_storage_key)
                    if call_result['success'] != RC.success:
                        self.response.write("failed to get datastore cursor key:" + datastore_kind + " | error:" + unicode(call_result) + "\n")
                        logger.logError(RC.datastore_failure,
                                        task_id="firebase_replication",
                                        error_msg= call_result['return_msg'],
                                        debug_data= call_result['debug_data'])
                        cursor = None
                        records_processed = 0
                    else:
                        if call_result['get_result'] is not None:
                            cursor_datastore_entry = call_result['get_result']
                            cursor = ndb.Cursor(urlsafe=cursor_datastore_entry.cursor_value)
                            records_processed = cursor_datastore_entry.records_processed
            ##</end> get the last cursor position from datastore

                cursor_datastore_entry.datastore_kind = unicode(datastore_kind)
            ### main loop to handle datastore entity values
                while more_flag == True:
                    entries_keys, cursor, more_flag = datastore_type.query().fetch_page(200, start_cursor=cursor, keys_only=True,
                                                                                        read_policy=ndb.EVENTUAL_CONSISTENCY)

                    if entries_keys:
                        safe_keys = []
                        for entry_key in entries_keys:
                            safe_keys.append(entry_key.urlsafe())

                        name = 'p1s0t2-replicate-datastore-entities-firebase'
                        tqf = TaskQueueFunctions()
                        call_result = tqf.add(name, 'POST', {'keys': safe_keys}, '/' + name)

                        if call_result['success'] != RC.success:
                            self.response.write("failed to add to tasks queue %s\n\n" % call_result)
                            logger.logError(RC.queuing_task_failed,
                                            task_id="firebase_replication",
                                            error_msg= call_result['return_msg'],
                                            debug_data= call_result['debug_data'])
                        else:
                            records_processed += len(entries_keys)

                    if not (more_flag and cursor):
                        break

                ##update cursor record
                    cursor_datastore_entry.cursor_value = unicode(cursor.urlsafe())
                    cursor_datastore_entry.records_processed = records_processed
                    call_result = cursor_datastore_entry.kput(replicate=False)
                    if call_result['success'] != RC.success:
                        self.response.write("failed to set datastore cursor value for:" + datastore_kind + " | error:" + unicode(call_result)  + "\n")
                        logger.logError(RC.datastore_failure,
                                        task_id="firebase_replication",
                                        error_msg= call_result['return_msg'],
                                        debug_data= call_result['debug_data'])
                ##</end>update cursor record

            ###</end> main loop to handle datastore entity values



        return


class ReplicateDatastores(webapp2.RequestHandler):
    def get(self):

        #if we cache records the system will run out of memory, also the same record is never read twice
        ndb_context = ndb.get_context()
        ndb_context.set_cache_policy(False)
        ndb_context.set_memcache_policy(False)

        logger = LF()
        #for datastore in GSB_datastores.datastore_list:
        datastore_list = [GSB_datastores.user
                          ]
        for datastore_type in datastore_list:
            new_entity = datastore_type()
            if issubclass(new_entity.__class__,ReplicateToDatastoreFlag) is False:
                continue


            datastore_kind = datastore_type._get_kind()
            cursor_storage_key = ndb.Key("datastore_" + P1DsReplicationCursors._get_kind(),datastore_type._get_kind())
            more_flag = True
            cursor = None
            records_processed = 0
            cursor_datastore_entry = P1DsReplicationCursors(id="p1s0t3-" + unicode(datastore_kind))  # type: P1DsReplicationCursors
            self.response.write("processing datastore kind: " + datastore_kind + "\n")

        ##get the last cursor position from datastore
            if cursor is None:
                call_result = DSF.kget(cursor_storage_key)
                if call_result['success'] != RC.success:
                    self.response.write("failed to get datastore cursor key:" + datastore_kind + " | error:" + unicode(call_result) + "\n")
                    logger.logError(RC.datastore_failure,
                                    task_id="datastore_replication",
                                    error_msg= call_result['return_msg'],
                                    debug_data= call_result['debug_data'])
                    cursor = None
                    records_processed = 0
                else:
                    if call_result['get_result'] is not None:
                        cursor_datastore_entry = call_result['get_result']
                        cursor = ndb.Cursor(urlsafe=cursor_datastore_entry.cursor_value)
                        records_processed = cursor_datastore_entry.records_processed
        ##</end> get the last cursor position from datastore

            cursor_datastore_entry.datastore_kind = unicode(datastore_kind)
        ### main loop to handle datastore entity values
            while more_flag == True:
                entries_keys, cursor, more_flag = datastore_type.query().fetch_page(200, start_cursor=cursor, keys_only=True,
                                                                                    read_policy=ndb.EVENTUAL_CONSISTENCY)

                if entries_keys:
                    safe_keys = []
                    for entry_key in entries_keys:
                        url_safe_key = entry_key.urlsafe()
                        safe_keys.append(url_safe_key)

                    name = 'p1s0t3-replicate-datastore-entities'
                    tqf = TaskQueueFunctions()
                    call_result = tqf.add(name, 'POST', {'keys': safe_keys}, '/' + name)

                    if call_result['success'] != RC.success:
                        self.response.write("failed to add to tasks queue %s\n\n" % call_result)
                        logger.logError(RC.queuing_task_failed,
                                        task_id="datastore_replication",
                                        error_msg= call_result['return_msg'],
                                        debug_data= call_result['debug_data'])
                    else:
                        records_processed += len(entries_keys)

                if not (more_flag and cursor):
                    break

            ##update cursor record
                cursor_datastore_entry.cursor_value = unicode(cursor.urlsafe())
                cursor_datastore_entry.records_processed = records_processed
                call_result = cursor_datastore_entry.kput(replicate=False)
                if call_result['success'] != RC.success:
                    self.response.write("failed to set datastore cursor value for:" + datastore_kind + " | error:" + unicode(call_result)  + "\n")
                    logger.logError(RC.datastore_failure,
                                    task_id="firebase_replication",
                                    error_msg= call_result['return_msg'],
                                    debug_data= call_result['debug_data'])
            ##</end>update cursor record

            ###</end> main loop to handle datastore entity values



        return



class ReplicateDatastoreEntitiesFirebase(webapp2.RequestHandler):
    def post(self):
        entries_keys = []
        for key in self.request.get_all('keys', []):
            entries_keys.append(ndb.Key(urlsafe=key))

        for entry in filter(None, ndb.get_multi(entries_keys)):
            entry.replicateEntityToFirebase()

class ReplicateDatastoreEntities(webapp2.RequestHandler):
    def post(self):
        entries_keys = []
        for key in self.request.get_all('keys', []):
            entries_keys.append(ndb.Key(urlsafe=key))

        for entry in filter(None, ndb.get_multi(entries_keys)):
            call_result = entry.replicateCreateEntityToDatastore()
            if call_result['success'] != RC.success:
                logging.debug(call_result)


class InitializeDatastore(webapp2.RequestHandler):
    def get(self):
        watchdog = GSB_datastores.organization(id="organization_1")
        watchdog.organization_name = "Watchdog"
        watchdog.organization_creator_user_uid = 1
        watchdog.organization_description = "Main organization all others must be a child of"
        watchdog.organization_uid = 1
        watchdog.organization_type = 4
        watchdog.organization_processor_key1 = "porg_00000000000001999"
        watchdog.organization_processor_key2 = "uorg_00000000000001999"
        watchdog.organization_web_uid = "worg_00000000000001999"
        watchdog.kput()

        online = GSB_datastores.object_attribute(id="obj_attr_1")
        online.organization_uid = 1
        online.attribute_name = "Communication Status"
        online.attribute_description = " "
        online.attribute_uid = 1
        self.response.write(online.kput())

        power = GSB_datastores.object_attribute(id="obj_attr_2")
        power.organization_uid = 1
        power.attribute_name = "Device Power"
        power.attribute_description = " "
        power.attribute_uid = 2
        self.response.write(power.kput())

        lamp_hours = GSB_datastores.object_attribute(id="obj_attr_3")
        lamp_hours.organization_uid = 1
        lamp_hours.attribute_name = "Lamp Hours"
        lamp_hours.attribute_description = " "
        lamp_hours.attribute_uid = 3
        self.response.write(lamp_hours.kput())

        input1 = GSB_datastores.object_attribute(id="obj_attr_4")
        input1.organization_uid = 1
        input1.attribute_name = "Active Input"
        input1.attribute_description = " "
        input1.attribute_uid = 4
        self.response.write(input1.kput())

        program_log = GSB_datastores.object_attribute(id="obj_attr_5")
        program_log.organization_uid = 1
        program_log.attribute_name = "Program Log"
        program_log.attribute_description = " "
        program_log.attribute_uid = 5
        self.response.write(program_log.kput())

        processor_log = GSB_datastores.object_attribute(id="obj_attr_6")
        processor_log.organization_uid = 1
        processor_log.attribute_name = "Processor Log"
        processor_log.attribute_description = " "
        processor_log.attribute_uid = 6
        self.response.write(processor_log.kput())

        processor_console = GSB_datastores.object_attribute(id="obj_attr_7")
        processor_console.organization_uid = 1
        processor_console.attribute_name = "Processor Console"
        processor_console.attribute_description = " "
        processor_console.attribute_uid = 7
        self.response.write(processor_console.kput())

        watchdog_connected = GSB_datastores.object_attribute(id="obj_attr_8")
        watchdog_connected.organization_uid = 1
        watchdog_connected.attribute_name = "Connected To Watchdog"
        watchdog_connected.attribute_description = " "
        watchdog_connected.attribute_uid = 8
        self.response.write(watchdog_connected.kput())


app = webapp2.WSGIApplication([
    ('/replicate_to_firebase',ReplicateDatastoresToFirebase),
    ('/replicate_to_datastore',ReplicateDatastores),
    ('/p1s0t2-replicate-datastore-entities-firebase',ReplicateDatastoreEntitiesFirebase),
    ('/p1s0t3-replicate-datastore-entities',ReplicateDatastoreEntities),
    ('/p1s0t4-init-datastores',InitializeDatastore)
], debug=True)