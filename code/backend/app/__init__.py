from flask import Flask
from .extensions import db, migrate, login_manager
from .config import Config
from .routes import user_bp, auth_bp, institution_bp, cctv_bp
from flask_cors import CORS
from .utils import seed_admin_function

def create_app():
    # Initialize the Flask app
    app = Flask(__name__)

    # Load the configuration
    app.config.from_object(Config)

    #CORS for the app
    CORS(app, resources={r"/*": {"origins": "https://localhost:3000"}})

    # Initialize the extensions
    db.init_app(app)
    migrate.init_app(app,db)
    login_manager.init_app(app)

    with app.app_context():
        # if not db.engine.dialect.has_table(db.engine, 'user'):
        db.create_all()
        seed_admin_function()

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(institution_bp, url_prefix='/institution')
    app.register_blueprint(cctv_bp, url_prefix='/cctv')

    return app

