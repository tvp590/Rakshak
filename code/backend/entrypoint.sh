#!/bin/bash

# Set default values for environment variables if they are not defined
: ${POSTGRES_HOST:="db"}
: ${POSTGRES_PORT:="5432"}

# Wait for Postgres to be ready
echo "Waiting for Postgres to be ready at $POSTGRES_HOST:$POSTGRES_PORT..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 1
done
echo "Postgres is ready!"

# Start Flask application
echo "Starting Flask app..."
exec python3 run.py
