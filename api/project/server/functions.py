from bson import json_util, ObjectId
import json
import re
from pymongo import MongoClient
import yaml
import urllib3
import urllib.request 
import urllib.parse
import urllib3.exceptions
import re
import time
from celery import Celery, current_task
from datetime import datetime
import codecs
import pandas as pd
from functools import reduce
from itertools import chain    
import threading
import xmltodict
class FakeDict(dict):
    def __init__(self, items):
        if items != []:
            self['something'] = 'something'
        self._items = items
    def items(self):
        return self._items

db = MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']
reader = codecs.getreader("utf-8")
def parse_json(data):
    return json.loads(json_util.dumps(data))

def flatten(S):
    if S == []:
        return S
    if isinstance(S[0], list):
        return flatten(S[0]) + flatten(S[1:])
    return S[:1] + flatten(S[1:])

def prepare_params(job_params, chosen_params, splitMultiChoice, payload):
    for p in job_params:
        if not p['name'] in chosen_params:
            chosen_params[p['name']] = p['default'] if 'default' in p else (p['choices'][0] if p['type'] in ['choice', 'multi-choice', 'dynamic'] else '')
        if ('payload' in p):
            if payload and not p['payload']:
                del chosen_params[p['name']]
    for x, y in list(chosen_params.items()):
        for p in job_params:
            if p['name'] == x:
                if p['type'] == "multi-choice" or p['type'] == "dynamic":
                    temp = y
                    if isinstance(temp, list):
                        temp = flatten(temp)
                        while "," in temp: temp.remove(",") 
                        if splitMultiChoice:
                            chosen_params[x] = temp
                        else:
                            chosen_params[x] = ','.join(temp)               
                    else:
                        if splitMultiChoice:
                            chosen_params[x] = temp.split(",")
                        else:
                            chosen_params[x] = temp
    return chosen_params

def replace_template(parameter, key_value_pairs):
    param_list = []
    for k, v in key_value_pairs.items():
        if isinstance(v, list):
            for p in v:
                param_list.append(json.loads(json.dumps(parameter).replace(f"{{key}}",k).replace(f"{{value}}",p)))
        elif isinstance(v, dict):
            for key, value in v.items():
                param_list.extend(replace_template(parameter, {key: value}))
        else:
            param_list.append(json.loads(json.dumps(parameter).replace(f"{{key}}",k).replace(f"{{value}}",v)))

    return param_list

def replace_parameters(parameter, payload, chosen_params):
    if isinstance(payload, list):
        if payload.count('{parameter}') > 0:
            new_parameters = replace_template(parameter, chosen_params)
            payload.remove('{parameter}')
            payload.extend(new_parameters)
        else:
            for i in payload:
                replace_parameters(parameter, i, chosen_params)
    elif isinstance(payload, dict):
        for k, v in payload.items():
            if v == '{parameter}':
                payload[k] = {k:v for list_item in replace_template(parameter, chosen_params) for (k,v) in list_item.items()}
            else:
                replace_parameters(parameter, v, chosen_params)
    elif isinstance(payload, str):
        if payload == f'{{parameter}}':
            new_parameters = replace_template(parameter, chosen_params)
            payload = new_parameters
    return payload

def querify(chosen_params,splitMultiChoice):
    return urllib.parse.urlencode(chosen_params, doseq=splitMultiChoice, safe=',~()*!.\'/') 

def replace_placeholders(string, values):
    for key in values:
        string = string.replace("{" + key + "}", str(values[key]))
    return string

def trace_error(ex):
    trace = []
    tb = ex.__traceback__
    while tb is not None:
        trace.append({
            "filename": tb.tb_frame.f_code.co_filename,
            "name": tb.tb_frame.f_code.co_name,
            "lineno": tb.tb_lineno
        })
        tb = tb.tb_next
    print(str({
        'type': type(ex).__name__,
        'message': str(ex),
        'trace': trace
    }))

def transform_dict(d):
    num_entries = len(list(d.values())[0])
    new_dicts = []
    for i in range(num_entries):
        new_dict = {}
        gotNone = False
        for key in d:
            if d[key][i] is None:
                gotNone = True
            new_dict[key] = d[key][i]
        if not gotNone:
            new_dicts.append(new_dict)
    return new_dicts

