# project/server/main/views.py
from project.server.tasks import trigger_api_task,get_old_task,get_task_meta,trigger_chart_job_task

from celery.result import AsyncResult
import bson
from flask import render_template, Blueprint, jsonify, request

main_blueprint = Blueprint("main", __name__,)

@main_blueprint.route("/tasks/<job_id>", methods=["POST"])
def run_task(job_id):
    task = trigger_api_task.apply_async(args=[job_id,request.json],task_id=str(bson.ObjectId()))
    return jsonify({"task_id": task.id}), 202

@main_blueprint.route("/chart/tasks", methods=["POST"])
def run_chart_task():
    task = trigger_chart_job_task.apply_async(args=[request.json],task_id=str(bson.ObjectId()))
    return jsonify({"task_id": task.id}), 202

@main_blueprint.route("/tasks/retry/<task_id>", methods=["POST"])
def retry_task(task_id):
    meta = get_task_meta(task_id)
    task = get_old_task(meta)
    task.apply_async(args=meta['args'], kwargs=meta['kwargs'],task_id=task_id)
    return jsonify({"task_id": task_id}), 202

@main_blueprint.route("/tasks/<task_id>", methods=["GET"])
def get_status(task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return jsonify(result), 200