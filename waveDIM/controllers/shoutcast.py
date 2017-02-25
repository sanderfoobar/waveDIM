#!/usr/bin/python3
import requests
from urllib.parse import unquote_plus
from requests.packages.urllib3.exceptions import ReadTimeoutError, ProtocolError
from requests.exceptions import HTTPError, StreamConsumedError, ConnectionError, ChunkedEncodingError
__author__ = "Sander Ferdinand"

#: Contains track title, author per station. Key is the station url
METADATA = {}


def get(url, user_agent="VLC/2.2.4 LibVLC/2.2.4", referer="", mime=False):
    """Fetches radio stream, returns response object"""
    try:
        headers = {
            "Accept": "*/*",
            "Accept-Encoding": "identity;q=1, *;q=0",
            "Range": "bytes=0-",
            "Referer": referer,
            "Icy-MetaData": "1",
            "User-Agent": user_agent
        }
        response = requests.get(url, stream=True, headers=headers, allow_redirects=False)
        response.raise_for_status()
    except Exception as ex:
        raise HTTPError(ex)
    if mime:
        if not response.headers["content-type"]:
            raise HTTPError("Response headers `Content-Type` not found "
                            "while enforcing a specific mime type.")
        if isinstance(mime, str) and \
                        mime != response.headers["content-type"]:
            raise HTTPError("bad mime")

    for header, value in response.headers.items():
        if header.startswith("icy-"):
            if not METADATA.get(response.url, None):
                METADATA[response.url] = {"server": {}, "info": {}}
            METADATA[response.url]["server"][header] = value
    return response


def iter_content(response, chunk_size=1024*10):
    """Iterates over the response object containing audio.
    It is roughly identical to :meth:`requests.Response.iter_content`
    except that it is aware of the ICY 'pseudo-HTTP' protocol,
    which may include, but is not limited to the track title,
    author, etc.

    When metadata is found it is inserted into the global
    `METADATA` dictionary with the stream URL as the key.

    chunk_size must be of type int. *Note: Should not
    normally need to be set explicitly.*

    ICY:
    1) HTTP request to stream with the `Icy-Metadata' header
    2) Response header `icy-metaint` will tell how often
    the metadata is sent in the stream. Specifically,
    how many audio data bytes there are between metadata blocks.
    3) Read the number of bytes `icy-metaint` told us to read.
    this is the audio data.
    4) Next up, read 1 byte to get the metadata 'length specifier'
    5) Multiply that byte by 16 to get the size of the
    plaintext metadata string. (Max byte size = 255 so
    metadata max length = 4080).
    6) Parse metadata, set global variable and repeat.
    """
    global METADATA
    if hasattr(response.raw, 'stream'):
        has_icy = False
        bufsize_metadata = -1
        bufsize_audio = chunk_size
        if response.headers.get("icy-metaint"):
            _metaint = response.headers.get("icy-metaint")
            if _metaint.isdigit() and int(_metaint) > 0:
                bufsize_audio = int(_metaint)
                has_icy = True
        try:
            #: 0: audio, 1: length specifier, 2: metadata
            state = 0
            while True:
                if state == 0:
                    #  no gzip/deflate - audio already compressed
                    chunk = next(response.raw.stream(bufsize_audio, decode_content=False))
                    if has_icy:
                        state += 1
                    yield chunk
                elif state == 1:
                    chunk = response.raw.read(1)
                    bufsize_metadata = ord(chunk)*16
                    state += 1
                elif state == 2:
                    chunk = response.raw.read(bufsize_metadata)
                    if any(s in chunk.decode('utf-8') for s in ["StreamTitle", "=", ";"]):
                        if len(chunk) >= 16:
                            metadata = icy_parse(chunk)
                            METADATA[response.url]["info"] = metadata
                    state = 0
        except ProtocolError as e:
            raise ChunkedEncodingError(e)
        except ReadTimeoutError as e:
            raise ConnectionError(e)
    raise StreamConsumedError()


def icy_parse(inp):
    """Attempts to parse the metadata. *knocks wood*"""
    try:
        np = inp.strip().replace("\x00", "")
        np = np[np.find("=") + 1:]
        np = np[1:-2]
        if any(s in inp for s in ["StreamUrl=\'"]):
            blob = np[np.find("StreamUrl=")+11:]
            blob = {z.split("=")[0]: unquote_plus(z.split("=")[1]) for z in blob.split("&") if z}
            np = np[:np.find("StreamUrl=\'")-2]
            return {"info": blob, "np": np}
        return {"np": np}
    except:
        pass
