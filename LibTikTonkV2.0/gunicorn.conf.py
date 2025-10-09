# import multiprocessing

# # Gunicorn configuration
# bind = "0.0.0.0:5000"
# workers = multiprocessing.cpu_count() * 2 + 1
# worker_class = "sync"
# worker_connections = 1000
# timeout = 300
# keepalive = 2

# # Logging
# accesslog = "access.log"
# errorlog = "error.log"
# loglevel = "info"

# # Security
# limit_request_line = 4094
# limit_request_fields = 100
# limit_request_field_size = 8190



import os
import multiprocessing

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '10000')}"
backlog = 2048

# Worker processes
workers = 1  # Single worker to avoid issues with shared state
worker_class = "sync"
worker_connections = 1000
timeout = 300  # 5 minutes for long-running video generation
keepalive = 5
max_requests = 1000
max_requests_jitter = 100

# Restart workers after this many requests, with up to N random requests
preload_app = True

# Logging
loglevel = os.environ.get('LOG_LEVEL', 'info').lower()
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = 'video-generation-api'

# Server mechanics
daemon = False
pidfile = '/tmp/gunicorn.pid'
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
keyfile = None
certfile = None

# Application
pythonpath = '/app'
raw_env = [
    'FLASK_ENV=production',
]

# Worker timeouts and limits
graceful_timeout = 30
worker_tmp_dir = '/dev/shm'  # Use shared memory for better performance

def when_ready(server):
    server.log.info("Server is ready. Spawning workers")

def worker_int(worker):
    worker.log.info("worker received INT or QUIT signal")

def pre_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_worker_init(worker):
    worker.log.info("Worker initialized")

def worker_abort(worker):
    worker.log.info("Worker received SIGABRT signal")