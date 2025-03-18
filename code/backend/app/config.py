import os
from dotenv import load_dotenv
import logging

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') 
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_PORT = 587
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_USERNAME = os.environ.get('SMTP_MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('SMTP_MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('SMTP_MAIL_DEFAULT_SENDER')

    logging.getLogger('flask_mail').setLevel(logging.WARNING)
    logging.getLogger('smtplib').setLevel(logging.WARNING)

    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL')
    CELERY_BROKER_URL = os.environ.get('REDIS_URL')