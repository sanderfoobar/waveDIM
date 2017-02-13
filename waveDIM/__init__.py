import os
import settings
from flask import Flask

from jinja2 import Environment, FileSystemLoader
__author__ = "Sander Ferdinand"

jinja2_env = Environment(loader=FileSystemLoader('paste/themes/'))
app = Flask(import_name=__name__,
            static_folder=None,
            template_folder='views')

app.config['SECRET_KEY'] = settings.app_secret
app.config['dir_base'] = os.path.dirname(os.path.abspath(__file__))
app.config['dir_root'] = '/'.join(app.config['dir_base'].split('/')[:-1])
app.config['APPLICATION_ROOT'] = settings.BIND_ROUTE

SECRET_KEY = settings.app_secret

# init routes
import waveDIM.routes