
from types import FunctionType
 
class DataValidation():


    def __SQL_InsertList(self,values):
        return_msg = 'DataValidation:__SQL_InsertList '
        call_result = {}
        bad_input_flag =False
        
        for index1,value in enumerate(values):
            if type(value) != list:
                return_msg += 'list entry %d is not a list' % index1
                bad_input_flag =True                
                continue
            
            if len(value) != 2:
                bad_input_flag =True
                return_msg += 'list entry %d should have 2 entries, it has %d' % (index1,len(value))
                continue
            
            call_result = self.__SqlColumn(value[0])
            if call_result['success'] != True:
                bad_input_flag =True
                return_msg += 'list entry %d has an invalid SqlColumn. Error:%s' % (index1,call_result['return_msg'])
                continue
            
            if type(value[1]) not in (int,str,float,bool):
                bad_input_flag =True
                return_msg += 'list entry %d value entry is not the right type, its a %s ' % (index1,type(value[1]))
                continue
            
        if bad_input_flag:            
            return {'success': False,'return_msg': return_msg}
        else:
            return {'success': True,'return_msg': return_msg}

    def __SqlOperatorRightValue(self,value):
        return_msg =  'DataValidation:__Operator_right_value '
        if type(value) not in (int,str,float):
            return_msg += 'value is not an integer, str or SqlColumn its a %s' % type(value)
            return {'success': False,'return_msg': return_msg}
        
        
        if type(value) == "SqlColumn":
            call_result = self.__SqlColumn(value)
            if call_result['success'] != True:
                return_msg += call_result['return_msg']
                return {'success': False,'return_msg': return_msg}
        
        if type(value) == str:
            if len(value) < 1:
                return_msg += 'value is a str less than 1 character long.'
                return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}    

    
    def __SqlOperatorLeftValue(self,value):
        return_msg =  'DataValidation:__Operator_left_value '
        call_result = {}
        if type(value) not in (str):
            return_msg += 'value is not a str or SqlColumn its a %s' % type(value)
            return {'success': False,'return_msg': return_msg}
        
        if type(value) == "SqlColumn":
            call_result = self.__SqlColumn(value)
            if call_result['success'] != True:
                return_msg += call_result['return_msg']
                return {'success': False,'return_msg': return_msg}
        
        if type(value) == str:
            if len(value) < 1:
                return_msg += 'value is a str less than 1 character long.'
                return {'success': False,'return_msg': return_msg}
           
        return {'success': True,'return_msg': return_msg}    

    def __IntList(self,values):
        return_msg = 'DataValidation:__IntList '
        for index1,value in enumerate(values):
            if type(value) not in (int,float):
                return_msg += 'index %d of list is not an integer its a %s' % (index1,type(value))
                return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
        
    def __strList(self,values):
        return_msg = 'DataValidation:__strList '
        for index1,value in enumerate(values):
            if type(value) != str:
                return_msg += 'index %d of list is not a str its a %s' % (index1,type(value))
                return {'success': False,'return_msg': return_msg}        
        return {'success': True,'return_msg': return_msg}
   
    
    def __SequenceLength1(self,value):
        return_msg = 'DataValidation:__SequenceLength1 '
        if len(value) < 1:
            return_msg += 'sequence length less than 1'
            return {'success': False,'return_msg': return_msg}
        else:
            return {'success': True,'return_msg': return_msg}
    
    def __SqlQualifierList(self,values):
        return_msg = 'DataValidation:__SqlQualifierList '
        debug_data = []
        call_result = {}
        for index1,value in enumerate(values):
            call_result = self.__SqlQualifier(value)
            if call_result['success'] != True:
                debug_data.append(call_result)
                return_msg += 'index %d failed.' % (index1)
                return {'success': False,'return_msg': return_msg,'debug_data': debug_data}
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __SqlQualifier(self,value):
        return_msg = 'DataValidation:__SQLQualifier '
        call_result = {}
        debug_data = []
        if value.__class__.__name__ != "SqlQualifier":
            return_msg += 'this is not a SqlQualifier Class. its a %s' % value.__class__.__name__
            return {'success': False,'return_msg': return_msg,'debug_data': debug_data}
        call_result = value.SqlQualifierVerify()
        if call_result['success'] != True:
            debug_data.append(call_result)
            return_msg += call_result['return_msg']
            return {'success': False,'return_msg': return_msg,'debug_data': debug_data}
        
        return {'success': True,'return_msg': return_msg,'debug_data': debug_data}
    
        
    
    def __SqlColumnList(self,values):
        return_msg = 'DataValidation:__SqlColumnList '
        call_result = {}
        for value in values:
            call_result = self.__SqlColumn(value)
            if call_result['success'] != True:
                return_msg += call_result['return_msg']
                return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
    
    
    
    def __SqlColumn(self,value):
        return_msg = 'DataValidation:__SqlColumn '
        call_result = {}
        if value.__class__.__name__ != "SqlColumn":
            return_msg += 'this is not a SqlColumn Class. its a %s' % value.__class__.__name__
            return {'success': False,'return_msg': return_msg}
        call_result = value.SqlColumnVerify()
        if call_result['success'] != True:
            return_msg += call_result['return_msg']
            return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
            
    def __mysql_db_handle(self,value):
        return_msg = 'DataValidation:__mysql_db_handle '
        if  value.__class__.__name__ != "Connection":
            return_msg += "value should be a Connection class insteads its a %s class" % value.__class__.__name__
            return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}


    def __cursor(self,value):
        return_msg = 'DataValidation:__cursor '
        if  value.__class__.__name__ != "Cursor":
            return_msg += "value should be a Cursor class insteads its a %s class" % value.__class__.__name__
            return {'success': False,'return_msg': return_msg}           
    
        return {'success': True,'return_msg': return_msg}
    
    
    def __maxlen5000(self,value):
        return_msg = 'DataValidation:__maxlen5000 '
        if len(value) > 5000:
            return_msg += "value should be a 5000  or less in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __0or1(self,value):
        return_msg = 'DataValidation:__0or1 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value != 0 and test_value != 1:
            return_msg += "value should be 0 or 1 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __greater0(self,value):
        return_msg = 'DataValidation:__greater0 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value < 0:
            return_msg += "value should be greater than 0. its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __bigInt(self,value):
        return_msg = 'DataValidation:__bigInt '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        if test_value < 0:
            return_msg += "value should be greater than 0. its %d" % test_value
            return {'success': False,'return_msg': return_msg}
        
        if test_value > 18446744073709551615:
            return_msg += "value should be less than 18446744073709551615. its %d" % test_value
            return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __lenLessThan151(self,value):
        return_msg = 'DataValidation:__lenLessThan150 '
        if len(value) > 150:
            return_msg += "value should be 150 or less in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __lenLessThan1000(self,value):
        return_msg = 'DataValidation:__lenLessThan1000 '
        if len(value) > 999:
            return_msg += "value should be 999 or less in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    def __objectAttributeRuleOperator(self,value):
        call_result = {}
        return_msg = 'DataValidation:__ObjectAttributeRuleOperator '
        if value.lower() not in ("=","<",">","like","!="):
            return_msg += "operator value should be one of the following =,<,>,LIKE,!=.  its %s" % value             
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    def __organizationAttributeRuleOperator(self,value):
        call_result = {}
        return_msg = 'DataValidation:__OrganizationAttributeRuleOperator '
        if value.lower() not in ("=","<",">","like","!="):
            return_msg += "operator value should be one of the following =,<,>,LIKE,!=.  its %s" % value             
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    def __userAttributeRuleOperator(self,value):
        call_result = {}
        return_msg = 'DataValidation:__OrganizationAttributeRuleOperator '
        if value.lower() not in ("=","<",">","like","!="):
            return_msg += "operator value should be one of the following =,<,>,LIKE,!=.  its %s" % value             
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    def __lenLessThan1048480(self,value):
        return_msg = 'DataValidation:__lenLessThan1048480 '
        if len(value) > 1048480:
            return_msg += "value should be 1048480 or less in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
        
    def __lenLessThan102400(self,value):
        return_msg = 'DataValidation:__lenLessThan102400 '
        if len(value) > 102399:
            return_msg += "value should be 102399 or less in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    
    
    def __attributeType(self,value):
        return_msg = 'DataValidation:__attributeType '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "attribute type should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value not in (1,2,3):
            return_msg += "attribute type should be a value between 1 and 3 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __lenGreater10(self,value):
        return_msg = 'DataValidation:__lengreater10 '
        if len(value) < 11:
            return_msg += "value should be 10 or more in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
   
    def __greater19999(self,value):
        return_msg = 'DataValidation:__greater19999 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value < 20000:
            return_msg += "value should be greater than 19999. its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __less60001(self,value):
        return_msg = 'DataValidation:__less60001 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value > 60000:
            return_msg += "value should be less than 60000. its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
        
        
    def __less10001(self,value):
        return_msg = 'DataValidation:__less10001 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value > 10000:
            return_msg += "value should be less than 10000. its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}

        
    def __less20000(self,value):
        return_msg = 'DataValidation:__less20000 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value > 20000:
            return_msg += "value should be less than 20000. its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}

        
    def __objectWebUid(self,value):
        return_msg = 'DataValidation:__objectWebUid '
        call_result = {}
        debug_data = []
         

        if len(value) != 22:
            return_msg += "web object uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "wobj_":
            return_msg += "prefix is not wobj_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
   
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

       
    def __organizationWebUid(self,value):
        return_msg = 'DataValidation:__organizationWebUid '
        call_result = {}
        debug_data = []
         

        if len(value) != 22:
            return_msg += "web organization uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "worg_":
            return_msg += "prefix is not wobj_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}

        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}
    
       
    def __userWebUid(self,value):
        return_msg = 'DataValidation:__userWebUid '
        call_result = {}
        debug_data = []
         

        if len(value) != 22:
            return_msg += "web user uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:6] != "wuser_":
            return_msg += "prefix is not wobj_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

       
    def __userAttributeWebUid(self,value):
        return_msg = 'DataValidation:__userAttributeWebUid '
        call_result = {}
        debug_data = []

        if len(value) !=22:
            return_msg += "web user attribute uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "usrA_":
            return_msg += "prefix is not usrA_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
          
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

       
    def __objectAttributeWebUid(self,value):
        return_msg = 'DataValidation:__objectAttributeWebUid '
        call_result = {}
        debug_data = []
         
        if len(value) != 22:
            return_msg += "web object attribute uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "objA_":
            return_msg += "prefix is not objA_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
     
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}
     
       
    def __organizationAttributeWebUid(self,value):
        return_msg = 'DataValidation:__organizationAttributeWebUid '
        call_result = {}
        debug_data = []
         
        if len(value) != 22:
            return_msg += "web oragnization attribute uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "orgA_":
            return_msg += "prefix is not orgA_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        

        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

      
    def __organizationProcessorKey1(self,value):
        return_msg = 'DataValidation:__organizationProcessorKey1 '
        call_result = {}
        debug_data = []
         

        if len(value) != 22:
            return_msg += "processor organization uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "porg_":
            return_msg += "prefix is not porg_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

      
    def __organizationProcessorKey2(self,value):
        return_msg = 'DataValidation:__organizationProcessorKey2 '
        call_result = {}
        debug_data = []
         

        if len(value) != 22:
            return_msg += "unencrypted processor organization uid should be 22 characters long and this value is %d long. first 100 characters of value are:%s" % (len(value),value[:100])
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        
        if value[:5] != "uorg_":
            return_msg += "prefix is not uorg_. first 100 characters of value are:%s" % value[:100]
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

     
    def __emailAddress(self,value):
        return_msg = 'DataValidation:__emailAddress '
        debug_data = []
        
        #no spaces
        if " " in value:
            return_msg += 'email addresses cannot have spaces in them'
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
    ## @ symbol rules
        at_symbol_count =0;
        at_symobol_location = 0;
        for index1,c in enumerate(value):
            if c == "@":
                at_symbol_count = at_symbol_count +1
                at_symobol_location = index1
        
        if at_symbol_count == 0:
            return_msg += 'email addresses must have an @ symbol in it'
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
       
        if at_symbol_count > 1:
            return_msg += 'email addresses must have only one @ symbol in it'
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
    ##</end> @ symbol rules
          
        
    ## make sure it contains text period text after @ symbol
        period_found_flag = False
        text_found_after_period_flag = False
        for index1,c in enumerate(value[at_symobol_location+1:]):
            if c == ".":
                period_found_flag = True
                # period right after the @symbol
                if index1 == 0:
                    return_msg += 'email addresses has a period right after the @ symbol'
                    return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
            
            #these characters can't exist in domains
            if c in ("!","@","#","$","%","&","*","(",")","_","/","?",">","<","|","\\"):
                return_msg += 'domain names contains atleast one invalid character'
                return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
            
            #make sure text is found after the period
            if period_found_flag == True and text_found_after_period_flag == False and c != ".":
                text_found_after_period_flag = True
        
        if period_found_flag == False:
            return_msg += 'no period found in domain name after @ symbol'
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
            
        if text_found_after_period_flag == False:
            return_msg += 'no text found after . in domain name'
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
          
    ##</end> make sure it contains text period text after @ symbol
        
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}
  
  
    def __personName(self,value):
        return_msg = 'DataValidation:__personName '
        
 
        return {'success': True,'return_msg': return_msg}
        
        
    def __googleAccountName(self,value):
        return_msg = 'DataValidation:__googleAccountName '
        
        return {'success': True,'return_msg': return_msg}
    
    def __listOfLists(self,values):
        return_msg = 'DataValidation:__listOfLists '

        for index1,value in enumerate(values):
            if type(value) != list:
                return_msg += "index %d is not a list type its a %s" % (index1, type(list))
                return {'success': False,'return_msg': return_msg}
                
        return {'success': True,'return_msg': return_msg}
            
    def __taskQueueMethod(self,value):
        return_msg = 'DataValidation:__taskQueueMethod '
        
        if value not in ("POST","PULL"):
            return_msg += "a task queue method value should be POST or PULL. this is case sensitive. the value passed was  %s" % value
            return {'success': False,'return_msg': return_msg}
                
        return {'success': True,'return_msg': return_msg}

    
    def __listOfDicts(self,values):
        return_msg = 'DataValidation:__listOfDicts '

        for index1,value in enumerate(values):
            if type(value) != dict:
                return_msg += "index %d is not a list type its a %s" % (index1, type(list))
                return {'success': False,'return_msg': return_msg}
                
        return {'success': True,'return_msg': return_msg}


    
    def __accountType(self,value):
        return_msg = 'DataValidation:__accountType '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "account type should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value not in (1,2,3):
            return_msg += "account type should be a value between 1 and 3 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    

    def __taskQueueList(self,value):
        return_msg = 'DataValidation:__taskQueueList '
        call_result = {}
        debug_data = []
        
        call_result = self.__listOfDicts(value)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += " task queue list isn't a list of dictionaries "
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
    ### loop to check each task queue entry
        fail_flag = False
        for index1,entry in enumerate(value):
            if entry.has_key('name') == False:
                fail_flag = True
                return_msg += "msg:task queue entry %d has no name key. " % index1

            if entry.has_key('url') == False:
                fail_flag = True
                return_msg += "msg:task queue entry %d has no url key. " % index1
                
            if entry.has_key('method') == False:
                fail_flag = True
                return_msg += "msg:task queue entry %d has no method key. " % index1
            
            if entry.has_key('RSA') == False:
                fail_flag = True
                return_msg += "msg:task queue entry %d has no RSA (result assignments) key. " % index1
                
            if entry.has_key('PMA') == False:
                fail_flag = True
                return_msg += "msg:task queue entry %d has no PMA (param assignments) key. " % index1
            
            if entry.has_key('delay') == False:
                fail_flag = True
                return_msg += "msg:task queue entry %d has no delay key. " % index1


            if fail_flag == True:
                continue
 
            call_result = self.checkValues([[entry['name'],True,str,"len1"],
                                            [entry['url'],True,str],
                                            [entry['method'],True,str,"task_queue_method"],
                                            [entry['RSA'],True,dict],
                                            [entry['PMA'],True,dict],
                                            [entry['delay'],True,str,"less<65536"]
                                            ])
            debug_data.append(call_result)
            if call_result['success'] != True:
                return_msg += "msg: task queue entry %d list values failed validation " % index1
                return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
            
        ## check each task result assignment
            for key in entry['PMA']:
                if type(entry['PMA'][key]) != str:
                    return_msg += "msg: task queue entry %d task_param_assignments key value for key %s is not a str its a %s" %(index1,key,type(entry['PMA'][key]))
                    fail_flag = True
                else:
                    if len(entry['PMA'][key]) < 1:
                        return_msg += "msg: task queue entry %d task_param_assignments key value for key %s is empty" %(index1,key)
                        fail_flag = True
        ##</end> check each task result assignment
            
        ## check each task param assignment
            for key in entry['RSA']:
                if type(entry['RSA'][key]) != str:
                    return_msg += "msg: task queue entry %d task_result_assignments key value for key %s is not a str its a %s" %(index1,key,type(entry['RSA'][key]))
                    fail_flag = True
                else:
                    if len(entry['RSA'][key]) < 1:
                        return_msg += "msg: task queue entry %d task_result_assignments key value for key %s is empty" %(index1,key)
                        fail_flag = True
        ##</end> check each task param assignment
            
    ###</end> loop to check each task queue entry
                
        if fail_flag == True:
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
    
        
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}
    
    def __organizationType(self,value):
        return_msg = 'DataValidation:__organizationType '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "organization type should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value not in (1,2,3,4,5,6,7,8,9):
            return_msg += "organization type should be a value between 1 and 5 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
        
    
    def __firebaseInstruction(self,value):
        return_msg = 'DataValidation:____firebaseInstruction '
        call_result = {}
        debug_data = []
        
        call_result = self.__listOfDicts(value)
        debug_data.append(call_result)
        if call_result['success'] != True:
            return_msg += " firebase instruction list isn't a list of dictionaries "
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
    ### loop to check each firebase instruction entry
        fail_flag = False
        for index1,entry in enumerate(value):
            if entry.has_key('key') == False:
                fail_flag = True
                return_msg += "msg:firebase instruction entry %d has no key key. " % index1

            if entry.has_key('id') == False:
                fail_flag = True
                return_msg += "msg:firebase instruction entry %d has no id key. " % index1
                
            if entry.has_key('function') == False:
                fail_flag = True
                return_msg += "msg:firebase instruction entry %d has no function key. " % index1
            
            if entry.has_key('value') == False:
                fail_flag = True
                return_msg += "msg:firebase instruction entry %d has no value key. " % index1
                
            if fail_flag == True:
                continue
 
            call_result = self.checkValues([[entry['id'],True,"len1"],
                                            [entry['function'],True,"len1"],
                                            [entry['key'],True,"len1"],
                                            [entry['value'],True,'len1']
                                            ])
            debug_data.append(call_result)
            if call_result['success'] != True:
                return_msg += "msg: firebase instruction entry %d list values failed validation " % index1
                return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
        if fail_flag == True:
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        return {'success': True,'return_msg': return_msg}
    
    
    def __objectType(self,value):
        return_msg = 'DataValidation:__objectType '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "object type should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value not in (1,2,3):
            return_msg += "object type should be a value between 1 and 3 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    

    
    def __NdbModelList(self,values):
        return_msg = 'DataValidation:__NdbModelList '
        call_result = {}
        for value in values:
            call_result = self.__NdbModel(value)
            if call_result['success'] != True:
                return_msg += call_result['return_msg']
                return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
    
    
    

    
    def __2or3(self,value):
        return_msg = 'DataValidation:__2or3 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value != 2 and test_value != 3:
            return_msg += "value should be 2 or 3 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
 
    
      
    def __less65536(self,value):
        return_msg = 'DataValidation:__less65536 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value > 65535:
            return_msg += "value should be less than 65536. its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
     
        
    def __objectAttributeSettableValueType(self,value):
        return_msg = 'DataValidation:__objectAttributeSettableValueType '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "settable type should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value not in (0,2,3,4):
            return_msg += "settable type should be a value between 2 and 4 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    

        
    def __datastoreUpdateType(self,value):
        return_msg = 'DataValidation:__datastoreUpdateType '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value != 1 and test_value != 2 and test_value != 3:
            return_msg += "value should be 1 and 3 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}


    def __date_string_YYYY_MM_DD(self,value):
        return_msg = 'DataValidation:__date_string_YYYY_MM_DD '
        debug_data = []
        
        #no spaces
        if " " in value:
            return_msg += 'date strings cannot have spaces in them'
            return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
        
    ## ensure the first 4 characters are a number, same for the middle 2 and last 2
        for index in (0,1,2,3,5,6,8,9):
            if value[index] not in ("1234567890"):
                    return_msg += 'this date string contains non-number characters where numbers should be'
                    return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
    ##</end> ensure the first 4 characters are a number, same for the middle 2 and last 2
    
    ## characters 5 and 8 should be dashes
        for index in (4,7):
            if value[index] != "-":
                return_msg += 'this date string does not contain - character at postion 4 or 7'
                return {'success': False,'return_msg': return_msg,'debug_data':debug_data}
    ##</end> characters 5 and 8 should be dashes
    
        return {'success': True,'return_msg': return_msg,'debug_data':debug_data}

    
    
    def __len512(self,value):
        return_msg = 'DataValidation:__len512 '
        if len(value) != 512:
            return_msg += "value should be 512 in length and its %d long" % len(value)
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    def __is_function(self,value):
        return_msg = 'DataValidation:__is_function '
        if type(value) != FunctionType:
            return_msg += 'this variables type is not a function its a ' + str(type(value))
            return {'success': False,'return_msg': return_msg} 
        
        if callable(value) != True:
            return_msg += "callable shows this is not a function"
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    def __2to4(self,value):
        return_msg = 'DataValidation:__2to4 '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value  <2 or test_value > 4:
            return_msg += "value should be between 2 and 4 its %d" % test_value
            return {'success': False,'return_msg': return_msg} 
        
        return {'success': True,'return_msg': return_msg}
    
    
    def __millitary_time(self,value):
        return_msg = 'DataValidation:__millitary_time '
        if type(value) in (str,str):
            try:
                test_value = int(value)
            except Exception as e:
                return_msg += "value should be a text number but could not be converted to a number.exception:%s value is: %s" % (str(e),value)
                return {'success': False,'return_msg': return_msg}
        else:
            test_value = value
        
        if test_value  <0  or test_value > 2359:
            return_msg += "value should be between 0 and 2359 its %d" % test_value
            return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
    
    
    
    def __baud_rate(self,value):
        return_msg = 'DataValidation:__baud_rate '
        
        if type(value) != int:
            return_msg += "value is not a int its a %s" % (str(type(value)))
            return {'success': False,'return_msg': return_msg}
        
        if value not in (110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000):
            return_msg += "baud rate is not an industry standard rate"
            return {'success': False,'return_msg': return_msg}
        
        return {'success': True,'return_msg': return_msg}
    
    
    def checkValues(self,values_list):
        call_result = {}
        debug_data = []
        return_msg = 'DataValidation:checkValues '
        validation_messages = []
        
        function_list = ("len1","len>1","sqlcolumn","sqlcolumlist",
                         "sqlqualifier","sqlqualifierlist","intlist",
                         "strlist","operator_right_value","operator_left_value",
                         "sqlinsertlist","mysql_db_handle","cursor",
                         "maxlen5000","0or1","greater0","bigint",
                         "len<151","len<1000","object_attribute_rule_operator",
                         "organization_attribute_rule_operator","user_attribute_rule_operator",
                         "len<1048480","attribute_type","len>10",
                         "greater19999","less<60001","less<10001",
                          "object_web_uid","user_web_uid","organization_web_uid",
                         "user_attribute_web_uid","object_attribute_web_uid",
                         "organization_attribute_web_uid","organization_processor_key1",
                          "email_address","person_name","google_account_name",
                          "list_of_lists","task_queue_method","list_of_dicts",
                          "account_type","task_queue_list","organization_type",
                          "organization_processor_key2","firebase_instruction",
                          "object_type","list_of_ndb_models",
                          "2or3","less<65536","obj_atr_settable_value_type",
                          "less<20000","len<102400","datastore_update_type",
                          "date_string_yyyy_mm_dd","len512","is_function",
                          "len>0","2to4","baud_rate","millitary_time")
        

        function_refs = [self.__SequenceLength1, self.__SequenceLength1, self.__SqlColumn,self.__SqlColumnList,
                         self.__SqlQualifier,self.__SqlQualifierList,self.__IntList,
                         self.__strList,self.__SqlOperatorRightValue,self.__SqlOperatorLeftValue,
                         self.__SQL_InsertList,self.__mysql_db_handle,self.__cursor,
                         self.__maxlen5000,self.__0or1,self.__greater0,self.__bigInt,
                         self.__lenLessThan151,self.__lenLessThan1000,self.__objectAttributeRuleOperator,
                         self.__organizationAttributeRuleOperator,self.__userAttributeRuleOperator,
                         self.__lenLessThan1048480,self.__attributeType,self.__lenGreater10,
                         self.__greater19999,self.__less60001,self.__less10001,
                         self.__objectWebUid,self.__userWebUid,self.__organizationWebUid,
                         self.__userAttributeWebUid,self.__objectAttributeWebUid,
                         self.__organizationAttributeWebUid,self.__organizationProcessorKey1,
                         self.__emailAddress,self.__personName,self.__googleAccountName,
                         self.__listOfLists,self.__taskQueueMethod,self.__listOfDicts,
                         self.__accountType,self.__taskQueueList,self.__organizationType,
                         self.__organizationProcessorKey2,self.__firebaseInstruction,
                         self.__objectType,self.__NdbModelList,
                         self.__2or3,self.__less65536,self.__objectAttributeSettableValueType,
                         self.__less20000,self.__lenLessThan102400,self.__datastoreUpdateType,
                         self.__date_string_YYYY_MM_DD,self.__len512,self.__is_function,
                         self.__SequenceLength1,self.__2to4,self.__baud_rate,self.__millitary_time
                         ]
        
        types_list = (int,float,str,str,list,dict,object,bool)
