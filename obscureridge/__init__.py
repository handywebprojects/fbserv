####################################################

def read_string_from_file(path, default):
    try:
        content = open(path).read()
        return content
    except:
        return default

####################################################
