from flask import Flask, render_template, request, session, redirect, jsonify
from engine.auth import validate_admin

@app.route("/")
def home():
    return render_template("index.html")

app = Flask(__name__)
app.secret_key = "change-this-later"

@app.route("/admin/login", methods=["POST"])
def admin_login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    if validate_admin(username, password):
        session["admin"] = True
        return jsonify({"success": True})

    return jsonify({"success": False}), 403

def is_admin():
    return session.get("admin") is True

@app.route("/admin/update_settlement", methods=["POST"])
def update_settlement():

    if not is_admin():
        return jsonify({"error": "unauthorized"}), 403

    data = request.json

    name = data["name"]

    with open("data/settlements.json") as f:
        settlements = json.load(f)

    if name not in settlements:
        return jsonify({"error": "not found"}), 404

    settlements[name].update(data["update"])

    with open("data/settlements.json", "w") as f:
        json.dump(settlements, f, indent=4)

    return jsonify({"success": True})