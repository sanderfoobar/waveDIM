import os

app_secret = os.urandom(32)
BIND_ROUTE = "/"
BIND_HOST = "127.0.0.1"
BIND_PORT = 20123
DEBUG = False

streams = {
    "arrownl": {
        "id": "arrownl",
        "title": "Arrow Classic Rock",
        "stream": "http://91.221.151.178:8109/stream",
        "referer": "player.arrow.nl",
        "user-agent": "Mozilla 4",
        "mime": "audio/mpeg"
    },
    "npo1": {
        "id": "npo1",
        "title": "NPO 1",
        "stream": "http://icecast.omroep.nl/radio1-bb-mp3",
        "referer": "player.npo.nl",
        "user-agent": "Mozilla 4",
        "mime": "audio/mpeg"
    },
    "psyndora": {
        "id": "psyndora",
        "title": "PsyndoraTrance",
        "stream": "http://78.46.73.91:9111/stream",
        "referer": "player.npo.nl",
        "user-agent": "Mozilla 4",
        "mime": "audio/mpeg"
    },
    "coldbustedradio": {
        "id": "coldbustedradio",
        "title": "Chill",
        "stream": "http://195.154.217.103:8391/coldbustedradio",
        "referer": "player.npo.nl",
        "user-agent": "Mozilla 4",
        "mime": "audio/mpeg"
    },
}

