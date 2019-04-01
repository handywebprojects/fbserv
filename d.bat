set adminuser=%adminuser%
echo off
set THREADS=4
call C:\Unzip\Tools\Anaconda\Scripts\activate.bat C:\Unzip\Tools\Anaconda
s\r python dev.py %1