def process_step(job, integrationSteps,chosen_params,integration,outputs,task_id,stepIndex):
    message = "Success"
    error = ""
    r = {}
    chosen_params = prepare_params(job['parameters'], chosen_params, integration['splitMultiChoice'],False)
    chosen_params.update(outputs)
    url = integrationSteps["url"].replace(f'{{url}}',chosen_params.get('url') or '')+(replace_placeholders(integration['definition'].replace(f'{{job}}',job.get('apiID') or ''),chosen_params))
    chosen_params = prepare_params(job['parameters'], chosen_params, integration['splitMultiChoice'],True)
    outputs.update(chosen_params)
    
    payload=querify(chosen_params,integration['splitMultiChoice'])
    headers = {d['key']: d['value'] for d in integration['headers']} 
    if integration["type"] == "post" and integration['mode'] == 'payload':
        replacedPayload = replace_parameters(integration['parameter'],integration['payload'],chosen_params)
        try:
            payload = FakeDict([(list(k.keys())[0],list(k.values())[0]) for k in replacedPayload])
            if payload.get("something") == "something":
                payload = {k: v for d in replacedPayload for k, v in d.items()}
        except:
            payload = replacedPayload
    http = urllib3.PoolManager(
        cert_reqs = 'CERT_NONE' if integration['ignoreSSL'] else 'CERT_REQUIRED'
    )

    authData = integration['authenticationData'] if integration['overrideAuthentication'] else integrationSteps['authenticationData']
    authType = integration['authentication'] if integration['overrideAuthentication'] else integrationSteps['authentication']
    if authType == "Basic":
        headers.update(urllib3.make_headers(basic_auth="{key}:{value}".format(
            key=authData[0]['value'].replace(f"{{username}}",
            outputs.get("username") or ''),
            value=authData[1]['value'].replace(f"{{password}}",
            outputs.get("password") or '')
        )))
    if authType == "Bearer":
        headers.update({'Authorization': 'Bearer {token}'.format(token=authData[0]['value'].replace(f"{{token}}",outputs.get("token") or ''))})

    update_step_field(task_id,stepIndex,{"url":url,"payload":payload})
    try:
        if integration["type"] == "post" and integration['mode'] == 'payload':
            r = http.request(
                method=integration["type"],
                url=url,
                headers=headers,
                body=json.dumps(payload).encode('utf-8'),
                timeout=15.0,
                retries=urllib3.util.Retry(total=0,backoff_factor=0)
            )
        else:
            r = http.request(
                method=integration["type"],
                url=url,
                headers=headers,
                fields=payload if integration['type'] == 'GET' else [(itm.split('=')[0],itm.split('=')[1]) for itm in payload.split("&")],
                timeout=15.0,
                retries=urllib3.util.Retry(total=0,backoff_factor=0)
            )          
    except Exception as ex:
        trace_error(ex)
        error = str(ex)
    if r:
        if r.status not in range(200, 300):
            try:
                res_json = json.loads(r.data)
                error = res_json["message"]
            except:
                error = "Failure"
    else:
        r = {"status":500,"data":{"message":"empty"}}

    message = error if error else message
    parsingOK = True
    parsingCondition = True
    try:
        res_json = xmltodict.parse(r.data.decode('utf-8'))
    except:
        try:
            res_json = json.loads(r.data)
        except:
            try:
                res_json = r.data.decode('utf-8')
            except:
                res_json = {}
    extracted_outputs = {}
    if integration['parsing']:
        if integration['outputs']:
            if integration['strict'] and (type(integration['outputs']) is not type(res_json)):
                message = "Expected outputs as {o} but got {r}".format(o=type(integration['outputs']),r=type(res_json))
                parsingOK = False
            else:
                try:
                    res_json = json.loads(json.dumps(res_json))
                    extract_placeholder_values(integration['outputs'][0] if isinstance(integration['outputs'],list) else integration['outputs'], res_json, extracted_outputs, integration.get('regex') or {},integration.get('regexMatch') or {})
                    try:
                        transformed_dict = transform_dict(extracted_outputs)
             
                        update_step_field(task_id,stepIndex,{'items':transformed_dict})
                    except:
                        update_step_field(task_id,stepIndex,{'items':[extracted_outputs]})
                    if extracted_outputs:
                        for k, v in extracted_outputs.items():
                            if v is None:
                                message = "got an empty value for key {}".format(k)
                                parsingOK = False   
                            elif isinstance(v,list):
                                if bool(integration.get("removeDuplicates")):
                                    if integration.get("removeDuplicates").get(k):
                                        extracted_outputs[k] = list(set(v))
                    if parsingOK:
                        if bool(integration.get('retryUntil').get('rules')):
                            parsingOK = evaluate_query(integration.get('retryUntil'),extracted_outputs)
                            if not parsingOK:
                                message = "Did not get all outputs to parse yet"        
                                                
                        if bool(integration.get('failWhen').get('rules')):
                            parsingCondition = not evaluate_query(integration.get('failWhen'),extracted_outputs)
                            if not parsingCondition:
                                message = "Failure When Condition is True"
                except Exception as e:
                    trace_error(e)
                    parsingOK = False
                    message = str(e)
                    if hasattr(r, 'status'):
                        r.status = 500
        else:
            extracted_outputs['response'] = json.dumps(res_json)
    update_step_field(task_id,stepIndex,{
        "outputs":extracted_outputs,
        "response":res_json,
        "message":message,
        "status":r['status'] if isinstance(r,dict) else r.status
    })
    return {
        'parsingCondition': parsingCondition,
        'parsingOK': parsingOK,
        "message": message,
        "r":r if r else {},
        "extracted_outputs":extracted_outputs,
        "res_json":res_json,
        "url":url
    }

