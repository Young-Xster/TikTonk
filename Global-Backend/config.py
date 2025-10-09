# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# class Config:
#     # Flask configurations
#     SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
#     DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
#     # Server configurations
#     HOST = os.getenv('HOST', '0.0.0.0')
#     PORT = int(os.getenv('PORT', 5000))
    
#     # Redis configurations for job queue
#     REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
#     REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
#     REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
#     REDIS_DB = int(os.getenv('REDIS_DB', 0))
#     REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', None)
    
#     # Job queue configurations
#     JOB_TIMEOUT = int(os.getenv('JOB_TIMEOUT', 3600))  # 1 hour default
#     RESULT_TTL = int(os.getenv('RESULT_TTL', 86400))   # 24 hours default
#     QUEUE_NAME = os.getenv('QUEUE_NAME', 'video_jobs')
#     MAX_WORKERS = int(os.getenv('MAX_WORKERS', 2))
    
#     # Path configurations
#     VIDEO_DIR = os.getenv('VIDEO_DIR', './Global-Backend/assets/temp')
#     FONT_PATH = os.getenv('FONT_PATH', './assets/font1.otf')
    
#     # Video quality configuration
#     DEFAULT_VIDEO_QUALITY = os.getenv('DEFAULT_VIDEO_QUALITY', '720')
    
#     # Cookie directory
#     COOKIE_DIR = os.getenv('COOKIE_DIR', './CookiesDir')
    
#     # Logging configuration
#     LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
#     LOG_FILE = os.getenv('LOG_FILE', 'app.log')
    
#     # CORS configuration
#     ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')
    
#     # Rate limiting
#     RATE_LIMIT = os.getenv('RATE_LIMIT', '100/hour')

#     @classmethod
#     def get_redis_connection_params(cls):
#         """Get Redis connection parameters"""
#         if cls.REDIS_URL:
#             return {'url': cls.REDIS_URL}
#         else:
#             params = {
#                 'host': cls.REDIS_HOST,
#                 'port': cls.REDIS_PORT,
#                 'db': cls.REDIS_DB
#             }
#             if cls.REDIS_PASSWORD:
#                 params['password'] = cls.REDIS_PASSWORD
#             return params









import os
from datetime import timedelta

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    
    # Server Configuration
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    # CORS Configuration
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
    
    # Rate Limiting
    RATE_LIMIT = os.environ.get('RATE_LIMIT', '10 per minute')
    
    # Video Configuration
    DEFAULT_VIDEO_QUALITY = os.environ.get('DEFAULT_VIDEO_QUALITY', '720')
    FONT_PATH = os.environ.get('FONT_PATH', 'Bangers-Regular.ttf')
    
    # Directory Configuration
    VIDEO_DIR = os.environ.get('VIDEO_DIR', './Global-Backend/assets/temp')
    COOKIE_DIR = os.environ.get('COOKIE_DIR', './cookies')
    
    # Worker Configuration
    MAX_WORKERS = int(os.environ.get('MAX_WORKERS', '3'))
    
    # Task Configuration
    TASK_TIMEOUT = int(os.environ.get('TASK_TIMEOUT', '1800'))  # 30 minutes
    TASK_CLEANUP_INTERVAL = int(os.environ.get('TASK_CLEANUP_INTERVAL', '1800'))  # 30 minutes
    
    # Redis Configuration (if you want to use Redis for queue in future)
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'app.log')
    
    # TikTok Configuration
    TIKTOK_SESSION_TIMEOUT = int(os.environ.get('TIKTOK_SESSION_TIMEOUT', '3600'))  # 1 hour
    
    # Content Generation
    GPT_MODEL = os.environ.get('GPT_MODEL', 'sonar-pro')
    GPT_PROVIDER = os.environ.get('GPT_PROVIDER', 'PerplexityLabs')
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', '100')) * 1024 * 1024  # 100MB
    
    # Health Check Configuration
    HEALTH_CHECK_TIMEOUT = int(os.environ.get('HEALTH_CHECK_TIMEOUT', '30'))

class ProductionConfig(Config):
    DEBUG = False
    RATE_LIMIT = '5 per minute'
    MAX_WORKERS = 2
    LOG_LEVEL = 'WARNING'

class DevelopmentConfig(Config):
    DEBUG = True
    RATE_LIMIT = '20 per minute'
    MAX_WORKERS = 1
    LOG_LEVEL = 'DEBUG'

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    RATE_LIMIT = '100 per minute'
    MAX_WORKERS = 1

# Configuration mapping
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'default')
    return config_map.get(env, DevelopmentConfig)