# Django Weather App


## How to launch?

### 1. Clone this repository
using SSH:

``` git clone git@github.com:andriidem308/django_weather_app.git ```

or HTTPS:

``` git clone https://github.com/andriidem308/django_weather_app.git ```


### 2. Open the copied directory on your machine via terminal/console

### 3. Configure virtual environment

```python3.10 -m venv venv```

Activate:

```source venv/bin/activate```

### 3. Install requirements
If you have "make", you can write the following command:

```make requirements```

If you haven't one and don't want to install make, write these commands:

```pip install -r requirements.txt```

### 4. Make migrations:

```make migrations```

```make migrations-main```

```make migrate```

or

```python manage.py makemigrations```

```python manage.py makemigrations main```

```python manage.py migrate```


### 5. Launch scheduler
Run RabbitMQ:

```sudo service rabbitmq-server start```

Run Celery Worker:

```celery -A django_weather_app worker -l info```

### 6. Run application

```make run```

Then go to http://127.0.0.1:8000/ and do whatever you want :)
