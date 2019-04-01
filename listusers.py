import firebase_admin
from firebase_admin import credentials, auth
from time import sleep
from utils.ansi import pretty, brightwhite

cred = credentials.Certificate('firebase/fbsacckey.json')
firebase_admin.initialize_app(cred)

page = auth.list_users()
while page:
    for user in page.users:
        uid = user.uid
        data = user.__dict__["_data"]
        if "displayName" in data:
            dname = data["displayName"]
            print(uid, brightwhite(dname))
            print(pretty(data))            
        else:            
            print("deleting", uid)
            auth.delete_user(uid)
    page = page.get_next_page()

