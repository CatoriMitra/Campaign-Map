import json

with open("data/settlements.json") as f:
    settlements = json.load(f)


def get_settlement(name):
    return settlements.get(name)


def get_hex(name):
    settlement = settlements.get(name)

    if settlement:
        return settlement["hex"]

    return None


def get_all():
    return settlements