FROM python:3.11-alpine

WORKDIR /app

COPY requirements/base.txt requirements/base.txt
COPY requirements/dev.txt requirements/dev.txt

RUN pip install --no-cache-dir -r requirements/dev.txt

COPY . .

EXPOSE 8000

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]