import logging
from logging.handlers import RotatingFileHandler
from config import Config

def setup_logger():
    logger = logging.getLogger('tiktok_video_service')
    logger.setLevel(getattr(logging, Config.LOG_LEVEL.upper()))

    # Create handlers
    file_handler = RotatingFileHandler(
        Config.LOG_FILE, 
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    console_handler = logging.StreamHandler()

    # Create formatters and add it to handlers
    log_format = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(log_format)
    console_handler.setFormatter(log_format)

    # Add handlers to the logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger

logger = setup_logger()
