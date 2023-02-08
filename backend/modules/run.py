from flask import request, jsonify
from flask_cors import CORS
from bson.objectid import ObjectId
# Import Libraries 
import jsonpickle
import requests
import os
from app import app

url = os.environ.get('API_URL') or "http://localhost"
port = os.environ.get('API_PORT') or "5000"

@app.route('/api/run/<string:id>', methods=['POST'])
def run(id):
    resp = requests.post(url=f"{url}:{port}/tasks/"+id,json = request.json)
    return (resp.text, resp.status_code, resp.headers.items())

@app.route('/api/retry/<string:task_id>', methods=['POST'])
def retry(task_id):
    resp = requests.post(url=f"{url}:{port}/tasks/retry/" + task_id)
    return (resp.text, resp.status_code, resp.headers.items())

@app.route('/api/chart/render', methods=['POST'])
@app.route('/api/chart/render/<string:name>', methods=['POST'])
def chart(name=None):
    if name:
        resp = requests.post(url=f"{url}:{port}/chart/tasks/"+name,json = request.json)
        return (resp.text, resp.status_code, resp.headers.items())      
    else:  
        resp = requests.post(url=f"{url}:{port}/chart/tasks",json = request.json)
        return (resp.text, resp.status_code, resp.headers.items())

