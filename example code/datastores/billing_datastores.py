from __future__ import unicode_literals
from google.appengine.ext import ndb
from datastore_functions import DatastoreFunctions as DSF
from back_end_settings_return_codes import FunctionReturnCodes as RC

import logging
import datetime
import string

#ReplicateToDatastore must be declared first as it inherited by other Datastores

class BillingDebug(ndb.Model,DSF):
    date = ndb.StringProperty(required=True)
    _rule_date = [True,unicode,"len1"]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"]

class DatastoreOrganizationsAchInformation(ndb.Model,DSF):
    organization_uid= ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    bank = ndb.StringProperty(required=True)
    _rule_bank = [True,unicode,"len1"]
    #~last 4 of account number
    account = ndb.IntegerProperty(required=True)
    _rule_account = [True,long,"bigint","greater0"]
    #~routing number
    routing = ndb.IntegerProperty(required=True)
    _rule_routing = [True,long,"bigint","greater0"]
    customer_id = ndb.StringProperty(required=True)
    _rule_customer_id = [True,unicode,"len>10"]

class DatastoreOrganizationsCcInformation(ndb.Model,DSF):
    organization_uid= ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    #~last 4 of Credit card number
    CC_number = ndb.IntegerProperty(required=True)
    _rule_CC_number = [True,long,"bigint","greater0"]
    #~card issuer number
    issuer = ndb.StringProperty(required=True)
    _rule_issuer = [True,unicode,"len1"]
    customer_id = ndb.StringProperty(required=True)
    _rule_customer_id = [True,unicode,"len>10"]
   