def evaluate_query(query, data):
    def evaluate_rule(rule, data):
        field = rule["field"]
        operator = rule["operator"]
        value = rule.get("value")
        actual_value = data.get(field)
        if operator == "<=":
            return actual_value <= value
        elif operator == "contains":
            return actual_value in value      
        elif operator == "like":
            pattern = re.compile(value)
            return pattern.match(actual_value)              
        elif operator == ">=":
            return actual_value >= value        
        elif operator == "=":
            return actual_value == value
        elif operator == ">":
            return actual_value > value        
        elif operator == "<":
            return actual_value < value        
        elif operator == "in":
            return actual_value in value
        elif operator == "not in":
            return actual_value not in value        
        elif operator == "is null":
            return actual_value is None
        else:
            raise ValueError("Unknown operator: {}".format(operator))
    
    def evaluate_rules(rules, data, condition):
        result = None
        for rule in rules:
            if "rules" in rule:
                sub_result = evaluate_rules(rule["rules"], data, rule["condition"])
            else:
                sub_result = evaluate_rule(rule, data)
            
            if result is None:
                result = sub_result
            elif condition == "and":
                result = result and sub_result
            elif condition == "or":
                result = result or sub_result
            else:
                raise ValueError("Unknown condition: {}".format(condition))
        return result
    
    return evaluate_rules(query["rules"], data, query["condition"])

def add_prefix_to_keys(d):
    return {f"steps.$.{key}": value for key, value in d.items()}

def update_step_field(task_id,index,value):
    db["tasks"].update_one(
        {'_id': ObjectId(task_id), 'steps': {'$elemMatch': { 'step':  index }}}, {
            '$set': add_prefix_to_keys(value)
        }
    )

# def update_time(task_id):
#     db["tasks"].update_one(
#     {'_id': ObjectId(task_id), "$set":
#         {
#             "update_time":datetime.now()
#         }
#     })


def percent(part, whole):
    return 100-(100 * float(part)/float(whole))

def countTime(task_id,stepIndex):
    stepFinished = False
    run_time = 0
    while not stepFinished:
        time.sleep(1)
        data = db["tasks"].find_one({'_id': ObjectId(task_id)})        
        run_time += 1 
        update_step_field(task_id,stepIndex,{"run_time":run_time})
        db["tasks"].update_one({"_id": ObjectId(task_id)}, {'$inc': {'run_time': 1}},upsert=True)
        stepFinished = data['steps'][stepIndex]['result'] != 0

