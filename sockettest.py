import ssl

import websocket

import random, string, json, threading, time

import login

def on_message(ws, message):    
    global first
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("socket closed")

def on_open(ws):
    print("socket opened ok")

chat = None
    
def keepalive(ws):
    global chat
    while True:
        time.sleep(3)        
        if chat:
            ws.send(json.dumps({
                "t": "talk",
                "d": chat
            }))
            chat = None
        else:
            ws.send("null")        

def startchat(tid, lila2):    
    #websocket.enableTrace(True)
    sri = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(10))    
    url = "wss://socket.lichess.org/tournament/{}/socket/v4?sri={}".format(tid, sri)
    print("url", url)
    ws = websocket.WebSocketApp(url,
        on_message = on_message,
        on_error = on_error,
        on_close = on_close,
        on_open = on_open,        
        cookie = "lila2={}".format(lila2)
    )

    threading.Thread(target = keepalive, args = (ws,)).start()
    ws.run_forever(
        host = "socket.lichess.org",
        origin = "https://lichess.org"
    )

if __name__ == "__main__":
    tid = input("Tourney id: ")
    lila2 = login.login()

    threading.Thread(target = startchat, args = (tid, lila2)).start()

    while True:
        chat = input("chat: ")
