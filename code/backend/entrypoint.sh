#!/bin/bash

# Set default values for environment variables
: ${POSTGRES_HOST:="db"}
: ${POSTGRES_PORT:="5432"}

# Wait for Postgres to be ready
echo "Waiting for Postgres to be ready at $POSTGRES_HOST:$POSTGRES_PORT..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 1
done
echo "Postgres is ready!"

echo "[Info] Initializing Database..."
python3 init_db.py
if [ $? -ne 0 ]; then
    echo "[Error] Database initialization failed. Exiting..."
    exit 1
fi

echo "[Info] Starting Server..."
exec gunicorn --config /app/gunicorn.conf.py app.run:app
# exec python3 run.py
