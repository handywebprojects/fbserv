#!/bin/bash
python conv.py d
python simple.py &
python -m obscureridge &
chmod a+x engines/*
./engines/abb2 &
#gunicorn --worker-class eventlet -w 1 server:app
gunicorn --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 server:app
