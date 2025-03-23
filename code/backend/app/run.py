from app import create_app
from app.extensions import socketio
from app.celery_conf import make_celery
app = create_app()
app.app_context().push() 

celery_app = make_celery(app)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True,allow_unsafe_werkzeug=True)
    