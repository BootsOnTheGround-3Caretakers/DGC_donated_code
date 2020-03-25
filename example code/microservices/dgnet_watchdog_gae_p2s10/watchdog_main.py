from __future__ import absolute_import
from __future__ import unicode_literals

import datetime
import json
import logging
import os
import sys
import time

from six import integer_types
from six import text_type as unicode

if len(integer_types) == 1:
    long = integer_types[0]
import flask
from google.cloud import ndb
import stripe

import memorystore
import secret
from webapp_class_wrapper import wrap_webapp_class

sys.path.insert(0, 'includes')

from datavalidation import DataValidation
from GCP_return_codes import FunctionReturnCodes as RC
from GCP_datastore_logging import LoggingFuctions
from back_end_global_settings import GlobalSettings as GSB
from billing_services import TaskNames as BillingTasks
from billing_services import TaskArguments as BillingTaskArguments
from datastore_functions import DatastoreFunctions as DSF
from task_queue_functions import CreateTransactionFunctions as CTF
from user_interface_global_settings import GlobalSettings as GSU
from user_interface_replicated_datastores import ReplicatedDatastores as RDS

APP_ID = unicode(os.environ.get('GAE_APPLICATION')).lower()
DEV_FLAG = ""
G_CORS_ALLOWED_FLAG = False
if "dev-" in APP_ID:
    DEV_FLAG = "dev-"
    G_CORS_ALLOWED_FLAG = True

ndb_client = ndb.Client()


class OauthVerify(object):
    def VerifyToken(self):
        task_id = "stripe-billing:OauthVerify:VerifyToken"
        return_msg = 'stripe-billing:OauthVerify:VerifyToken: '
        debug_data = []
        authenticated = False

        call_result = self.VerifyTokenProcessRequest()
        authenticated = call_result['authenticated']
        debug_data.append(call_result)

        if call_result['success'] != RC.success:
            params = {}
            for key in self.request.arguments():
                params[key] = self.request.get(key, None)

            log_class = LoggingFuctions()
            log_class.logError(call_result['success'], task_id, params, None, None, call_result['return_msg'],
                               call_result['debug_data'], None)
            if call_result['success'] == RC.failed_retry:
                self.response.set_status(500)
            elif call_result['success'] == RC.input_validation_failed:
                self.response.set_status(400)
            elif call_result['success'] == RC.ACL_check_failed:
                self.response.set_status(401)

        if authenticated == True:
            return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data,
                    'authenticated': authenticated}
        else:
            self.response.set_status(401)
            return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data,
                    'authenticated': authenticated}

    def VerifyTokenProcessRequest(self):
        return_msg = 'web-commands:OauthVerify:VerifyTokenProcessRequest '
        debug_data = []
        authenticated = False
        ## validate input
        client_token_id = unicode(self.request.get('p2s10_token', None))
        user_email = unicode(self.request.get('p2s10_firebase_email', None))

        call_result = self.checkValues([[client_token_id, True, unicode, "len>10", "len<"],
                                        [user_email, True, unicode, "email_address"]
                                        ])
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += "input validation failed"
            return {'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data,
                    'authenticated': authenticated}

        ##</end> validate input

        ## try to pull cached data
        current_time = time.mktime(datetime.datetime.now().timetuple())
        mem_client = memorystore.Client()
        try:
            verified_token_id = mem_client.get(user_email + "-token_id")
            verified_token_expiration = long(mem_client.get(user_email + "-token_expiration"))
        except:
            verified_token_id = None
            verified_token_expiration = 0

        logging.info("verified_token_id:" + unicode(verified_token_id) + "| client_token_id:" + unicode(
            client_token_id) + '|verified_token_expiration:' + unicode(
            verified_token_expiration) + '|current_time:' + unicode(current_time))
        tokens_match = False
        if verified_token_id != None and verified_token_id == client_token_id:
            tokens_match = True

        if verified_token_id != None and verified_token_id == client_token_id and verified_token_expiration > current_time:
            authenticated = True
            return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data,
                    'authenticated': authenticated}
        ##</end> try to pull cached data

        ## use the external libraray to auth
        logging.info("loading VM_oauth_external")
        from WM_oauth_external import OauthExternalVerify
        external_oauth = OauthExternalVerify()
        call_result = external_oauth.VerifyTokenID(client_token_id, user_email)
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += "oauth external call failed"
            return {'success': call_result['success'], 'return_msg': return_msg, 'debug_data': debug_data,
                    'authenticated': authenticated}

        authenticated = call_result['authenticated']
        ##</end> use the external libraray to auth

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data,
                'authenticated': authenticated}


