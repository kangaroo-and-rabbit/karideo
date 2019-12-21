FROM python:alpine

RUN pip install --upgrade pip

RUN pip install sanic

RUN pip install sanic-cors

RUN pip install sanic-simple-swagger

RUN pip install python-dateutil

RUN pip install realog

RUN pip install python-magic

RUN pip install pymediainfo

EXPOSE 80

ADD src /application/
WORKDIR /application/
CMD ["python", "-u", "./app_video.py"]



