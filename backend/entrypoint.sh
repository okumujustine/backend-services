#!/bin/sh

# Exit on error
set -e

# Optional: Wait for DB to be ready
echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "Database is up!"

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Start server
echo "Starting server ..."

exec "$@"
