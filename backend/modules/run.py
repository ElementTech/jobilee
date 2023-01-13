from flask import jsonify
from flask_cors import CORS
from utilities.utilities import *
from bson.objectid import ObjectId
# Import Libraries 
from app import app

db = get_db_client()

@app.route('/run/<string:id>', methods=['POST'])
def run(id):
    data = db["jobs"].find_one({'_id': ObjectId(id)})
    db_doc = {k: v if k != '_id' else str(v) for k, v in data.items()}
    db_doc.update({'_id': str(db_doc['_id'])} if '_id' in db_doc else {})    
    return jsonify(parse_json(db_doc))