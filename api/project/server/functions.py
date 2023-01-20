from bson import json_util, ObjectId
import json
import re
from pymongo import MongoClient
import yaml
import urllib3
import urllib.request 
import urllib.parse
import time
from celery import Celery, current_task
from datetime import datetime

class FakeDict(dict):
    def __init__(self, items):
        if items != []:
            self['something'] = 'something'
        self._items = items
    def items(self):
        return self._items

db = MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']

def parse_json(data):
    return json.loads(json_util.dumps(data))

def prepare_params(job_params, chosen_params, splitMultiChoice):
    for p in job_params:
        if not p['name'] in chosen_params:
            if p['type'] == 'text':
                chosen_params['name'] = p['default'] if 'default' in p else ''
            if p['type'] == 'choice' or p['type'] == 'multi-choice':
                chosen_params['name'] = p['default'] if 'default' in p else p['choices'][0]
 
    for x, y in list(chosen_params.items()):
        for p in job_params:
            if p['name'] == x:
                if p['type'] == "multi-choice":
                    temp = y
                    if isinstance(temp, list):
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

def replace_template(template, key_value_pairs):
    param_list = []
    for k, v in key_value_pairs.items():
        if isinstance(v, list):
            for p in v:
                param_list.append(json.loads(json.dumps(template).replace(f"{{key}}",k).replace(f"{{value}}",p)))
        else:
            param_list.append(json.loads(json.dumps(template).replace(f"{{key}}",k).replace(f"{{value}}",v)))

    return param_list

def replace_parameters(template, parameter_holder, key_value_pairs):
    if isinstance(parameter_holder, list):
        if parameter_holder.count('{parameter}') > 0:
            new_parameters = replace_template(template, key_value_pairs)
            parameter_holder.remove('{parameter}')
            parameter_holder.extend(new_parameters)
        else:
            for i in parameter_holder:
                replace_parameters(template, i, key_value_pairs)
    elif isinstance(parameter_holder, dict):
        for k, v in parameter_holder.items():
            replace_parameters(template, v, key_value_pairs)
    elif isinstance(parameter_holder, str):
        if parameter_holder == f'{{parameter}}':
            new_parameters = replace_template(template, key_value_pairs)
            parameter_holder = new_parameters
    return parameter_holder

def querify(chosen_params,splitMultiChoice):
    return urllib.parse.urlencode(chosen_params, doseq=splitMultiChoice, safe=',~()*!.\'') 

def replace_placeholders(string, values):
    for key in values:
        string = string.replace("{" + key + "}", str(values[key]))
    return string

def process_step(job, integrationSteps,chosen_params,integration,outputs):
    message = "Success"
    chosen_params = prepare_params(job['parameters'], chosen_params, integration['splitMultiChoice'])
    url = integrationSteps["url"]+(replace_placeholders(integration['definition'].replace(f'{{job}}',job['apiID']),outputs))
    payload=querify(chosen_params,integration['splitMultiChoice'])
    headers = {d['key']: d['value'] for d in integration['headers']} 

    if integration["type"] == "post" and integration['mode'] == 'payload':
        payload = FakeDict([(list(k.keys())[0],list(k.values())[0]) for k in replace_parameters(integration['parameter'],integration['payload'],chosen_params)])
    
    http = urllib3.PoolManager(
        cert_reqs = 'CERT_NONE' if integration['ignoreSSL'] else 'CERT_REQUIRED'
    )
    if integration['authentication'] == "Basic":
        headers.update(urllib3.make_headers(basic_auth="{key}:{value}".format(key=integration['authenticationData'][0]['value'],value=integration['authenticationData'][1]['value'])))
    if integration['authentication'] == "Bearer":
        headers = headers + {'Authorization': 'Bearer ' + integration['authenticationData'][0]['value']}
    if integration["type"] == "post" and integration['mode'] == 'payload':
        r = http.request(
            method=integration["type"],
            url=url,
            headers=headers,
            body=json.dumps(payload).encode('utf-8'),
            retries=urllib3.util.Retry(total=integration['retryCount'],backoff_factor=integration['retryDelay'])
        )
    else:
        r = http.request(
            method=integration["type"],
            url=url,
            headers=headers,
            fields=payload if integration['type'] == 'GET' else [(itm.split('=')[0],itm.split('=')[1]) for itm in payload.split("&")],
            retries=urllib3.util.Retry(total=integration['retryCount'],backoff_factor=integration['retryDelay'])
        )          

    parsingOK = True
    res_json = r.data
    extracted_outputs = {}
    if integration['parsing']:
        if integration['outputs']:
            try:
                res_json = json.loads(r.data)
                extract_placeholder_values(integration['outputs'], res_json, extracted_outputs)
                if bool(integration.get('retryUntil')):
                    for k, v in integration['retryUntil'].items():
                        if k in extracted_outputs:
                            if v != extracted_outputs[k]:
                                parsingOK = False
                        else:
                            parsingOK = False
                else:
                    if extracted_outputs:
                        for k, v in extracted_outputs.items():
                            if v is None:
                                parsingOK = False
            except Exception as e:
                print("Error")
                print(e)
                parsingOK = False
                message = str(e)
        
    return {
        'extracted_outputs': extracted_outputs,
        'parsingOK': parsingOK,
        "message": message if r.status in range(200,300) else "Failure",
        "r":r,
        "extracted_outputs":extracted_outputs,
        "res_json":res_json,
        "url":url
    }