class DatastoreBillingCodeLookup(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(required=True)
    _rule_billing_code_uid = [True,long,"bigint","greater0"]
    task_uid = ndb.IntegerProperty(required=True)
    _rule_task_uid = [True,long,"bigint","greater0"]
    multiplier = ndb.FloatProperty(required=True)
    _rule_multiplier = [True,float,"greater0"]

class DatastoreTaskUIDLookup(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(repeated=True)
    _rule_billing_code_uid = [True,list,"len1"]
    task_uid = ndb.IntegerProperty(required=True)
    _rule_task_uid = [True,long,"bigint","greater0"]
    multiplier = ndb.FloatProperty(required=True)
    _rule_multiplier = [True,float,"greater0"]

class DatastoreTaskUIDs(ndb.Model,DSF):
    task_uid = ndb.IntegerProperty(required=True)
    _rule_task_uid = [True,long,"bigint","greater0"]
    task_name = ndb.StringProperty(required=True)
    _rule_task_name = [True,unicode,"len1"]

class DatastoreTaskNames(ndb.Model,DSF):
    task_uid = ndb.IntegerProperty(required=True)
    _rule_task_uid = [True,long,"bigint","greater0"]
    task_name = ndb.StringProperty(required=True)
    _rule_task_name = [True,unicode,"len1"]
    
class DatastoreBillingCodes(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(required=True)
    _rule_billing_code_uid = [True,long,"bigint","greater0"]
    name = ndb.StringProperty(required=True)
    _rule_name = [True,unicode,"len1"]
    description = ndb.StringProperty(required=True)
    _rule_description = [True,unicode,"len1"]

class DatastoreBillingCodeTypes(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(required=True)
    _rule_billing_code_uid = [True,long,"bigint","greater0"]
    log_type = ndb.StringProperty(required=True)
    _rule_log_type = [True,unicode,"len1"]

class DatastoreBillingLogErrors(ndb.Model,DSF):
    date_time = ndb.StringProperty(required=True)
    _rule_date_time = [True,unicode,"len1"]
    log_info = ndb.StringProperty(required=True)
    _rule_log_info = [True,unicode,"len1"]

class DatastoreBillingCodeCosts(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(required=True)
    _rule_billing_code_uid = [True,long,"bigint","greater0"]
    unit_cost = ndb.StringProperty(required=True)
    _rule_unit_cost = [True,unicode,"len1"]
    tax_type_uid = ndb.IntegerProperty(required=True)
    _rule_tax_type_uid= [True,long,"bigint","greater0"]
    
class DatastoreBillingTaxTypes(ndb.Model,DSF):
    tax_type_uid = ndb.IntegerProperty(required=True)
    _rule_tax_type_uid = [True,long,"bigint","greater0"]
    FIXME = ndb.StringProperty(required=True)
    _rule_FIXME = [True,unicode,'len1']
    
class DatastoreEventLog(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(required=True)
    _rule_billing_code_uid = [True,long,"bigint","greater0"]
    user_uid = ndb.IntegerProperty(required=False)
    _rule_user_uid = [False,long,"bigint","greater0"]
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    object_uid = ndb.IntegerProperty(required=False)
    _rule_object_uid = [False,long,"bigint","greater0"]
    attribute_uid = ndb.IntegerProperty(required=False)
    _rule_attribute_uid = [False,long,"bigint","greater0"]
    details = ndb.StringProperty(required=False)
    _rule_details = [False,unicode,"len1"]
    date_time = ndb.DateTimeProperty(required=True)
    _rule_date_time = [True,datetime.datetime]
    event_billed = ndb.BooleanProperty(default=False)
    _rule_event_billed = [False,bool]
    
class DatastoreEventTicker(ndb.Model,DSF):
    billing_code_uid = ndb.IntegerProperty(required=True)
    _rule_billing_code_uid = [True,long,"bigint","greater0"]
    user_uid = ndb.IntegerProperty(required=False)
    _rule_user_uid = [False,long,"bigint","greater0"]
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    object_uid = ndb.IntegerProperty(required=False)
    _rule_object_uid = [False,long,"bigint","greater0"]
    attribute_uid = ndb.IntegerProperty(required=False)
    _rule_attribute_uid = [False,long,"bigint","greater0"]
    date = ndb.DateTimeProperty(required=False)
    _rule_date = [True,datetime.datetime]
    counter = ndb.FloatProperty(required=True)
    _rule_counter = [True,float]
    ticker_billed = ndb.BooleanProperty(default=False)
    _rule_ticker_billed = [False,bool]    
    
    _use_memcache = True

class DatastoreOrganizationDailyReport(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    date = ndb.DateTimeProperty(required=True)
    _rule_date = [True,datetime.datetime]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"] 

class DatastoreOrganizationDailyRawReport(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    date = ndb.DateTimeProperty(required=True)
    _rule_date = [True,datetime.datetime]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"] 

class DatastoreOrganizationReport(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    start_date = ndb.DateTimeProperty(required=True)
    _rule_start_date = [True,datetime.date]
    end_date = ndb.DateTimeProperty(required=True)
    _rule_end_date = [True,datetime.datetime]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"] 

class DatastoreOrganizationRawReport(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    start_date = ndb.DateTimeProperty(required=True)
    _rule_start_date = [True,datetime.date]
    end_date = ndb.DateTimeProperty(required=True)
    _rule_end_date = [True,datetime.datetime]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"]
    
class DatastoreOrganizationMonthlyRawReport(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    start_date = ndb.DateTimeProperty(required=True)
    _rule_start_date = [True,datetime.date]
    end_date = ndb.DateTimeProperty(required=True)
    _rule_end_date = [True,datetime.datetime]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"]

class DatastoreOrganizationMonthlyReport(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"bigint","greater0"]
    start_date = ndb.DateTimeProperty(required=True)
    _rule_start_date = [True,datetime.date]
    end_date = ndb.DateTimeProperty(required=True)
    _rule_end_date = [True,datetime.datetime]
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"]

class DatastoreBillingParentDate(ndb.Model,DSF):
    date = ndb.StringProperty(required=True)
    _rule_date = [True,unicode,"len1"]
    
class DatastoreBillingParentOrganization(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,"greater0"]

class DatastoreBillingParentYear(ndb.Model,DSF):
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,int,"greater0"]

class DatastoreBillingParentMonth(ndb.Model,DSF):
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,int,"greater0"]

class DatastoreBillingParentDay(ndb.Model,DSF):
    day = ndb.IntegerProperty(required=True)
    _rule_day = [True,int,"greater0"]

class DatastoreReportParentYear(ndb.Model,DSF):
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,int,"greater0"]

class DatastoreReportParentMonth(ndb.Model,DSF):
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,int,"greater0"]
  
class DatastoreUserBillingInfo(ndb.Model,DSF):
    user_id = ndb.StringProperty(required=True)
    _rule_user_id = [True,unicode,"len1","len<151"]
    stripe_token = ndb.StringProperty(required=True)
    _rule_stripe_token = [True,unicode,"len1","len<1000"]
    plaid_token = ndb.StringProperty(required=True)
    _rule_plaid_token = [True,unicode,"len1","len<1000"]

class DatastoreOrganizationBillingInfo(ndb.Model,DSF):
    org_id = ndb.StringProperty(required=True)
    _rule_org_id = [True,unicode,"len1","len<151"]
    user_id = ndb.StringProperty(required=True)
    _rule_user_id = [True,unicode,"len1","len<151"]
    method_id = ndb.StringProperty(required=True)
    _rule_method_id = [True,unicode,"len1","len<10000"]

class DatastoreBillableParentOrganization(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,"greater0"]
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,int,"greater0"]
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,int,"greater0"]

class DatastoreBillableChildOrganization(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,"greater0"]
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,int,"greater0"]
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,int,"greater0"]

class DatastoreBillRaw(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,"greater0"]
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,int,"greater0"]
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,int,"greater0"]
    value = ndb.BlobProperty(required=True)
    _rule_value = [True,bytes,"len1"]

class DatastoreBillCSV(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,"greater0"]
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,int,"greater0"]
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,int,"greater0"]
    value = ndb.BlobProperty(required=True)
    _rule_value = [True,bytes,"len1"]

