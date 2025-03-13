from flask import Flask
from .extensions import db, migrate, login_manager, socketio, mail
from .config import Config
from .routes import user_bp, auth_bp, institution_bp, cctv_bp, stream_bp, alert_bp
from flask_cors import CORS
from .socketio_events import socketio
from .redis_service import start_redis_listener
from .celery_conf import make_celery

def create_app():
    app = Flask(__name__)

    try:
        app.config.from_object(Config)

        CORS(
            app, 
            resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:5001", "http://localhost", "http://localhost:5001","http://flask_app:5001","http://next_app:3000"]}}, 
            supports_credentials=True
        )
        socketio.init_app(
            app,
            message_queue='redis://redis_container:6379/0',
            cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:5001", "http://localhost", "http://localhost:5001","http://flask_app:5001","http://next_app:3000"],
            async_mode="threading",
            logger=True, 
            engineio_logger=True
        )

        db.init_app(app)
        migrate.init_app(app, db)
        login_manager.init_app(app)
        mail.init_app(app)

        app.config.from_mapping(
            CELERY=dict(
                broker_url="redis://redis_container:6379/0",
                result_backend="redis://redis_container:6379/0",
                task_ignore_result=True,
                broker_transport_options={
                    "visibility_timeout": 3600,
                    "fanout_prefix": True,
                    "fanout_patterns": True,
                    "socket_timeout": 10,
                    "socket_connect_timeout": 10,
                },
                task_acks_late=True,
                worker_prefetch_multiplier=1, 
                broker_connection_retry_on_startup=True,
            )
        )

        make_celery(app)

        start_redis_listener()

        # Register blueprints
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(user_bp, url_prefix='/api/user')
        app.register_blueprint(institution_bp, url_prefix='/api/institution')
        app.register_blueprint(cctv_bp, url_prefix='/api/cctv')
        app.register_blueprint(stream_bp, url_prefix='/api/stream')
        app.register_blueprint(alert_bp, url_prefix='/api/alert')

    except Exception as e:
        print(f"[ERROR] Failed to initialize application: {str(e)}")
        raise

    return app