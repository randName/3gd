from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_redis import FlaskRedis

app = Flask(__name__)
app.config.from_object('config')
app.config['UPLOAD_FOLDER'] = '/home/ubuntu/3gd/app/upload/'
db = SQLAlchemy(app)
rd = FlaskRedis(app, decode_responses=True)

from app import views, models