def process_request(job, integrationSteps,chosen_params,task_id):
    outputs = {}
    integrationSteps['steps'] = [d for d in integrationSteps['steps'] if d.get('name') in job['steps']]
    update_doc = {"job_id":job['_id'],"job_name":job['name'],"steps":[],"done": False,"run_time":0,"creation_time":datetime.now().isoformat(),"integration_id":str(integrationSteps["_id"]),"chosen_params":chosen_params}
    db["tasks"].update_one({"_id": ObjectId(task_id)}, {"$set": update_doc},upsert=True)
    # timer_task = threading.Thread(target=countTimeTask, args=(task_id))
    # timer_task.start()
    for step in integrationSteps['steps']:
        stepIndex = integrationSteps['steps'].index(step)
        retriesLeft = (step['retryCount'] if step['retryCount'] >= 0 else 0)
        retriesDelay = (step['retryDelay'] if step['retryDelay'] >= 0 else 0)

        db["tasks"].update_one(
            {"_id": ObjectId(task_id)}, 
            {
                "$set":
                {
                    "update_time":datetime.now().isoformat()
                },
                "$push": {
                    "steps": {
                        "url": '',
                        "name": step['name'],
                        "step":stepIndex,
                        "outputs": {},
                        "run_time": 0,
                        "result": 0,
                        "percentDone": -1,
                        "status":0,
                        "message":'',
                        "response":{}
                    }
                }
            }, 
            upsert=True)
        timer_step = threading.Thread(target=countTime, args=(task_id,stepIndex))
        timer_step.start()
        res = process_step(job,integrationSteps,chosen_params,step,outputs,task_id,stepIndex)
        # or (not res['parsingOK']))
        status = res["r"]['status'] if isinstance(res["r"],dict) else res["r"].status

        while status not in range(200, 300) and (retriesLeft > 0):
            res = process_step(job,integrationSteps,chosen_params,step,outputs,task_id,stepIndex)
            status = res["r"]['status'] if isinstance(res["r"],dict) else res["r"].status
            retriesLeft -= 1
            update_step_field(task_id,stepIndex,{
                'parsingOK': res['parsingOK'],
                'parsingCondition': res['parsingCondition'],
                'retriesLeft': retriesLeft,
                'percentDone': percent(retriesLeft,step['retryCount'])
            })
            time.sleep(retriesDelay)

        if status in range(200, 300) and step['parsing']:
            timeOutLeft = (step['parsingTimeout'] if step['parsingTimeout'] >= 0 else 0)
            timeOutStartTime = datetime.now()            
            parsingDelay = (step['parsingDelay'] if step['parsingDelay'] >= 0 else 0)
            parsingTimeout = (step['parsingTimeout'] if step['parsingTimeout'] >= 0 else 0)            
            while (res['parsingOK'] is False) and (timeOutLeft > 0):
                res = process_step(job,integrationSteps,chosen_params,step,outputs,task_id,stepIndex)
                status = res["r"]['status'] if isinstance(res["r"],dict) else res["r"].status
                timeOutLeft = int(parsingTimeout - (datetime.now()-timeOutStartTime).total_seconds())
                update_step_field(task_id,stepIndex,{
                    'parsingOK': res['parsingOK'],
                    'timeOutLeft': timeOutLeft,
                    'retriesLeft': retriesLeft,
                    'parsingCondition': res['parsingCondition'],
                    'percentDone': -1
                })                
                if res['parsingCondition'] is False:
                    break
                time.sleep(parsingDelay)
        outputs.update(res["extracted_outputs"])
        outcomeNumber = res_code(status,res['parsingCondition'])
        update_step_field(task_id,stepIndex,{
            'parsingOK': res['parsingOK'],
            'timeOutLeft': 0,
            'parsingCondition': res['parsingCondition'],
            'percentDone': 100,
            'result':outcomeNumber
        })            
    db["tasks"].update_one({"_id": ObjectId(task_id)}, {"$set":{
        "result": (outcomeNumber==2),
        "done": True
    }})

def res_code(status,condition):
    if condition is False:
        return 3
    else:
        if status not in range(200, 300):
            return 1
        else:
            return 2
        
