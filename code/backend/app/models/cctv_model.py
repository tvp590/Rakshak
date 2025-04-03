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
    alerts = db.relationship('Alert', back_populates='cctv', lazy=True, cascade="all, delete-orphan")
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False)

    institution = db.relationship('Institution', back_populates='cctvs')
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "ip_address": self.ip_address,
            "username": self.username,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "institution_id": self.institution_id
        }

def create_rtsp_url(userName, passWord, ipAddress):
    return f"rtsp://{userName}:{passWord}@{ipAddress}:554/stream1"

def get_cctv_details(institution_id):
    cctvs = CCTV.query.filter_by(institution_id=institution_id, is_active=True).all()
    cctv_details = [] 

    for cctv in cctvs:
        rtsp_url = create_rtsp_url(cctv.username, cctv.password, cctv.ip_address)
        cctv_details.append({
            'cctv_id': cctv.id,
            'rtsp_url': rtsp_url,
            'location': cctv.location,
        })

    return cctv_details

def get_cctv_by_id(cctv_id):
    return CCTV.query.get(cctv_id)