from ..extensions import db
from sqlalchemy import func
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class Institution(db.Model):
    __tablename__ = 'institutions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    cctvs = db.relationship('CCTV', back_populates='institution', lazy=True, cascade="all, delete-orphan")
    users = db.relationship('User', back_populates='institution', lazy=True, cascade="all, delete-orphan")
    alerts = db.relationship('Alert', back_populates='institution', lazy=True, cascade="all, delete-orphan")

    def set_institution_password(self, passWord):
        self.password = bcrypt.generate_password_hash(passWord).decode('utf-8')
    
    def check_institution_password(self,passWord):
        return bcrypt.check_password_hash(self.password, passWord)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

def get_institution_by_id(institution_id):
    return Institution.query.get(institution_id)