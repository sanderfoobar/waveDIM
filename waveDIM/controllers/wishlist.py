from datetime import datetime
from flask import session, request, abort
from waveDIM.controllers.type_police import type_police


class Wishlisht:
    def __init__(self):
        if not session.get("wishlist", ""):
            session["wishlist"] = []

    @type_police
    def add(self, track: str, radio_id: str, date: int):
        title = request.json["track"][:64]
        radio_id = request.json["radio_id"][:32]
        date = datetime.fromtimestamp(date)

        if not isinstance(date, datetime):
            print("not date")
            return abort(500)

        session["wishlist"].append({
            "title": title,
            "radio_id": radio_id,
            "date": date
        })

    def get(self):
        return session["wishlist"]