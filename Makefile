projectname?=jobilee

default: help

.PHONY: help
help: ## list makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev: web back worker-api celery-worker mongodb redis

web: ## Run Angular Frontend
	@echo cd frontend
	@echo ng serve

back: ## Run Flask Backend
	@echo cd backend
	@echo CELERY_BROKER_URL=redis://localhost:6379/0 \
		CELERY_RESULT_BACKEND=redis://localhost:6379/0 \
		APP_SETTINGS=project.server.config.DevelopmentConfig \
		reload python3 manage.py run -h 0.0.0.0 -p 5001

worker-api: ## Run Celery Workers Flask API
	@echo cd api
	@echo nodemon --exec python3 run.py --host=0.0.0.0

celery-worker: ## Run Celery Worker
	@echo cd api
	@echo nodemon --exec CELERY_BROKER_URL=redis://localhost:6379/0 \
	CELERY_RESULT_BACKEND=redis://localhost:6379/0 \
	FLASK_DEBUG=1 APP_SETTINGS=project.server.config.DevelopmentConfig \
	reload celery --app project.server.tasks worker --loglevel=info --logfile=project/logs/celery.log

mongodb: ## Run MongoDB
	@echo docker run -p 27017:27017 -v /data/db:/data/db --name mongodb mongo	

redis: ## Run Redis
	@echo redis-server		