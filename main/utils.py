import json
from datetime import datetime, timedelta

import jmespath


def str_to_date(str_date, date_format='%Y-%m-%d'):
    result = str_date
    if isinstance(str_date, str):
        result = datetime.strptime(str_date, date_format).date()
    return result


class BadResponseException(Exception):
    def __init__(self, message, status_code=400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

    def to_dict(self):
        return {
            'success': False,
            'message': self.message,
            'status': self.status_code,
        }

    def to_json(self):
        json.dumps(self.to_dict())

    def __str__(self):
        return self.to_json()


def error_check(func):
    def wrapper(*args, **kwargs):
        condition, message, status_code = func(*args, **kwargs)
        if not condition:
            raise BadResponseException(message=message, status_code=status_code)
        return
    return wrapper


@error_check
def check_input_data(city, date_from):
    condition = city and date_from
    message = 'city or/and dateFrom are not provided!'
    status_code = 400
    return condition, message, status_code


def validate_date_to(date_to):
    if not date_to:
        current_datetime = datetime.now()
        date_to = current_datetime.strftime('%Y-%m-%d')
    return date_to


@error_check
def check_dates_valid(str_date_1: str, str_date_2: str):
    date_1 = str_to_date(str_date_1)
    date_2 = str_to_date(str_date_2)

    condition = date_1 <= date_2
    message = 'dateTo cannot be earlier than dateFrom'
    status_code = 400

    return condition, message, status_code


@error_check
def check_external_response(external_response):
    external_status_code = external_response.status_code
    external_response_json = external_response.json()

    condition = external_status_code == 200
    message = jmespath.search('error.message', external_response_json) or 'Bad external response!'
    status_code = external_status_code

    return condition, message, status_code


def split_daterange(date_1_str, date_2_str):
    max_date_range = 30

    date_1 = str_to_date(date_1_str)
    date_2 = str_to_date(date_2_str)

    days_difference = (date_2 - date_1).days

    dateranges = []
    end_date = date_2
    while days_difference > 0:
        start_date = end_date - timedelta(max_date_range - 1)
        start_date = max(start_date, date_1)
        dateranges.append((start_date, end_date))

        end_date -= timedelta(max_date_range)
        days_difference -= max_date_range

    return dateranges


def get_day_weather_from_response(day_forecast):
    day_weather_data = day_forecast.get('day')

    day_weather = {
        'day': day_forecast.get('date'),
        'max_temp': day_weather_data.get('maxtemp_c'),
        'min_temp': day_weather_data.get('mintemp_c'),
        'avg_temp': day_weather_data.get('avgtemp_c'),
        'humidity': day_weather_data.get('avghumidity'),
        'sunrise': jmespath.search('astro.sunrise', day_forecast),
        'sunset': jmespath.search('astro.sunset', day_forecast),
    }

    return day_weather



