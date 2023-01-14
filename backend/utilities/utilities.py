from bson import json_util, ObjectId
import json
from collections.abc import MutableMapping
from pymongo import MongoClient
import yaml
import urllib3
import requests
import urllib.request 
import urllib.parse 

db = MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']
http = urllib3.PoolManager()

def parse_json(data):
    return json.loads(json_util.dumps(data))

def prepare_params(job_params, chosen_params):
    for p in job_params:
        if not p['name'] in chosen_params:
            if p['type'] == 'text':
                chosen_params['name'] = p['default'] if 'default' in p else ''
            if p['type'] == 'choice' or p['type'] == 'multi-choice':
                chosen_params['name'] = p['default'] if 'default' in p else p['choices'][0]
    return chosen_params

def replace_template(template, key_value_pairs):
    param_list = []
    for k, v in key_value_pairs.items():
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
            parameter_holder = {k: v for d in new_parameters for k, v in d.items()}
    return parameter_holder

def process_request(job, integration,chosen_params):
    chosen_params = prepare_params(job['parameters'], chosen_params)
    url = integration["url"]+(integration['definition'].replace(f'{{job}}',job['name']))
    payload=chosen_params

    if integration["type"] == "post":
        payload = replace_parameters(integration['parameter'],integration['payload'],chosen_params)
    
    if integration["type"] == "get":    
        query_string = urllib.parse.urlencode( chosen_params ) 
        url = url + "?" + query_string 

    print(url)
    r = http.request(
        integration["type"],
        url,
        fields=payload,
    )
    return r

def trigger_job_api(id,chosen_params):
    data = db["jobs"].find_one({'_id': ObjectId(id)})
    db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    integration = db["integrations"].find_one({'name': db_doc["integration"]})
    integration_doc = {k: v if k != '_id' else str(v) for k, v in integration.items()}    
    return process_request(db_doc,integration_doc,chosen_params)
