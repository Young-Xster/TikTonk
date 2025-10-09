# import logging
# from logging.handlers import RotatingFileHandler
# from config import Config

# def setup_logger():
#     logger = logging.getLogger('tiktok_video_service')
#     logger.setLevel(getattr(logging, Config.LOG_LEVEL.upper()))

#     # Create handlers
#     file_handler = RotatingFileHandler(
#         Config.LOG_FILE, 
#         maxBytes=10*1024*1024,  # 10MB
#         backupCount=5
#     )
#     console_handler = logging.StreamHandler()

#     # Create formatters and add it to handlers
#     log_format = logging.Formatter(
#         '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
#     )
#     file_handler.setFormatter(log_format)
#     console_handler.setFormatter(log_format)

#     # Add handlers to the logger
#     logger.addHandler(file_handler)
#     logger.addHandler(console_handler)

#     return logger

# logger = setup_logger()




import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from datetime import datetime

def setup_logger(name='app', log_level=None, log_file=None):
    """Setup application logger with file and console handlers"""
    
    # Get log level from environment or parameter
    if log_level is None:
        log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()
    
    # Get log file from environment or parameter
    if log_file is None:
        log_file = os.environ.get('LOG_FILE', 'app.log')
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, log_level, logging.INFO))
    
    # Clear existing handlers to avoid duplicates
    logger.handlers = []
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
    )
    
    console_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(console_formatter)
    
    # Set encoding to UTF-8 for Windows compatibility
    if hasattr(console_handler.stream, 'reconfigure'):
        try:
            console_handler.stream.reconfigure(encoding='utf-8')
        except Exception:
            pass
    
    logger.addHandler(console_handler)
    
    # File handler (rotating)
    try:
        # Ensure log directory exists
        log_dir = os.path.dirname(log_file) if os.path.dirname(log_file) else './logs'
        os.makedirs(log_dir, exist_ok=True)
        
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,
            encoding='utf-8'  # Explicitly set UTF-8 encoding
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(detailed_formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        logger.error(f"Could not create file handler: {e}")
    
    # Error file handler for errors only
    try:
        error_file = log_file.replace('.log', '_errors.log') if '.log' in log_file else f"{log_file}_errors.log"
        error_handler = RotatingFileHandler(
            error_file,
            maxBytes=5*1024*1024,  # 5MB
            backupCount=3,
            encoding='utf-8'  # Explicitly set UTF-8 encoding
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(detailed_formatter)
        logger.addHandler(error_handler)
    except Exception as e:
        logger.error(f"Could not create error file handler: {e}")
    
    return logger

# Create the main application logger
logger = setup_logger()

# Log startup message
logger.info(f"Logger initialized at {datetime.now()}")
logger.info(f"Log level: {logger.level}")
logger.info(f"Handlers: {[type(h).__name__ for h in logger.handlers]}")