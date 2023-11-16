from celery import shared_task
from .models import WeatherData
from .utils import str_to_date


@shared_task
def add_weather_data(city, day_weather):
    WeatherData.objects.create(
        city=city,
        day=str_to_date(day_weather['day']),
        max_temp=day_weather['max_temp'],
        min_temp=day_weather['min_temp'],
        avg_temp=day_weather['avg_temp'],
        humidity=day_weather['humidity'],
        sunrise=day_weather['sunrise'],
        sunset=day_weather['sunset'],
    )
