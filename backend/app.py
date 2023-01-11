import json
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
from bson import json_util
import yaml

app = Flask(__name__)
config = yaml.load(open('database.yaml'))
client = MongoClient(config['uri'])
# db = client.lin_flask
db = client['jobilee']
CORS(app)

def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/<collection>', methods=['POST', 'GET'])
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
        return jsonify(parse_json(dataJson))

@app.route('/<collection>/<string:id>', methods=['GET', 'DELETE', 'PUT'])
def onedata(collection,id):

    # GET all data from database
    if request.method == 'GET':
        data = db[collection].find_one({'_id': ObjectId(id)})
        db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
        db_doc.update({'_id': str(db_doc['_id'])} if '_id' in db_doc else {})    
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

if __name__ == '__main__':
    app.debug = True
    app.run()