def update_step_field(task_id,index,key,value):
    db["tasks"].update_one(
        {'_id': ObjectId(task_id), 'steps': {'$elemMatch': { 'step':  index }}}, {'$set': {'steps.$.'+key: value}
    })

def percent(part, whole):
    return 100-(100 * float(part)/float(whole))

def process_request(job, integrationSteps,chosen_params,task_id):

    outputs = {}

    for step in integrationSteps['steps']:
        update_doc = {"job_id":job['_id'],"steps":[],"update_time":datetime.now(),"integration_id":str(integrationSteps["_id"])}
        db["tasks"].update_one({"_id": ObjectId(task_id)}, {"$set": update_doc},upsert=True)
    resultAggregator = True
    for step in integrationSteps['steps']:
        stepIndex = integrationSteps['steps'].index(step)
        retriesLeft = (step['retryCount'] if step['retryCount'] >= 0 else 0)
        retriesDelay = (step['retryDelay'] if step['retryDelay'] >= 0 else 0)
        res = process_step(job,integrationSteps,chosen_params,step,outputs)

        db["tasks"].update_one(
            {"_id": ObjectId(task_id)}, 
            {
                "$set":
                {
                    "update_time":datetime.now()
                },
                "$push": {
                    "steps": {
                        "url": res["url"],
                        "step":stepIndex,
                        "outputs": res['extracted_outputs'],
                        "result": 0,
                        "percentDone": 0,
                        "status":res["r"].status,
                        "message":res["message"],
                        "response":res["res_json"]
                    }
                }
            }, 
            upsert=True)

        while((res["r"].status not in range(200, 300)) or (not res['parsingOK'])):
            if (retriesLeft > 0) or step['retryUntil']:
                time.sleep(retriesDelay)
                res = process_step(job,integrationSteps,chosen_params,step,outputs)
                retriesLeft -= 1
                update_step_field(task_id,stepIndex,"parsingOK",res['parsingOK'])
                update_step_field(task_id,stepIndex,"retriesLeft",retriesLeft)
                update_step_field(task_id,stepIndex,"percentDone",percent(retriesLeft,step['retryCount']))
                update_step_field(task_id,stepIndex,"response",res["res_json"])
                update_step_field(task_id,stepIndex,"message",res["message"])
                update_step_field(task_id,stepIndex,"status",res["r"].status)
                update_step_field(task_id,stepIndex,"outputs",res['extracted_outputs'])
        update_step_field(task_id,stepIndex,"percentDone",100)
        outputs.update(res["extracted_outputs"])
        outcomeNumber = 1 if (res["r"].status not in range(200, 300)) or (not res['parsingOK']) else 2
        resultAggregator = (resultAggregator and outcomeNumber==2)
        update_step_field(task_id,stepIndex,"result",outcomeNumber)

    db["tasks"].update_one({"_id": ObjectId(task_id)}, {"$set":{"result":
        resultAggregator
    }})

def trigger_job_api(id,chosen_params,task_id):
    data = db["jobs"].find_one({'_id': ObjectId(id)})
    db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    integration = db["integrations"].find_one({'name': db_doc["integration"]})
    integration_doc = {k: v if k != '_id' else str(v) for k, v in integration.items()}    
    process_request(db_doc,integration_doc,chosen_params,task_id)

def extract_placeholder_values(data, values_data, placeholder_values):
    for key, value in data.items():
        if isinstance(value, str):
            match = re.search(r'{(.*?)}', value)
            if match:
                placeholder = match.group(1)
                placeholder_values[placeholder] = values_data[key]
        elif isinstance(value, dict):
            extract_placeholder_values(value, values_data[key], placeholder_values)
        elif isinstance(value, list):
            for i in range(len(value)):
                if isinstance(value[i], str):
                    match = re.search(r'{(.*?)}', value[i])
                    if match:
                        placeholder = match.group(1)
                        placeholder_values[placeholder] = values_data[key][i]
                elif isinstance(value[i], dict):
                    extract_placeholder_values(value[i], values_data[key][i], placeholder_values)

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
