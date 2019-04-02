from datetime import datetime
import time
import calendar

format = "%Y-%m-%d %H:%M"

date = input(f"Enter date ( {format} ): ")

dt = datetime.strptime(date, format)

print('Date:', dt.date())  
print('Time:', dt.time())  
print('Date-time:', dt)
print('Timestamp:', int(time.mktime(dt.timetuple())))
print('UTC Timestamp:', calendar.timegm(dt.timetuple()))
