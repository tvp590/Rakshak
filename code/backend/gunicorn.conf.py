# Number of worker processes
workers = 1

worker_class = "gthread"

threads = 4

# Bind to all interfaces on port 5001
bind = "0.0.0.0:5001"

timeout = 120

preload_app = True 

loglevel = "debug"

accesslog = "-"

errorlog = "-"

reload = False