#this needs to match the indexs of types_list
        types_text = ("int","long","str","str","float","list","dict","instance","object")     
        value_fail_flag = False
    ## make sure the rules are correctly formatted
        if type(values_list) != list:
            return_msg += 'msg:values_list is not a list, its a %s' % type(values_list)
            return {'success': False,'return_msg': return_msg,'validation_messages':validation_messages, 'debug_data': debug_data }
        
        if len(values_list) <  1:
            return_msg += 'msg:values_list has no entries'
            return {'success': False,'return_msg': return_msg, 'validation_messages':validation_messages, 'debug_data': debug_data }
        
        value_type_processed_flags = False
        for index1,value in enumerate(values_list):
            value_type_processed_flags = False
            if type(value) != list:
                value_fail_flag = True
                validation_messages.append("%d sublist index is not a list its a %s" % (index1,type(value)))
                continue
            if len(value) < 3:
                value_fail_flag = True
                validation_messages.append("%d sublist index has only %d entries, it needs atleast 3" % (index1,len(value)))
                continue
            #required flag
            if type(value[1]) != bool:
                value_fail_flag = True
                validation_messages.append("%d sublist index should have the index 1 entry as a bool, its a %s" % (index1,type(value[1])))
                continue
    ##</end> make sure the rules are correctly formatted
    
        ## handle the required flag
            #is it a required value
            if value[1] == True and value[0] == None:
                value_fail_flag = True
                validation_messages.append("value %d is None and is a required value" % index1)               
                continue
            #if the value isn't required and set to none skip to the next value            
            if value[1] == False and value[0] == None:
                continue
        ##</end> handle the required flag
            
        ## make sure the type is correct
    
            #should it be a number? we treat int,long and float as interchangable
            if value_type_processed_flags == False and value[2] in (int,float):
                value_type_processed_flags = True
                if type(value[0]) not in (int,float):
                    value_fail_flag = True
                    validation_messages.append("value %d should be a number but its a %s." % (index1,type(value[0]) ))
                    continue
            #check built in types
            elif value_type_processed_flags == False and value[2] in (str,str,list,dict,object):
                value_type_processed_flags = True
                if type(value[0]) != value[2]:
                    value_fail_flag = True
                    validation_messages.append("value %d should be type %s but its a %s." % (index1, types_text[types_list.index(value[2])],str(type(value[0]))))
                    continue
            #check all other types                
            elif value_type_processed_flags == False:
                value_type_processed_flags = True
                try:
                    if issubclass(value[0].__class__,value[2]) == False:
                        value_fail_flag = True
                        validation_messages.append("value %d should be type %s but its a %s." % (index1,str(value[2]),value[0].__class__.__name__))
                        continue
                except Exception as e:
                    value_fail_flag = True
                    validation_messages.append("exception occurred processing type for value %d. Exception: %s" %  (index1,str(e)))
                    continue
        ##</end> make sure the type is correct
        
            
        ## check against all custom rules for this value
            for index2 in range(3,len(value)):
                rule = value[index2]
                if type(rule) not in (str,str):
                    return_msg += 'msg:value %d rule %d is not a str or string, its a %s' % (index1,index2,type(rule))
                    return {'success': False,'return_msg': return_msg, 'validation_messages':validation_messages, 'debug_data': debug_data }
                
                if rule in function_list:
                    call_result = function_refs[function_list.index(rule)](value[0])
                    if call_result['success'] != True:                        
                        debug_data.append(call_result)
                        value_fail_flag = True
                        validation_messages.append("value %d: rule %d failed check." % (index1,index2))
                        continue
        ##</end> check against all custom rules for this value                            
        
        if value_fail_flag:
            return {'success': False,'return_msg': return_msg,'validation_messages':validation_messages, 'debug_data': debug_data }                        
        else:
            return {'success': True,'return_msg': return_msg,'validation_messages':validation_messages, 'debug_data': debug_data }
        
        
    def ruleCheck(self,value_rule_pairs):
        call_result = {}
        debug_data = []
        return_msg = 'DataValidation:ruleCheck '
        validation_messages = []
        value_fail_flag = False
        value_rule_pairs
        
        call_result = self.checkValues([[value_rule_pairs,True,list,"len1","list_of_lists"]])
        debug_data.append(call_result)
        if call_result['success'] != True:
            value_fail_flag = True
            return_msg += "input validation failed"
            return {'success': False,'return_msg': return_msg,'validation_messages':validation_messages, 'debug_data': debug_data }
        
        
    ## check each value and add its data to arg_list
        #create a copy so we aren't inserting values into the orignial
        arg_list = []
        for index1,value in enumerate(value_rule_pairs):
            arg_list.append([])
            if len(value) != 2:
                return_msg += "input data index %d has %d entries when it should have 2" % (index1,len(value))
                value_fail_flag = True
                continue
            
            if type(value[1]) != list:
                return_msg += "input data index %d, the second entry should be a list not a %s" % (index1,type(value))
                value_fail_flag = True
                continue
            
            #insert the value to check
            arg_list[index1].insert(0,value[0])
            #insert the rules
            arg_list[index1].extend(value[1])
    ##</end> check each value and add its data to arg_list
        
        if value_fail_flag == True:
            return {'success': False ,'return_msg': return_msg,'validation_messages':validation_messages, 'debug_data': debug_data }
            

        call_result = self.checkValues(arg_list)
        debug_data = call_result['debug_data']
        return_msg = call_result['return_msg']
        validation_messages = call_result['validation_messages']
        return {'success': call_result['success'],'return_msg': return_msg,'validation_messages':validation_messages, 'debug_data': debug_data }
            
            
    
        
