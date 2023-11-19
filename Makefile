PY = python3
MANAGE = manage.py

PM = $(PY) $(MANAGE)

run:
	$(PM) runserver $(port)

docker-run:
	docker-compose up --build -d

collect-static:
	$(PM) collectstatic

migrations:
	$(PM) makemigrations

migrations-main:
	$(PM) makemigrations main

migrate:
	$(PM) migrate

lint:
	flake8 .

superuser:
	$(PM) createsuperuser

startapp:
	$(PM) startapp $(app)

requirements:
	pip3 install -r requirements.txt