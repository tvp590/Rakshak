from ..extensions import db
from flask import jsonify
from sqlalchemy import func
from .cctv_model import get_cctv_by_id
from .institution_model import get_institution_by_id

class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    weapon_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="Pending", nullable=False)  # "Pending", "Resolved", "False Positive"
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    cctv_id = db.Column(db.Integer, db.ForeignKey('cctvs.id'), nullable=False)
    cctv = db.relationship('CCTV', back_populates='alerts')

    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False)
    institution = db.relationship('Institution', back_populates='alerts')

    def serialize(self):
        return {
            "id": self.id,
            "weapon_type": self.weapon_type,
            "status": self.status,
            "is_active": self.is_active,
            "image_path": self.image_path,
            "location": self.location,
            "created_at" : self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "cctv_id": self.cctv_id,
            "institution_id": self.institution_id
        }


def get_alert_by_id(alert_id):
    alert = Alert.query.get(alert_id)
    return alert


def get_alerts_by_institution(institution_id):
    institution = get_institution_by_id(institution_id)
    if not institution:
        return jsonify({"message": "Institution not found"}), 404
    alerts = institution.alerts

    return jsonify({
        "alerts": [alert.serialize() for alert in alerts]
    }), 200

def get_alerts_by_CCTV(id):
    cctv_camera = get_cctv_by_id(id)
    if not cctv_camera:
        return jsonify({"message": "CCTV camera not found"}), 404
    
    alerts = cctv_camera.alerts

    return jsonify({
        "alerts": [alert.serialize() for alert in alerts]
    }), 200


    