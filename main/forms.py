from django import forms


class WeatherForm(forms.Form):
    city = forms.CharField(label='City', max_length=100)
    from_date = forms.DateField(label='From Date', widget=forms.DateInput(attrs={'type': 'date'}))
    end_date = forms.DateField(label='End Date', widget=forms.DateInput(attrs={'type': 'date'}))

    def clear_fields(self):
        self.city.value = ''
        self.from_date.value = ''
        self.end_date.value = ''

