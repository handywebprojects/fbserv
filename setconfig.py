#########################################################

import heroku3

from os import environ

from sys import argv, exit

from showconfig import showconfig

#########################################################

argv = argv[1:]
if len(argv) < 2:
    print("not enough args, useage: [appname] [key] [value]")
    exit()

appname = argv[0]
key = argv[1]

value = None
if len(argv) > 2:
    value = argv[2]

print("setting", appname, key, value)

if appname == "fbserv":
    token = environ["FBSERV_TOKEN"]
elif appname == "fbserv2":
    token = environ["FBSERV2_TOKEN"]
else:
    print("wrong appname")

conn = heroku3.from_key(token)

app = conn.apps()[appname]

config = app.config()

config[key] = value

print("done")

showconfig()

#########################################################