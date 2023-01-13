from bson import json_util, ObjectId
import json 
from pymongo import MongoClient
import yaml
import requests

db = MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']

def parse_json(data):
    return json.loads(json_util.dumps(data))

def prepare_params(job_params, chosen_params):
    for p in job_params:
        if not p['name'] in chosen_params:
            if p['type'] == 'text' or p['type'] == 'multi-choice':
                chosen_params['name'] = p['default'] if 'default' in p else ''
            if p['type'] == 'choice':
                chosen_params['name'] = p['choices'][0]
    return chosen_params

def replace_keys_values(existing_json, key_value_json):
    # check if existing_json is a list or a dict
    if isinstance(existing_json, list):
        # iterate over the list
        for i in range(len(existing_json)):
            existing_json[i] = replace_keys_values(existing_json[i], key_value_json)
    elif isinstance(existing_json, dict):
        # iterate over the dict
        for key in existing_json:
            existing_json[key] = replace_keys_values(existing_json[key], key_value_json)
    else:
        # check if existing_json is a string
        if isinstance(existing_json, str):
            # check if existing_json contains "{key}" or "{value}"
            if "{key}" in existing_json:
                existing_json = existing_json.replace("{key}", key)
            if "{value}" in existing_json:
                existing_json = existing_json.replace("{value}", json.dumps(key_value_json.get(key)))
    return existing_json

def prepare_payload(payload, job_params, chosen_params):
    chosen_params = prepare_params(job_params, chosen_params)
    return replace_keys_values(payload, chosen_params)

def process_request(job, integration,chosen_params):
    # url = integration["url"].replace(b'{job}',job['name'])
    # if integration["type"] == "post":
    #     response = requests.post(url, json=prepare_payload(integration['payload'],job['parameters'],chosen_params))
    # if integration["type"] == "get":     
    #     response = requests.get(url, params=prepare_params(job['parameters'],chosen_params))

    # return response.json()
    return prepare_payload(integration['payload'],job['parameters'],chosen_params)

def trigger_job_api(id,chosen_params):
    data = db["jobs"].find_one({'_id': ObjectId(id)})
    db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    integration = db["integrations"].find_one({'name': db_doc["integration"]})
    integration_doc = {k: v if k != '_id' else str(v) for k, v in integration.items()}    
    return process_request(db_doc,integration_doc,chosen_params)