class DatastoreStripeCustomer(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,int,'greater0']
    customer_id = ndb.StringProperty(required=True)
    _rule_customer_id = [True,unicode,'len1']
    
class DatastoreStripeAccount(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,int,'greater0']
    account_id = ndb.StringProperty(required=True)
    _rule_account_id = [True,unicode,'len1']
    secret_key = ndb.StringProperty(required=True)
    _rule_secret_key = [True,unicode,'len1']
    publishable_key = ndb.StringProperty(required=True)
    _rule_publishable_key = [True,unicode,'len1']

class DatastoreOrganizationChargeMethod(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,int,'greater0']
    source_id = ndb.StringProperty(required=True)
    _rule_source_id = [True,unicode,'len1']

class DatastoreOrganizationPayoutMethod(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,int,'greater0']

class DatastoreOrganizationPayoutPercent(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    percent = ndb.FloatProperty(required=True)
    _rule_percent = [True,float]

class DatastoreOrganizationUsageMultiplier(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    percent = ndb.FloatProperty(required=True)
    _rule_percent = [True,float,'greater0']

class DatastoreOrganizationPayoutEntry(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    user_email = ndb.StringProperty(required=True)
    _rule_user_email = [True,unicode,'len1']
    percentage = ndb.FloatProperty(required=True)
    _rule_percentage = [True,float,'greater0']

class DatastoreOrganizationDefaultPayoutEntry(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    user_email = ndb.StringProperty(required=True)
    _rule_user_email = [True,unicode,'len1']

class DatastoreBillingCharges(ndb.Model,DSF):
    internal_uid = ndb.StringProperty(required=True)
    _rule_internal_uid = [True,unicode,'len1']
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,'greater0']
    stripe_charge_id = ndb.StringProperty(required=True)
    _rule_stripe_charge_id = [True,unicode,'len1']
    processing_stage = ndb.IntegerProperty(required=True)
    _rule_processing_stage = [True,long,'greater0']
    
class DatastoreBillingPayouts(ndb.Model,DSF):
    internal_uid = ndb.StringProperty(required=True)
    _rule_internal_uid = [True,unicode,'len1']
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,'greater0']
    stripe_payout_id = ndb.StringProperty(required=True)
    _rule_stripe_payout_id = [True,unicode,'len1']
    processing_stage = ndb.IntegerProperty(required=True)
    _rule_processing_stage = [True,long,'greater0']

class DatastoreBillingChargePayouts(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,'greater0']
    payout_amount = ndb.FloatProperty(required=True)
    _rule_payout_amount = [True,float,'greater0']
    record_processed = ndb.BooleanProperty(required=False)
    _rule_record_processed = [False,bool]
    
class DatastoreBillingUserPayouts(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,'greater0']
    processing_stage = ndb.IntegerProperty(required=False)
    _rule_processing_stage = [False,long,'greater0']
    total_payout_amount = ndb.FloatProperty(required=True)
    _rule_total_payout_amount = [True,float,'greater0']

class DatastoreBillingUserPayoutsRecord(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,'greater0']
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,int,'greater0']
    payout_amount = ndb.FloatProperty(required=True)
    _rule_payout_amount = [True,float,'greater0']
    processing_stage = ndb.IntegerProperty(required=True)
    _rule_processing_stage = [False,long,'greater0']

class DatastoreChargesPending(ndb.Model,DSF):
    internal_uid = ndb.StringProperty(required=True)
    _rule_internal_uid = [True,unicode,'len1']    

class DatastorePayoutsPending(ndb.Model,DSF):
    internal_uid = ndb.StringProperty(required=True)
    _rule_internal_uid = [True,unicode,'len1']     
    
class DatastoreBillsForMonth(ndb.Model,DSF):
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,long,'greater0']
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,long,'greater0']
    value = ndb.BlobProperty(required=True)
    _rule_value = [True,bytes,"len1"]

