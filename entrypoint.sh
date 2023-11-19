#!/bin/sh

python manage.py makemigrations --no-input
python manage.py makemigrations main --no-input
python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn django_weather_app.wsgi:application --bind 0.0.0.0:8000
