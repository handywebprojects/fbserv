#########################################################
# global imports
import os
#########################################################

#########################################################
# local imports
from utils.misc import issubpathofpath, issubpathofpaths
#########################################################

DISABLED_PATHS = [    
    "drive",
    "firebase"
]

#########################################################

def isuseradmin(uid):
    adminuser = "mockuser"
    if "adminuser" in os.environ:
        adminuser = os.environ["adminuser"]
    return uid == adminuser

def ispathauthorized(path, uid, write = False):
    if isuseradmin(uid):
        return True
    if issubpathofpath(path, os.path.join("drive", uid)):
        return True
    if write:
        return False
    return not issubpathofpaths(path, DISABLED_PATHS)