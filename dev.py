import time
import threading
import os, sys
from shutil import rmtree

from selenium import webdriver

from utils.process import ProcessManager, runcmd
from utils.misc import read_yaml_from_file, write_yaml_to_file, dir_listing_as_list, dir_listing_as_dict, getlastmod, write_string_to_file, ANSI_BRIGHTMAGENTA
from cbuild.utils import create_dir

noselenium = False
if len(sys.argv) > 1:
    arg0 = sys.argv[1]
    if arg0 == "ns":
        noselenium = True
        print(ANSI_BRIGHTMAGENTA + "no selenium")

README_DIRS = [
    [ "upload", "Image file upload temporary directory."],
    [ "download", "Image file download temporary directory."],
    [ "drive", "Drive temporary directory."]
]

for readmedir in README_DIRS:
    dir = readmedir[0]
    desc = readmedir[1]
    #print("removing", dir)
    try:
        rmtree(dir)
    except:
        #print("nothing to remove")
        pass
    #print("creating dir", dir)
    create_dir(dir, False)
    #print("creating readme", desc)
    write_string_to_file(os.path.join(dir, "ReadMe.md"), desc)

BROWSER_CONFIG_PATH = "cache/browserconfig.yml"

if noselenium:
    browser = None
else:
    browser = webdriver.Chrome()

CHECK_DIRS = [
    os.path.join("static", "css")
]

dir_dicts = {}

for dir in CHECK_DIRS:
    dir_dicts[dir] = dir_listing_as_dict(dir)

def check_dirs():    
    anychanged = False
    for dir in CHECK_DIRS:        
        dictionary = dir_listing_as_dict(dir)
        compareto = dir_dicts[dir]
        for name, item in dictionary.items():
            compareitem = compareto[name]
            if item["st_mtime"] > compareitem["st_mtime"]:
                compareitem["st_mtime"] = item["st_mtime"]
                anychanged = True
    if noselenium:
        return
    if anychanged:
        browser.refresh()

simple = ProcessManager({
    "name": "simple server",
    "command": "python",
    "command_args": ["-u", "simple.py"],    
    "verbose": False,
    "color": "BRIGHTCYAN"
})

simple.start()

server = ProcessManager({
    "name": "flask server",
    "command": "python",
    "command_args": ["-u", "server.py"],    
    "verbose": False
})

server.start()

if noselenium:
    pass
else:
    browserconfig = read_yaml_from_file(BROWSER_CONFIG_PATH, {})
    browser_x = browserconfig.get("x", 400)
    browser_y = browserconfig.get("y", 50)
    browser_w = browserconfig.get("width", 600)
    browser_h = browserconfig.get("height", 400)

    browser.set_window_position(browser_x, browser_y)
    browser.set_window_size(browser_w, browser_h)

def watch_browser_thread_target(browser, browserconfig):
    time.sleep(10)
    browser.get('http://localhost:5000')
    while True:
        pos = browser.get_window_position()
        size = browser.get_window_size()
        browserconfig["x"] = pos["x"]
        browserconfig["y"] = pos["y"]
        browserconfig["width"] = size["width"]
        browserconfig["height"] = size["height"]
        write_yaml_to_file(BROWSER_CONFIG_PATH, browserconfig)
        time.sleep(5)

if noselenium:
    pass
else:
    threading.Thread(target = watch_browser_thread_target, args = (browser, browserconfig)).start()

def check_client():    
    listing = dir_listing_as_list("client")
    anychanged = False        
    for item in listing:        
        if ( item["ext"] == "py" ) and ( not ( item["name"] == "app.py" ) ):
            lastmodpy = item["st_mtime"]
            jspath = os.path.join("client", "__javascript__", item["basename"] + ".mod.js")
            lastmodjs = getlastmod(jspath)                        
            if lastmodpy > lastmodjs:                
                anychanged = True
    if anychanged:
        runcmd({
            "command": os.path.join("s", "tra.bat"),                
            "color": "BRIGHTWHITE",
            "verbose": False
        })
        if noselenium:
            return
        try:
            browser.refresh()
        except:
            print("browser could not be refreshed")

while True:
    check_client()
    check_dirs()
    time.sleep(2)
