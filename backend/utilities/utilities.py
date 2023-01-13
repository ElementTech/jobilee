from bson import json_util
import json 
from pymongo import MongoClient
import yaml

def parse_json(data):
    return json.loads(json_util.dumps(data))

def get_db_client():
    return MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']