#!/usr/bin/python3
# -*- coding: utf-8 -*-
import settings
from waveDIM import app

__author__ = "Sander Ferdinand"

if settings.DEBUG:
    app.run(debug=settings.DEBUG, host=settings.BIND_HOST, port=settings.BIND_PORT, use_reloader=False)
else:
    from gevent import monkey
    monkey.patch_all()

    from gevent.pywsgi import WSGIServer

    app.debug = settings.DEBUG
    http_server = WSGIServer((settings.BIND_HOST, settings.BIND_PORT), app)
    print(' * Running on http://%s:%s/ (Press CTRL+C to quit)' % (settings.BIND_HOST, str(settings.BIND_PORT)))
    http_server.serve_forever()
