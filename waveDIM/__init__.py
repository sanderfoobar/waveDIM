import os
import settings
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session

app = Flask(import_name=__name__,
            static_folder=None,
            template_folder='views')

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SECRET_KEY'] = settings.app_secret
app.config['dir_base'] = os.path.dirname(os.path.abspath(__file__))
app.config['dir_root'] = '/'.join(app.config['dir_base'].split('/')[:-1])
app.config['APPLICATION_ROOT'] = settings.BIND_ROUTE
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///%s/data/db.sqlite3" % app.config['dir_root']

db = SQLAlchemy(app)
SESSION_TYPE = 'sqlalchemy'
SESSION_PERMANENT = True
SESSION_SQLALCHEMY = db
app.config.from_object(__name__)
Session(app)

from waveDIM.controllers.multiplexer import StreamFactory
stream_factory = StreamFactory()
db.create_all()

import waveDIM.routes

