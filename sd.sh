kill -9 `ps ax | grep 'virtual' | awk '{print $1;}'`

