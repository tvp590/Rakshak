from celery import Celery, Task
from app.config import Config 

def make_celery(flask_app=None):
    celery = Celery(
        "celery_worker", 
        broker=Config.CELERY_BROKER_URL,
        backend=Config.CELERY_RESULT_BACKEND
    )
    celery.conf.update(
        broker_url=Config.CELERY_BROKER_URL,
        result_backend=Config.CELERY_RESULT_BACKEND,
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

celery_app = make_celery()  