def extract_placeholder_values_list(data, values_data, placeholder_values,regexList,regexMatchList):
    temp_outputs = []
    for item in values_data:
        temp_extracted_outputs = {}
        extract_placeholder_values(data, item, temp_extracted_outputs,regexList,regexMatchList)
        temp_outputs.append(temp_extracted_outputs)
    for d in temp_outputs:
        for l in d:
            if l in placeholder_values:
                if not isinstance(placeholder_values[l], list):
                    placeholder_values[l] = [placeholder_values[l]]
                placeholder_values[l].append(d[l])
            else:
                placeholder_values[l] = d[l]

def extract_regex(regexPlaceholder,value):
    if bool(regexPlaceholder):
        match = re.search(r"\/(.*?)\.", value)
        if match:
            return match.group(1)
        else:
            return value
    else:
        return value
    
def regex_match(pattern,value):
    result = True
    if bool(pattern):
        pattern = re.compile(pattern)
        result = bool(pattern.match(value))
    return result

def extract_placeholder_values(data, values_data, placeholder_values, regexList, regexMatchList):
    if isinstance(values_data, list):
        extract_placeholder_values_list(data, values_data, placeholder_values,regexList,regexMatchList)
    else:
        for key, value in data.items():
            if isinstance(value, str):
                match = re.search(r'{(.*?)}', value)
                if match:
                    placeholder = match.group(1)
                    result = regex_match(regexMatchList.get(placeholder),values_data[key])
                    if result:
                        placeholder_values[placeholder] = extract_regex(regexList.get(placeholder),values_data[key])
                    else:
                        placeholder_values[placeholder] = None
            elif isinstance(value, dict):
                extract_placeholder_values(value, values_data[key], placeholder_values,regexList,regexMatchList)
            elif isinstance(value, list):
                for i in range(len(value)):
                    if isinstance(values_data[key],list):
                        extract_placeholder_values_list(value[i], values_data[key], placeholder_values,regexList,regexMatchList)
                    else:
                        if isinstance(value[i], str):
                            match = re.search(r'{(.*?)}', value[i])
                            if match:
                                placeholder = match.group(1)
                                result = regex_match(regexMatchList.get(placeholder),values_data[key][i])
                                if result:                                
                                    placeholder_values[placeholder] = extract_regex(regexList.get(placeholder),values_data[key][i])
                                else:
                                    placeholder_values[placeholder] = None                                    
                        elif isinstance(value[i], dict):
                            extract_placeholder_values(value[i], values_data[key][i], placeholder_values,regexList,regexMatchList)

def check_placeholder_exists(data, values_data):
    for key, value in data.items():
        if isinstance(value, str):
            match = re.search(r'{(.*?)}', value)
            if match:
                placeholder = match.group(1)
                if placeholder not in values_data:
                    return False
        elif isinstance(value, dict):
            if not check_placeholder_exists(value, values_data[key]):
                return False
        elif isinstance(value, list):
            for i in range(len(value)):
                if isinstance(value[i], str):
                    match = re.search(r'{(.*?)}', value[i])
                    if match:
                        placeholder = match.group(1)
                        if placeholder not in values_data:
                            return False
                elif isinstance(value[i], dict):
                    if not check_placeholder_exists(value[i], values_data[key][i]):
                        return False
    return True

def trigger_job_api(id,chosen_params,task_id):

    try:
        data = db["jobs"].find_one({'_id': ObjectId(id)})
    except:
        data = db["jobs"].find_one({'name': id})
    db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    integration = db["integrations"].find_one({'name': db_doc["integration"]})
    integration_doc = {k: v if k != '_id' else str(v) for k, v in integration.items()}    
    process_request(db_doc,integration_doc,chosen_params,task_id)

    
    # try:
    #     data = db["jobs"].find_one({'_id': ObjectId(id)})
    # except:
    #     data = db["jobs"].find_one({'name': id})
    # db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    # integration = db["integrations"].find_one({'name': db_doc["integration"]})
    # integration_doc = {k: v if k != '_id' else str(v) for k, v in integration.items()}    
    # process_request(db_doc,integration_doc,chosen_params,task_id)