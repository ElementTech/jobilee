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

@app.route('/retry/<string:task_id>', methods=['POST'])
def retry(task_id):
    resp = requests.post(url="http://localhost:5001/tasks/retry/" + task_id)
    return (resp.text, resp.status_code, resp.headers.items())

@app.route('/chart/render/<string:name>', methods=['POST'])
def chart(name):
    if name:
        resp = requests.post(url="http://localhost:5001/chart/tasks/"+name,json = request.json)
        return (resp.text, resp.status_code, resp.headers.items())      
    else:  
        resp = requests.post(url="http://localhost:5001/chart/tasks",json = request.json)
        return (resp.text, resp.status_code, resp.headers.items())

