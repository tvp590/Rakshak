from ..extensions import db
from sqlalchemy import func
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class CCTV(db.Model):
    __tablename__ = 'cctvs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    ip_address = db.Column(db.String(45), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(150), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=func.now())
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False)

    institution = db.relationship('Institution', back_populates='cctvs')

    def set_cctv_password(self, passWord):
        self.password = bcrypt.generate_password_hash(passWord).decode('utf-8')

    def check_cctv_password(self,passWord):
        return bcrypt.check_password_hash(self.password, passWord)
