from bson import json_util, ObjectId
import json
from pymongo import MongoClient
import yaml
import urllib3
import urllib.request 
import urllib.parse

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

def process_request(job, integration,chosen_params):
    chosen_params = prepare_params(job['parameters'], chosen_params, integration['splitMultiChoice'])
    url = integration["url"]+(integration['definition'].replace(f'{{job}}',job['apiID']))
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
        )
    else:
        r = http.request(
            method=integration["type"],
            url=url,
            headers=headers,
            fields=payload if integration['type'] == 'GET' else ((itm.split('=')[0],itm.split('=')[1]) for itm in payload.split("&"))
        )        
    return r

def trigger_job_api(id,chosen_params):
    data = db["jobs"].find_one({'_id': ObjectId(id)})
    db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    integration = db["integrations"].find_one({'name': db_doc["integration"]})
    integration_doc = {k: v if k != '_id' else str(v) for k, v in integration.items()}    
    return process_request(db_doc,integration_doc,chosen_params)
