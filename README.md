# waveDIM

waveDIM is a Flask web application for playing audio with WebGL visuals.

[![N|Solid](http://i.imgur.com/hQiXJnc.png)](https://nodesource.com/products/nsolid)
http://radio.cedsys.nl

### Features

  - Play static files
  - Proxy audio streams
  - Parse ICY metadata
  - Plays via a HTML5 audio element
  - 3D engine built on top of `Three.js`
  - ECMAScript 6 classes

## CORS
Javascript cannot fetch remote audio streams without proper CORS headers due to security restrictions imposed by the browser so they're proxied by Flask with `requests`. [Flask example](https://github.com/skftn/waveDIM/blob/master/examples/flask_proxy_audio.py) and [source](https://github.com/skftn/waveDIM/blob/master/waveDIM/controllers/shoutcast.py).

## Installation

Goodluck!

### License
MIT