class P3PayoutsForMonth(ndb.Model,DSF):
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,long,'greater0']
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,long,'greater0']
    value = ndb.TextProperty(required=True)
    _rule_value = [True,unicode,"len1"]

class DatastoreBillOutstanding(ndb.Model,DSF):
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,long,'greater0']
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,long,'greater0']
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"greater0"]
    amount = ndb.FloatProperty(required=True)
    _rule_amount = [True,float,"greater0"]

class DatastoreBilledUser(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,"greater0"]

class DatastoreBilledSource(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,"greater0"]
    source_id = ndb.StringProperty(required=True)
    _rule_source_id = [True,unicode,"len1"]
    
class DatastoreBilledOrganization(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"greater0"]
    amount = ndb.FloatProperty(required=True)
    _rule_amount = [True,float,"greater0"]
    usage = ndb.FloatProperty(required=True)
    _rule_usage = [True,float,"greater0"]

class DatastoreBillOverride(ndb.Model,DSF):
    _use_cache = False
    _use_memcache = False
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"greater0"]
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,long,'greater0']
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,long,'greater0']
    amount = ndb.FloatProperty(required=True)
    _rule_amount = [True,float]
    description = ndb.TextProperty(required=True)
    _rule_description = [True,unicode,"len1"]

class DatastoreBillAdjustment(ndb.Model,DSF):
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"greater0"]
    month = ndb.IntegerProperty(required=True)
    _rule_month = [True,long,'greater0']
    year = ndb.IntegerProperty(required=True)
    _rule_year = [True,long,'greater0']
    percentage = ndb.FloatProperty(required=False)
    _rule_percentage = [False,float]
    eval_rule = ndb.FloatProperty(required=False)
    _rule_eval_rule = [False,unicode,'len1']
    description = ndb.TextProperty(required=True)
    _rule_description = [True,unicode,"len1"]

class P3UserPayoutReport(ndb.Model,DSF):
    user_uid = ndb.IntegerProperty(required=True)
    _rule_user_uid = [True,long,"greater0"]
    organization_uid = ndb.IntegerProperty(required=True)
    _rule_organization_uid = [True,long,"greater0"]
    date = ndb.StringProperty(required=True)
    _rule_date = [True,unicode,"len1"]
    percentage = ndb.FloatProperty(required=True)
    _rule_percentage = [True,float]
    payout_amount = ndb.FloatProperty(required=True)
    _rule_payout_amount = [True,float,"greater0"]
    is_default_user = ndb.BooleanProperty(required=True)
    _rule_is_default_user = [True,bool]


class P3DsRecordingDateOrgJoins(ndb.Model,DSF):
    processed_flag = ndb.BooleanProperty(required=False,default=True)
    _rule_processed_flag = [True,bool]

class P3DsRecordingOrgObjectJoins(ndb.Model,DSF):
    processed_flag = ndb.BooleanProperty(required=False,default=True)
    _rule_processed_flag = [True,bool]

class P3DsRecordingOrgObjectAttributeJoins(ndb.Model,DSF):
    processed_flag = ndb.BooleanProperty(required=False,default=True)
    _rule_processed_flag = [True,bool]

