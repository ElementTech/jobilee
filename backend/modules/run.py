from flask import request, jsonify
from flask_cors import CORS
from bson.objectid import ObjectId
# Import Libraries 
import jsonpickle
import requests
from app import app

@app.route('/run/<string:id>', methods=['POST'])
def run(id):
    resp = requests.post(url="http://localhost:5001/tasks/"+id,json = request.json)
    return (resp.text, resp.status_code, resp.headers.items())