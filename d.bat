set adminuser=%adminuser%
echo off
set THREADS=4
call C:\Unzip\Tools\Anaconda\Scripts\activate.bat C:\Unzip\Tools\Miniconda37
s\r python dev.py %1