echo off
cd client
transcrypt app.py --nomin
copy __target__\*.js ..\static\clientjs
cd __target__
for /r %%i in (*) do copy /b %%i +,, > nul
cd ..
cd ..
call s\bundle none