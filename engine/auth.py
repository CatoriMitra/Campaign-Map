import json

with open("data/admins.json") as f:
    ADMINS = json.load(f)

def validate_admin(username, password):
    admin = ADMINS.get(username)

    if not admin:
        return False

    return admin["password"] == password
