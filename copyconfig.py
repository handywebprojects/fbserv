#########################################################

import heroku3

from os import environ

#########################################################

handywebprojectsconn = heroku3.from_key(environ["FBSERV_TOKEN"])

fbservapp = handywebprojectsconn.apps()["fbserv"]

fbservconfig = fbservapp.config()

print("fbserv config", fbservconfig)

handychessapplicationsconn = heroku3.from_key(environ["FBSERV2_TOKEN"])

fbserv2app = handychessapplicationsconn.apps()["fbserv2"]

fbserv2config = fbserv2app.config()

print("fbserv2 config", fbserv2config)

print("copying config")

fbserv2newconfig = fbservconfig.__dict__["_ConfigVars__data"]

fbserv2app.update_config(fbserv2newconfig)

#########################################################