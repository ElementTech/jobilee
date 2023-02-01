import os
import time
from celery import Celery, Task
from project.server.functions import trigger_job_api

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
celery.conf.update(result_extended=True) 

# @celery.task(name="create_task")
# def create_task(task_type):
#     print(task_type)
#     time.sleep(int(task_type) * 10)
#     return True

@celery.task(name="trigger_api_task",bind=True)
def trigger_api_task(self,id,chosen_params):
    return trigger_job_api(id,chosen_params,self.request.id)

def get_task_meta(task_id):
    return celery.backend.get_task_meta(task_id)

def get_old_task(meta):
    print(meta)
    return celery.tasks[meta['name']]