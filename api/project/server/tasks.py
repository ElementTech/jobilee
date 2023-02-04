import os
import time
from celery import Celery, Task
from project.server.functions import trigger_job_api
import yaml 
from pymongo import MongoClient
import bson
import datetime
from bson import json_util, ObjectId
celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
celery.conf.update(result_extended=True) 

# @celery.task(name="create_task")
# def create_task(task_type):
#     print(task_type)
#     time.sleep(int(task_type) * 10)
#     return True

db = MongoClient(yaml.load(open('database.yaml'),Loader=yaml.FullLoader)['uri'])['jobilee']

@celery.task(name="trigger_api_task",bind=True)
def trigger_api_task(self,id,chosen_params):
    return trigger_job_api(id,chosen_params,self.request.id)

@celery.task(name="trigger_api_chart_task",bind=True)
def trigger_chart_job_task(chosen_params,id):

    update_doc = {
        "done": False,
        "result": False,
        "outputs": {},
        "run_time":0,
        "creation_time":datetime.now().isoformat(),
        "message": "",
        "chosen_params":chosen_params
    }

    db["chart_tasks"].update_one({"_id": ObjectId(id)}, {"$set": update_doc},upsert=True)

    taskQueue = []
    for job in chosen_params['jobs']:
        taskQueue.append(trigger_api_task.apply_async(args=[job,{}],task_id=str(bson.ObjectId())))
    finished = False
    while not finished:
        for task in taskQueue:
            finished = finished and task.ready()
    taskResults = {}
    success = True
    for task in taskQueue:
        taskResults[task.id] = db.find_one({"_id": ObjectId(task.id)})
        if taskResults[task.id]['result'] != 2:
            message = "task {} of job {} failed. ".format(task.id,taskResults[task.id]['job_name'])
            success = False
    if success:
        labels = []
        datasets = []
        
        # [
        #         {
        #             label: 'My First dataset',
        #             backgroundColor: '#42A5F5',
        #             data: [65, 59, 80, 81, 56, 55, 40]
        #         },
        #         {
        #             label: 'My Second dataset',
        #             backgroundColor: '#FFA726',
        #             data: [28, 48, 40, 19, 86, 27, 90]
        #         }
        # ]

        for v in taskResults.values():
            if v['job_name'] == chosen_params['label']['job']:
                for step in v['steps']:
                    if step['name'] == chosen_params['label']['name']:
                        if isinstance(step['items'],list):
                            for output in step['items']:
                                labels.append(output[chosen_params['label']['outputs']])
        for dataset in chosen_params['definitionTemplate']:
            for v in taskResults.values():
                for step in v['steps']:
                    if step['name'] == dataset['output'][0]['step'] and v['job_name'] == dataset['output'][0]['job']:
                        if isinstance(step['items'],list):
                            data_counter = {item: 0 for item in labels}
                            for label in labels:
                                for output in step['items']:
                                    if output[chosen_params['label']['outputs']] == label:
                                        condition = dataset['condition']
                                        if condition is "==":
                                            if output[dataset['output'][0]['outputs']] == dataset['value']:
                                                data_counter[label] += 1    
                                        if condition is "!=":
                                            if output[dataset['output'][0]['outputs']] != dataset['value']:
                                                data_counter[label] += 1
                                        if condition is "contains":
                                            if dataset['value'] in output[dataset['output'][0]['outputs']]:
                                                data_counter[label] += 1         
                                        if condition is "in":
                                            if output[dataset['output'][0]['outputs']] != dataset['value'] in dataset['value'].split(","):
                                                data_counter[label] += 1                      
                                        if condition is ">":
                                            if output[dataset['output'][0]['outputs']] > dataset['value']:
                                                data_counter[label] += 1    
                                        if condition is "<":
                                            if output[dataset['output'][0]['outputs']] < dataset['value']:
                                                data_counter[label] += 1
                                        if condition is ">=":
                                            if output[dataset['output'][0]['outputs']] >= dataset['value']:
                                                data_counter[label] += 1         
                                        if condition is "<=":
                                            if output[dataset['output'][0]['outputs']] <= dataset['value']:
                                                data_counter[label] += 1                                                                                                                         
                            datasets.append({
                                "label": dataset['name'],
                                "data": data_counter.values()
                            })
        db["chart_tasks"].update_one({"_id": ObjectId(id)}, {"$set": {
            "done": True,
            "result": True,
            "output": {
                labels: labels,
                datasets: datasets
            }
        }},upsert=True)
    else:
        db["chart_tasks"].update_one({"_id": ObjectId(id)}, {"$set": {
            "done": True
        }},upsert=True)

def get_task_meta(task_id):
    return celery.backend.get_task_meta(task_id)

def get_old_task(meta):
    print(meta)
    return celery.tasks[meta['name']]