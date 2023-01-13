from flask import request, jsonify
from flask_cors import CORS
from utilities.utilities import *
from bson.objectid import ObjectId
# Import Libraries 
from app import app

@app.route('/run/<string:id>', methods=['POST'])
def run(id):
    return jsonify(parse_json(trigger_job_api(id,request.json)))