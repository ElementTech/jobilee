import json
from bson import json_util, ObjectId
from flask import request, jsonify
from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
import pymongo
import yaml
# Import Libraries 
from app import app
def parse_json(data):
    return json.loads(json_util.dumps(data))
db = MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']

def extract_values(obj):
    if isinstance(obj, dict):
        values = []
        for v in obj.values():
            values.extend(extract_values(v))
        return values
    elif isinstance(obj, list):
        values = []
        for item in obj:
            values.extend(extract_values(item))
        return values
    elif isinstance(obj, str) and obj.startswith("{") and obj.endswith("}"):
        return [obj.strip("{}")]
    else:
        return []

@app.route('/jobs/outputs', methods=['GET','POST'])
def outputs():
    # GET all data from database
    if request.method == 'GET':
        output = []
        allData = db["jobs"].find()
        for job in allData:
            integration = db['integrations'].find_one({'name': job['integration']})
            if integration:
                output.append({
                    "label": job['name'],
                    "data": job['name'],
                    "expandedIcon": "pi pi-folder-open",
                    "collapsedIcon": "pi pi-folder",
                    "type": "job",
                    "children": [
                        {"label": step['name'], "icon": "pi pi-bolt", 
                        "expandedIcon": "pi pi-folder-open",
                        "collapsedIcon": "pi pi-folder",
                        "job": job['name'],
                        "type": "step",
                        "data": step['name'], 'children': [
                            {"label": out, "icon": "pi pi-cloud-download", 
                            "expandedIcon": "pi pi-folder-open",
                            "job": job['name'],
                            "step": step['name'],
                            "type": "output",
                            "selectable": False,
                            "collapsedIcon": "pi pi-folder",
                            "data": out} for out in extract_values(step['outputs'])
                        ]} for step in integration['steps'] if step['outputs']
                    ]
                })
        return jsonify(parse_json(output))
    if request.method == 'POST':
        data = combine_outputs(extract_data(request.json))
        for dict_item in data:
            for key in dict_item:
                if isinstance(dict_item[key],dict):
                    dict_item[key] = dict_item[key]['data']
        return jsonify(parse_json(data))

def combine_outputs(input_list):
    result = {}
    for input_dict in input_list:
        step = input_dict["step"]
        for out in input_dict["outputs"]:
            result[out] = {
                "job": input_dict["job"],
                "step": step,
                "outputs": out,
            }
        # if step in result:
        #     result[step]["outputs"] += input_dict["outputs"]
        # else:
        #     result[step] = {
        #         "job": input_dict["job"],
        #         "step": step,
        #         "outputs": input_dict["outputs"],
        #     }
    return list(result.values())


def extract_data(input_list):
    result = []
    for input_dict in input_list:
        if input_dict["type"] == "job":
            result.extend(extract_data(input_dict["children"]))
        elif input_dict["type"] == "output":
            result.append({
                "job": input_dict["job"],
                "step": input_dict["step"],
                "outputs": input_dict["data"],
            })      
        elif input_dict["type"] == "step":
            outputs = [out["data"] for out in input_dict["children"]]
            if len(outputs) > 0:
                result.append({
                    "job": input_dict["job"],
                    "step": input_dict["data"],
                    "outputs": outputs,
                })
    return result

@app.route('/<collection>', methods=['POST', 'GET','DELETE'])
def data(collection):
    # POST a data to database
    if request.method == 'POST':
        db_doc = {k: (str(v) if k == '_id' else v) for k, v in request.json.items()}
        db[collection].insert_one(db_doc)
        db_doc.update({'_id': str(db_doc['_id'])} if '_id' in db_doc else {})
        return jsonify({'status': 'Data is posted to MongoDB!', **db_doc})
        
    # GET all data from database
    if request.method == 'GET':
        allData = db[collection].find()
        dataJson = [{k: (str(v) if k == '_id' else v) for k, v in data.items()} for data in allData]
        # print([{k: (str(v) if k == '_id' else v) for k, v in data.items()} for data in tasks])
        if collection == "jobs":
            for job in dataJson:
                history = db['tasks'].find({'job_id':job['_id']}).sort('creation_time', -1).limit(2)
                dataJson[dataJson.index(job)]["history"] = [d['result'] for d in history if 'result' in d]
        return jsonify(parse_json(dataJson))

@app.route('/<collection>/<string:id>', methods=['GET', 'DELETE', 'PUT'])
@app.route('/<collection>/<string:key>/<string:value>', methods=['GET','DELETE'])
def onedata(collection,id=None,key=None,value=None):
    if id:
        # GET all data from database
        if request.method == 'GET':
            data = db[collection].find_one({'_id': ObjectId(id)})
            if data:
                db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
                db_doc.update({'_id': str(db_doc['_id'])} if '_id' in db_doc else {})    
            else:
                db_doc = {}
            return jsonify(parse_json(db_doc))
            
        # DELETE a data
        if request.method == 'DELETE':
            db[collection].delete_many({'_id': ObjectId(id)})
            print('\n # Deletion successful # \n')
            return jsonify({'status': 'Data id: ' + id + ' is deleted!'})

        # UPDATE a data by id
        if request.method == 'PUT':
            update_doc = {k: v for k, v in request.json.items() if k != '_id'}
            db[collection].update_one(
                {'_id': ObjectId(id)},
                { "$set": update_doc }
            )
            return jsonify({'status': 'Data id: ' + id + ' is updated!'})
    else:
        # GET all data from database
        if request.method == 'GET':
            allData = db[collection].find({key:value}).limit(100).sort('creation_time', -1)
            dataJson = [{k: (str(v) if k == '_id' else v) for k, v in data.items()} for data in allData]
            return jsonify(parse_json(dataJson))
            
        # DELETE a data
        if request.method == 'DELETE':
            db[collection].delete_many({key:value})
            print('\n # Deletion successful # \n')
            return jsonify({'status': 'collection: ' + collection + ' is clear of ' + key + ":" + value})
    

if __name__ == '__main__':
    app.debug = True
    app.run()