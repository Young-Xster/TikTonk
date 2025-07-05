import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask configurations
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Server configurations
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    
    # Path configurations
    VIDEO_DIR = os.getenv('VIDEO_DIR', './Global-Backend/assets/temp')
    FONT_PATH = os.getenv('FONT_PATH', './assets/font1.otf')
    
    # Video quality configuration
    DEFAULT_VIDEO_QUALITY = os.getenv('DEFAULT_VIDEO_QUALITY', '720')
    
    # Cookie directory
    COOKIE_DIR = os.getenv('COOKIE_DIR', './CookiesDir')
    
    # Logging configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'app.log')
    
    # CORS configuration
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')
    
    # Rate limiting
    RATE_LIMIT = os.getenv('RATE_LIMIT', '100/hour')
