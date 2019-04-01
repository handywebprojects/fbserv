#############################################
# global imports
from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import threading

from traceback import print_exc
import sys
import json
import time
#############################################

#############################################
# local imports
from serverlogic import serverlogic
#############################################

PORT = 4000
NUM_SERVERS = 5

#############################################
# server
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):        
    def do_POST(self):        
        content_length = int(self.headers['Content-Length'])
        #print("POST content length {}".format(content_length))
        post_data = self.rfile.read(content_length).decode("utf-8")
        #print("POST data", post_data)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        try:
            reqobj = json.loads(post_data)
            resobj = serverlogic(reqobj)
        except:
            print("error processing request")
            print_exc(file = sys.stderr)
            resobj = {
                "ok": False,
                "status": "error processing request"
            }
        #print("response", resobj)        
        self.wfile.write(bytes(json.dumps(resobj), "utf8"))

addr = ('', PORT)
sock = socket.socket (socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(addr)
sock.listen()

class Thread(threading.Thread):
    def __init__(self, i):
        threading.Thread.__init__(self)
        self.i = i
        self.daemon = True        
        self.start()
    def run(self):
        httpd = HTTPServer(addr, SimpleHTTPRequestHandler, False)

        # Prevent the HTTP server from re-binding every handler.
        # https://stackoverflow.com/questions/46210672/
        httpd.socket = sock
        httpd.server_bind = self.server_close = lambda self: None

        print("starting simple server {} / {} on port {}".format(self.i + 1, NUM_SERVERS, PORT))
        httpd.serve_forever()

#############################################

[Thread(i) for i in range(NUM_SERVERS)]

while True:
    time.sleep(60)