from flask import request, jsonify
from flask_cors import CORS
from utilities.utilities import *
from bson.objectid import ObjectId
# Import Libraries 
import jsonpickle
from app import app

@app.route('/run/<string:id>', methods=['POST'])
def run(id):
    resp = trigger_job_api(id,request.json)
    return resp.data, resp.status