from datetime import datetime
from copy import deepcopy

import jmespath
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets

# from main.models import WeatherData
# from main.serializers import WeatherDataSerializer
# from main.forms import WeatherForm
# from main.utils import detailed_wind_direction, check_dates_valid, validate_date_to


from main.models import *
from main.serializers import *
from main.forms import *
from main.utils import *


API_KEY = '5f738ec388e84c2da51140026230911'
weather_api_link = 'http://api.weatherapi.com/v1/history.json?key={api_key}&q={city}&dt={date_from}&end_dt={date_to}'


class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer


def index(request):
    return render(request, 'index.html')


def history(request):
    return render(request, '_index.html')

def get_request(request):
    return HttpResponse('GET request received successfully!')


def post_request(request):
    return HttpResponse('POST request sent successfully!')


def get_weather_data(request):
    city = request.GET.get('city')
    date_from = request.GET.get('dateFrom')
    date_to = request.GET.get('dateTo')

    success = True
    status = 200
    data = {}

    try:
        check_input_data(city, date_from)
        date_to = validate_date_to(date_to)
        check_dates_valid(date_from, date_to)

        date_periods = split_daterange(date_from, date_to)
        location_data = {}
        data['results'] = []

        for date_period in date_periods:
            api_response = requests.get(weather_api_link.format(
                api_key=API_KEY,
                city=city,
                date_from=date_period[0],
                date_to=date_period[1]
            ))

            print(weather_api_link.format(
                api_key=API_KEY,
                city=city,
                date_from=date_period[0],
                date_to=date_period[1]
            ))

            check_external_response(api_response)
            api_response_json = api_response.json()
            location_data = api_response_json.get('location')

            forecast_by_days = jmespath.search('forecast.forecastday', api_response_json) or []
            for forecast_by_day in forecast_by_days:
                day_date = forecast_by_day.get('date')
                day_weather = forecast_by_day.get('day')
                day_astro = forecast_by_day.get('astro')

                data['results'].append({
                    'date': day_date,
                    'max_temp': day_weather.get('maxtemp_c'),
                    'min_temp': day_weather.get('mintemp_c'),
                    'avg_temp': day_weather.get('avgtemp_c'),
                    'max_wind_speed': day_weather.get('maxwind_kph'),
                    'avg_humidity': day_weather.get('avghumidity'),
                    'sunrise': day_astro.get('sunrise'),
                    'sunset': day_astro.get('sunset'),
                })

        data['location'] = {
            'city': location_data.get('name'),
            'region': location_data.get('region'),
            'country': location_data.get('country'),
            'lat': location_data.get('lat'),
            'lon': location_data.get('lon'),
            'localtime': location_data.get('localtime'),
        }

        response = {'success': success, 'status': status, 'data': data}
    except BadResponseException as bre:
        response = bre.to_dict()

    return JsonResponse(response, status=response['status'])


def get_weather_data_test(request):
    success = True
    status = 200
    data = {}

    url = 'http://api.weatherapi.com/v1/history.json?key=5f738ec388e84c2da51140026230911&q=Kyiv&dt=2023-10-16 00:00:00&end_dt=2023-11-14 00:00:00'
    response = requests.get(url)
    response_json = response.json()
    location_data = response_json.get('location')

    data['results'] = []

    forecast_by_days = jmespath.search('forecast.forecastday', response_json) or []
    for forecast_by_day in forecast_by_days:
        day_date = forecast_by_day.get('date')
        day_weather = forecast_by_day.get('day')
        day_astro = forecast_by_day.get('astro')

        data['results'].append({
            'date': day_date,
            'max_temp': day_weather.get('maxtemp_c'),
            'min_temp': day_weather.get('mintemp_c'),
            'avg_temp': day_weather.get('avgtemp_c'),
            'max_wind_speed': day_weather.get('maxwind_kph'),
            'avg_humidity': day_weather.get('avghumidity'),
            'sunrise': day_astro.get('sunrise'),
            'sunset': day_astro.get('sunset'),
        })

    data['location'] = {
        'city': location_data.get('name'),
        'region': location_data.get('region'),
        'country': location_data.get('country'),
        'lat': location_data.get('lat'),
        'lon': location_data.get('lon'),
        'localtime': location_data.get('localtime'),
    }

    response = {'success': success, 'status': status, 'data': data}
    return JsonResponse(response, status=response['status'])
