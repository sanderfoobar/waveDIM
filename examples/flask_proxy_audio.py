from flask import Flask, Response
import waveDIM.controllers.shoutcast as shoutcast
app = Flask(__name__)
__author__ = "Sander Ferdinand"

stream_url = "http://icecast.omroep.nl/radio1-bb-mp3"


@app.route('/')
def proxy_stream():
    response = shoutcast.get(stream_url)
    return Response(response=shoutcast.iter_content(response),
                    content_type=response.headers['Content-Type'])

if __name__ == '__main__':
    app.run(threaded=True)