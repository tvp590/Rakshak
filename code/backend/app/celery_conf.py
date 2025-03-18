from celery import Celery, Task
from app.config import Config 
import os

def make_celery(flask_app=None):
    celery = Celery(
        "celery_worker", 
        broker=os.environ.get('REDIS_URL', 'redis://redis_container:6379/0'), 
        backend=os.environ.get('REDIS_URL', 'redis://redis_container:6379/0'),
        include=[
            "app.services.tasks.stream_task",
            "app.services.tasks.detection_task",
            "app.services.tasks.email_task",
        ],
    )

    celery.conf.update(
        task_default_queue="celery",
        task_default_exchange="celery",
        task_default_routing_key="celery",
        accept_content=["json"],
        task_serializer="json",
        result_serializer="json",
        timezone="UTC", 
        enable_utc=True,
    )

    if flask_app:
        class FlaskTask(Task):
            def __call__(self, *args, **kwargs):
                with flask_app.app_context():
                    return self.run(*args, **kwargs)

        celery.Task = FlaskTask 
        flask_app.extensions["celery"] = celery

    return celery

# celery_app = make_celery()
