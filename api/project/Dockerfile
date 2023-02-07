FROM python:3.9-alpine

RUN addgroup -g 500 celery \
 && adduser -S -D -G celery -u 500 celery \
 && apk add --no-cache \
    su-exec \
    bash \
    gcc \
    musl-dev \
 && pip install \
    redis=="3.2.1" \
    celery=="4.3.0" \
    celery-message-consumer=="1.1.1"

COPY celeryconfig.py /home/celery/
COPY tasks.py docker-entrypoint.sh /

WORKDIR /home/celery

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["celery", "worker", "-A", "tasks", "-l", "info"]