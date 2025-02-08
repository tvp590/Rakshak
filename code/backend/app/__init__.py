from flask import Flask
from .extensions import db, migrate, login_manager, socketio
from .config import Config
from .routes import user_bp, auth_bp, institution_bp, cctv_bp, stream_bp
from flask_cors import CORS
from .utils import seed_admin_function
from .socketio_events import *

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:5001"]}})
    socketio.init_app(app, cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:5001"])

    db.init_app(app)
    migrate.init_app(app,db)
    login_manager.init_app(app)

    with app.app_context():
        # if not db.engine.dialect.has_table(db.engine, 'user'):
        db.create_all()
        seed_admin_function()

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(institution_bp, url_prefix='/api/institution')
    app.register_blueprint(cctv_bp, url_prefix='/api/cctv')
    app.register_blueprint(stream_bp,url_prefix='/api/stream')
    return app

