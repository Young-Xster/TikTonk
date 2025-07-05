# start.sh
#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install dependencies
# pip install -r requirements.txt

# Create necessary directories
mkdir -p assets/temp
mkdir -p CookiesDir

# Start the application with gunicorn
exec gunicorn -c gunicorn.conf.py 'Main:app'