class Datastores():
    
    billing_code_lookup = DatastoreBillingCodeLookup
    task_uid_lookup = DatastoreTaskUIDLookup
    task_uids = DatastoreTaskUIDs
    task_names = DatastoreTaskNames
    billing_codes = DatastoreBillingCodes
    billing_code_types = DatastoreBillingCodeTypes
    billing_log_errors = DatastoreBillingLogErrors
    billing_code_costs = DatastoreBillingCodeCosts
    billing_tax_types = DatastoreBillingTaxTypes
    event_log = DatastoreEventLog
    event_ticker = DatastoreEventTicker
    organization_daily_report = DatastoreOrganizationDailyReport
    organization_daily_raw_report = DatastoreOrganizationDailyRawReport
    organization_monthly_raw_report = DatastoreOrganizationMonthlyRawReport
    organization_monthly_report = DatastoreOrganizationMonthlyReport
    organization_report = DatastoreOrganizationReport
    organization_raw_report = DatastoreOrganizationRawReport
    organizations_billing_ach = DatastoreOrganizationsAchInformation
    organizations_billing_cc = DatastoreOrganizationsCcInformation

    usage_flag_org_date_joins = P3DsRecordingDateOrgJoins
    usage_flag_org_object_joins = P3DsRecordingOrgObjectJoins
    usage_flag_org_object_attribute_joins = P3DsRecordingOrgObjectAttributeJoins

    billing_parent_date = DatastoreBillingParentDate
    billing_parent_organization = DatastoreBillingParentOrganization
    
    report_parent_month = DatastoreReportParentMonth
    report_parent_year = DatastoreReportParentYear
    
    billing_parent_year = DatastoreBillingParentYear
    billing_parent_month = DatastoreBillingParentMonth
    billing_parent_day = DatastoreBillingParentDay
    
    billable_parent_organization = DatastoreBillableParentOrganization
    billable_child_organization = DatastoreBillableChildOrganization
    
    user_billing_info = DatastoreUserBillingInfo
    organization_billing_info = DatastoreOrganizationBillingInfo
    
    bill_raw = DatastoreBillRaw
    bill_csv = DatastoreBillCSV
    bill_outstanding = DatastoreBillOutstanding
    bill_override = DatastoreBillOverride
    bill_adjustment = DatastoreBillAdjustment
    
    stripe_customer = DatastoreStripeCustomer
    stripe_account = DatastoreStripeAccount
    
    organization_charge_method = DatastoreOrganizationChargeMethod
    organization_payout_method = DatastoreOrganizationPayoutMethod
    organization_payout_percent = DatastoreOrganizationPayoutPercent
    organization_usage_multiplier = DatastoreOrganizationUsageMultiplier
    
    organization_payout_entry = DatastoreOrganizationPayoutEntry
    organization_default_payout_entry = DatastoreOrganizationDefaultPayoutEntry
    
    user_payout_report = P3UserPayoutReport
    
    billing_charges = DatastoreBillingCharges
    billing_payouts = DatastoreBillingPayouts
    billing_charge_payouts = DatastoreBillingChargePayouts
    billing_user_payouts = DatastoreBillingUserPayouts
    billing_user_payouts_record = DatastoreBillingUserPayoutsRecord
    charges_pending = DatastoreChargesPending
    payouts_pending = DatastorePayoutsPending
    
    bills_for_month = DatastoreBillsForMonth
    payouts_for_month = P3PayoutsForMonth
    
    billed_user = DatastoreBilledUser
    billed_source = DatastoreBilledSource
    billed_organization = DatastoreBilledOrganization
    
    # used for deleting the entire datastore, just add the variable name to this list when you add a new datastore
    datastore_list = [billing_code_lookup,task_uid_lookup,task_uids,task_names,billing_codes,billing_code_types,billing_log_errors,billing_code_costs,billing_tax_types,event_log,event_ticker,
                      organization_daily_report,organization_daily_raw_report,organization_monthly_raw_report,organization_monthly_report,organization_report,organization_raw_report,organizations_billing_ach,organizations_billing_cc,
                      billing_parent_date,billing_parent_organization,
                      report_parent_year,report_parent_month,
                      billing_parent_year,billing_parent_month,billing_parent_day,
                      billable_parent_organization,billable_child_organization,
                      user_billing_info,organization_billing_info,
                      bill_raw,bill_csv,
                      stripe_customer,stripe_account,
                      organization_charge_method,organization_payout_method,organization_payout_percent,organization_usage_multiplier,
                      organization_payout_entry,organization_default_payout_entry,user_payout_report,
                      billing_charges,billing_charge_payouts,billing_user_payouts,billing_user_payouts_record,
                      charges_pending,payouts_pending,
                      bills_for_month,payouts_for_month,
                      billed_user,billed_source,billed_organization,
                      usage_flag_org_date_joins,
                      usage_flag_org_object_joins,usage_flag_org_object_attribute_joins
]
