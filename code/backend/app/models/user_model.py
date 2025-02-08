from ..extensions import db, login_manager
from flask_bcrypt import Bcrypt
from flask_login import UserMixin
from enum import Enum
from sqlalchemy import func

bcrypt = Bcrypt()

class RoleEnum(Enum):
    user = 'user'
    superAdmin = 'superAdmin'
    siteAdmin = 'siteAdmin'

class User(UserMixin,db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30),nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False, default=RoleEnum.user)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=True) 
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
    
    institution = db.relationship('Institution', back_populates='users') 

    def set_password(self, passWord):
        self.password = bcrypt.generate_password_hash(passWord).decode('utf-8')

    def check_password(self,passWord):
        return bcrypt.check_password_hash(self.password, passWord)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

def get_user_by_id(user_id):
    return User.query.get(user_id)
