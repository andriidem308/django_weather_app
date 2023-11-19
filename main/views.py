import logging
from datetime import datetime

import jmespath
import requests
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets

from django_weather_app.settings import WEATHER_API_KEY
from main.models import WeatherData
from main.serializers import WeatherDataSerializer
from main.tasks import add_weather_data
from main.utils import BadResponseException, check_external_response, split_daterange, check_input_data, \
    get_day_weather_from_response, validate_date_to, check_dates_valid, str_to_date

weather_api_link = 'http://api.weatherapi.com/v1/history.json?key={api_key}&q={city}&dt={date_from}&end_dt={date_to}'


class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer

    def get_queryset(self):
        city_param = self.request.query_params.get('city', None)
        date_from_param = self.request.query_params.get('date_from', None)
        date_to_param = self.request.query_params.get('date_to', None)

        queryset = WeatherData.objects.all()

        if city_param:
            queryset = queryset.filter(city=city_param)

        if date_from_param:
            queryset = queryset.filter(day__gte=date_from_param)

        if date_to_param:
            queryset = queryset.filter(day__lte=date_to_param)

        return queryset


def index(request):
    return render(request, 'index.html')


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
        data['results'] = []

        for date_period in date_periods:
            weather_data_list = WeatherData.get_weather_in_date_range(city, date_period[0], date_period[1])
            if weather_data_list:
                for weather_data in weather_data_list:
                    data['results'].append(weather_data.to_json())
            else:
                curr_date_from = datetime.strftime(date_period[0], '%Y-%m-%d')
                curr_date_to = datetime.strftime(date_period[1], '%Y-%m-%d')

                api_response = requests.get(weather_api_link.format(
                    api_key=WEATHER_API_KEY,
                    city=city,
                    date_from=curr_date_from,
                    date_to=curr_date_to
                ))

                check_external_response(api_response)
                api_response_json = api_response.json()

                forecast_by_days = jmespath.search('forecast.forecastday', api_response_json) or []
                for forecast_by_day in forecast_by_days:
                    day_weather = get_day_weather_from_response(forecast_by_day)
                    data['results'].append(day_weather)
                    if not WeatherData.objects.filter(city=city, day=day_weather.get('day')).exists():
                        add_weather_data.delay(city, day_weather)

        data['results'].sort(key=lambda x: str_to_date(x['day']), reverse=True)
        response = {'success': success, 'status': status, 'data': data}
    except BadResponseException as bre:
        response = bre.to_dict()

    return JsonResponse(response, status=response['status'])
