from django.urls import include, path
from rest_framework.routers import DefaultRouter

from main.views import index, get_weather_data, WeatherDataViewSet

router = DefaultRouter()
router.register(r'weatherdata', WeatherDataViewSet, basename='weatherdata')

urlpatterns = [
    path('', index, name='homepage'),
    path('get_weather_data/', get_weather_data, name='weather_data'),
    path('api/', include(router.urls)),
]
