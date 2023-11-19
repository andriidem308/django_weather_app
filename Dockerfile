FROM python:3.10-alpine

RUN pip install --upgrade pip

COPY . .

RUN pip install -r requirements.txt

COPY ./entrypoint.sh /
ENTRYPOINT ["sh", "/entrypoint.sh"]