from django.db import models


class WeatherData(models.Model):
    city = models.CharField(max_length=32)
    day = models.DateField()
    max_temp = models.FloatField()
    min_temp = models.FloatField()
    avg_temp = models.FloatField()
    humidity = models.FloatField()
    sunrise = models.CharField(max_length=16)
    sunset = models.CharField(max_length=16)

    class Meta:
        unique_together = ('city', 'day')

    @classmethod
    def get_weather_in_date_range(cls, city, start_date, end_date):
        weather_data = cls.objects.filter(city=city, day__range=[start_date, end_date])
        all_days_covered = cls._check_all_days_covered(start_date, end_date, weather_data)
        if not all_days_covered:
            weather_data = []

        return weather_data

    @staticmethod
    def _check_all_days_covered(start_date, end_date, weather_data):
        days_to_check = (end_date - start_date).days + 1
        covered_days = len(weather_data)
        return days_to_check == covered_days

    def to_json(self):
        return {
            'day': self.day,
            'max_temp': self.max_temp,
            'min_temp': self.min_temp,
            'avg_temp': self.avg_temp,
            'humidity': self.humidity,
            'sunrise': self.sunrise,
            'sunset': self.sunset,
        }

    def __str__(self):
        return f'{self.day} | {self.city}'
