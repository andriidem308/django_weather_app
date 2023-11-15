from django.urls import path
from main.views import *


urlpatterns = [
    path('', index, name='homepage'),
    # path('get_weather_data/', get_weather_data_test, name='weather_data'),
    path('get_weather_data/', get_weather_data, name='weather_data'),
]

