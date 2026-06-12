from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = "dev-secret-change-later"


# -------------------------
# MAIN MAP PAGE
# -------------------------
@app.route("/")
def index():
    return render_template("index.html")


# -------------------------
# ADMIN LOGIN (stub for now)
# -------------------------
@app.route("/admin/login", methods=["POST"])
def admin_login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    # TEMP SIMPLE CHECK (replace later with JSON or auth.py)
    if username == "admin" and password == "admin":
        session["admin"] = True
        return jsonify({"success": True})

    return jsonify({"success": False}), 403


# -------------------------
# ADMIN CHECK HELPER ROUTE (optional debugging)
# -------------------------
@app.route("/admin/status")
def admin_status():
    return jsonify({
        "admin": session.get("admin", False)
    })


if __name__ == "__main__":
    app.run(debug=True)