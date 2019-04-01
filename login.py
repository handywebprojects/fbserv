#########################################################

import certifi
import urllib3

import ssl
import websocket

from enum import Enum
from utils.misc import write_string_to_file, read_json_from_file, read_string_from_file, write_json_to_file, posturlbody
from getpass import getpass
import random, string, json
import threading, time
from http.client import responses

import firebase_admin
from firebase_admin import credentials, db
from os import environ

#########################################################

http = urllib3.PoolManager(
    cert_reqs='CERT_REQUIRED',
    ca_certs=certifi.where()
)

#########################################################

def randsri():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(10))

def tourneychaturl(tid):
    return "wss://socket.lichess.org/tournament/{}/socket/v4?sri={}".format(tid, randsri())

#########################################################

def login(username = None, password = None):
    if not username:
        username = input("Username: ")
    if not password:
        password = getpass()

    res = http.request("POST", "https://lichess.org/login?referrer=%2F", headers = {
        "Referer": "https://lichess.org/login?referrer=%2F"
    }, fields = {
        "username": username,
        "password": password
    })

    print("login status", responses[res.status])

    if res.status == 200:
        sch = res.info().get("Set-Cookie")

        lila2 = sch.split(";")[0][6:]

        print("obtained", lila2)
        return lila2
    else:
        print("could not log in")
        return None

def talktourneychattarget(tid, lila2, msg):
    ws = None    

    def msgt(ws, msg):        
        ws.send(json.dumps({
            "t": "talk",
            "d": msg
        }))
        print("sent {} {}".format(tid, msg))
        ws.close()

    def on_open(x):
        nonlocal ws        
        print("opened {} {}".format(tid, msg))
        threading.Thread(target = msgt, args = (ws, msg)).start()

    def on_message(ws, msg):
        print("message", msg)

    ws = websocket.WebSocketApp(tourneychaturl(tid),        
        on_open = on_open,        
        on_message = on_message,
        cookie = "lila2={}".format(lila2)
    )

    ws.run_forever(
        host = "socket.lichess.org",
        origin = "https://lichess.org"
    )

    print("talk terminated ok {} {}".format(tid, msg))

def talktourneychat(tid, lila2, msg):
    threading.Thread(target = talktourneychattarget, args = (tid, lila2, msg)).start()

#########################################################

class MESSAGE_RESULT(Enum):
    MESSAGE_DELIVERED = 1
    MESSAGE_DECLINED = 2
    MESSAGE_FAILED = 3
    MESSAGE_FATAL = 4

def sendmessage(username, subject, message, lila2):
    url = "https://lichess.org/inbox/new?username={}".format(username)
    print("sending to {}\nsubject: {}\nmessage: {}\nurl: {}".format(username, subject, message, url))

    try:
        res = http.request("POST", url, headers = {
            "cookie": "lila2={}".format(lila2)
        }, fields = {
            "subject": subject,
            "text": message
        })

        print("message delivery status", responses[res.status])

        try:
            #content = res.data.decode("utf-8")
            content = "{}".format(res.data)
            write_string_to_file("outbox/sendmessagecontent.txt", content)
            write_string_to_file("outbox/sendmessagecontent.html", content)
            if '<p class="error">' in content:
                print("message declined")
                return MESSAGE_RESULT.MESSAGE_DECLINED
            if '<div class="thread_message_body">' in content:
                print("message delivered OK")
                return MESSAGE_RESULT.MESSAGE_DELIVERED
            print("message delivery failed")
            return MESSAGE_RESULT.MESSAGE_FAILED
        except:
            print("fatal, could not process response body")
            print(res.info())
            return MESSAGE_RESULT.MESSAGE_FATAL
    except:
        print("fatal, http request failed")
        return MESSAGE_RESULT.MESSAGE_FATAL

def batchsendmessage(subject):
    try:
        cred = credentials.Certificate('firebase/fbsacckey.json')
        default_app = firebase_admin.initialize_app(cred, {
            "databaseURL": "https://fbserv-36b3e.firebaseio.com"
        })
    except:        
        print("firebase could not be initialized")
        return
    sentlog = db.reference("sentlog").get()
    if sentlog:
        print("sentlog fetched")
    else:
        print("using local sentlog")
        sentlog = read_json_from_file("outbox/sentlog.json", {})
    recipients = db.reference("titled").get()    
    if recipients:
        lichuser = environ.get("LICHUSER", "lishadowapps")
        lichpass = environ.get("LICHPASS", "")
        print("sending message from {}".format(lichuser))    
        lila2 = login(lichuser, lichpass)
        if not lila2:
            print("fatal, could not obtain login")
            return
        usernames = []
        alreadysent = 0
        for recipient in recipients:
            username = recipient["username"]
            sentloguser = sentlog.get(username, {})
            if subject in sentloguser:
                alreadysent += 1
            else:
                usernames.append(username)        
        print("already sent {}".format(alreadysent))
        print("total recipients {}, available recipients {}".format(len(recipients), len(usernames)))
        message = read_string_from_file("outbox/message.txt", "Message.")
        #print("message: {}".format(message))
        random.shuffle(usernames)
        time.sleep(5)
        for username in usernames:
            print("sending to {}".format(username))
            if not ( username in sentlog ):
                print("adding {} to sentlog".format(username))
                sentlog[username] = {}
            result = sendmessage(username, subject, message, lila2)
            print("delivery result {}".format(result.name))
            if result == MESSAGE_RESULT.MESSAGE_DECLINED:
                sentlog[username][subject] = True
            elif result == MESSAGE_RESULT.MESSAGE_DELIVERED:
                sentlog[username][subject] = True
            elif ( result == MESSAGE_RESULT.MESSAGE_FAILED ) or ( result == MESSAGE_RESULT.MESSAGE_FATAL ):
                print("cannot deliver more messages")
                break
        write_json_to_file("outbox/sentlog.json", sentlog)
        db.reference("sentlog").set(sentlog)
        print("messages delivered ok")
    else:
        print("fatal, no recipients")
        return

#########################################################

def jointourney(tid, lila2):
    turl = "https://lichess.org/tournament/{}".format(tid)
    jurl = turl + "/join"
    headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/vnd.lichess.v3+json",
        "Referer": turl,
        "Cookie": "lila2={}".format(lila2)        
    }
    posturlbody(jurl, headers = headers, body = '{"p": null}')

#########################################################

if __name__ == "__main__":    
    batchsendmessage("titled player toplists")

