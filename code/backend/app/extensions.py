from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_socketio import SocketIO
from redis import StrictRedis
from flask_mail import Mail

# Initialize the extensions
db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()
redis_client = StrictRedis(host='redis_container', port=6379, db=0, decode_responses=True)
mail = Mail()
login_manager = LoginManager()
login_manager.login_view = 'auth.login_user_route'