def ndb_wsgi_middleware(wsgi_app):
    def middleware(environ, start_response):
        with ndb_client.context():
            return wsgi_app(environ, start_response)

    return middleware


app = flask.Flask(__name__)
app.wsgi_app = ndb_wsgi_middleware(app.wsgi_app)


@app.route(GSU.services.stripe_billing.create_stripe_customer.url, methods=["OPTIONS", "POST"])
@wrap_webapp_class(GSU.services.stripe_billing.create_stripe_customer.name)
class CreateStripeCustomer(DataValidation, OauthVerify):
    def options(self):
        if G_CORS_ALLOWED_FLAG:
            self.response.headers[str('Access-Control-Allow-Origin')] = str('*')
        self.response.headers[str('Access-Control-Allow-Headers')] = str(
            'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With')
        self.response.headers[str('Access-Control-Allow-Methods')] = str('POST')

    def post(self, *args, **kwargs):
        debug_data = []

        if G_CORS_ALLOWED_FLAG:
            self.response.headers[str('Access-Control-Allow-Origin')] = str('*')
        self.response.headers[str('Access-Control-Allow-Headers')] = str(
            'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With')
        self.response.headers[str('Access-Control-Allow-Methods')] = str('POST')

        call_result = self.VerifyToken()
        debug_data.append(call_result)
        if call_result['authenticated'] != RC.success:
            self.response.set_status(401)
            return

        ret = self.process_request(*args, **kwargs)
        self.response.out.write(unicode(ret))

    def process_request(self, *args, **kwargs):
        task_id = 'stripe-billing:CreateStripeCustomer:process_request: '
        return_msg = task_id
        debug_data = []

        user_email = unicode(self.request.get('p2s10_firebase_email', None))

        ## load the logged in user
        model = RDS.user
        user_query = model.query(
            ndb.OR(model.contact_email == user_email, model.google_account_name == user_email)
        )
        call_result = DSF.kfetch(user_query)
        debug_data.append(call_result)
        if not call_result['success']:
            return_msg += 'datastore fetch failed'
            return {
                'success': call_result['success'], 'debug_data': debug_data, 'return_msg': return_msg,
            }

        fetch_result = call_result['fetch_result']
        if not fetch_result:
            return_msg += 'Peneration attempt using {} detected'.format(user_email)
            return {
                'success': RC.input_validation_failed, 'debug_data': debug_data, 'return_msg': return_msg,
            }
        user = fetch_result[0]
        ##</end> load the logged in user

        # call stripe API to create a customer
        try:
            stripe.api_key = secret.get_stripe_api_secret_key()
            customer = stripe.Customer.create(
                email=user_email,
            )
            customer_id = customer['id']
        except Exception as exc:
            return_msg += 'Failed to create customer: {}'.format(exc)
            return {
                'success': RC.input_validation_failed, 'debug_data': debug_data, 'return_msg': return_msg,
            }
        #</end> call stripe API to create a customer

        ## create transaction to send organization keys
        task_sequence = [{
            'name': GSU.tasks.s3t1
        }, {
            'name': GSB.tasks.s13t1
        }, {
            'name': BillingTasks.s3t1,
            'PMA': {
                BillingTaskArguments.s3t1_customer_id: unicode(customer_id),
                BillingTaskArguments.s3t1_user_uid: unicode(user.user_uid),
            }
        }]
        try:
            task_sequence = unicode(json.JSONEncoder().encode(task_sequence))
        except Exception as e:
            return_msg += "JSON encoding of task_queue failed with exception:%s" % e
            return {'success': False, 'return_msg': return_msg, 'debug_data': debug_data}

        task_functions = CTF()
        call_result = task_functions.createTransaction(GSU.project_id, unicode(user.user_uid), task_id, task_sequence)
        debug_data.append(call_result)
        if call_result['success'] != RC.success:
            return_msg += 'failed to add task queue function'
            return {'success': call_result['success'], 'debug_data': debug_data, 'return_msg': return_msg}
        ##</end> create transaction to send organization keys

        return {'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data}


if __name__ == "__main__":
    app.run(debug=True)
