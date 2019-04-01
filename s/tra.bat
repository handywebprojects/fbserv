echo off
cd client
transcrypt app.py --nomin
copy __javascript__\app.js ..\static\js
cd __javascript__
for /r %%i in (*) do copy /b %%i +,, > nul
cd ..
cd ..
