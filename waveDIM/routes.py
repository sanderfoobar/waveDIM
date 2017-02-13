from flask import render_template, send_from_directory, Response, redirect, jsonify

from waveDIM import app
import waveDIM.controllers.shoutcast as shoutcast
from settings import streams

__author__ = "Sander Ferdinand"


@app.route("/")
def index():
    return render_template("live.html", streams=streams)


@app.route("/api/metadata")
def metadata():
    data = {}

    for stream_id, _data in streams.iteritems():
        data[stream_id] = _data

        for stream_url, _metadata in shoutcast.METADATA.iteritems():
            if _data["stream"] == stream_url:
                data[stream_id]["metadata"] = _metadata

    return jsonify(data)


@app.route("/stream/<path:path>")
def proxyradio(path):
    """Javascript cannot fetch remote audio
    streams without proper CORS headers due
    to security restrictions imposed by the
    browser. Proxy instead."""
    if path not in streams:
        return "radio not found"

    radio = streams[path]
    response = shoutcast.get(radio["stream"])
    return Response(response=shoutcast.iter_content(response),
                    content_type=response.headers['Content-Type'])


@app.route('/static/<path:path>')
def static(path):
    return send_from_directory('static', path)
