import os
import sys

import heroku3

BOT_TOKENS = os.environ["BOT_TOKENS"]

tokens = []

for tokenstr in BOT_TOKENS.split(";"):
    tokenparts = tokenstr.split(":")
    tokens.append({
        "token": tokenparts[0],
        "app": tokenparts[1]
    })

command = sys.argv[1]

if command == "l":
    for i in range(len(tokens)):
        print("{:3d} {}".format(i, tokens[i]))
    sys.exit()

index = int(sys.argv[2])
value = int(sys.argv[3])

if command == "w":
    kind = "worker"

if command == "e":
    kind = "web"

token = tokens[index]

print("kind {} index {} value {} token {}".format(kind, index, value, token))

heroku_conn = heroku3.from_key(token["token"])

print("conn", heroku_conn)

app = heroku_conn.apps()[token["app"]]

print("app", app)

app.process_formation()[kind].scale(value)