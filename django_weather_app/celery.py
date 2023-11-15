from __future__ import absolute_import, unicode_literals

import os

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_weather_app.settings')

app = Celery('django_weather_app')

app.conf.broker_url = 'memory://localhost/'
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
