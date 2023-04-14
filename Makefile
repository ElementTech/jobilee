projectname?=jobilee

default: help

.PHONY: help
help: ## list makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

export CELERY_BROKER_URL := redis://localhost:6379/0
export CELERY_RESULT_BACKEND := redis://localhost:6379/0
export APP_SETTINGS := project.server.config.DevelopmentConfig
export MONGODB_URI := mongodb://localhost:27017/jobilee
export FLASK_DEBUG := 1

.PHONY: dev # Run the jobilee application in development mode.
dev:
	$(MAKE) -j web backend worker-api worker

.PHONY: web
web: ## Run Angular Frontend
	cd frontend && ng serve

.PHONY: worker-api
worker-api: ## Run Flask Backend
	cd api && reload python3 manage.py run -h 0.0.0.0 -p 5001

.PHONY: backend
backend: ## Run Celery Workers Flask API
	cd backend && reload python3 run.py --host=0.0.0.0

.PHONY: worker
worker: ## Run Celery Worker
	cd api && reload celery --app project.server.tasks worker --loglevel=info --logfile=project/logs/celery.log

# mongodb: ## Run MongoDB
# 	@echo docker run -p 27017:27017 -v /data/db:/data/db --name mongodb mongo	

# redis: ## Run Redis
# 	@echo redis-server		