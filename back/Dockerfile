FROM python:alpine3.6

RUN apk update \
    && apk add build-base

RUN pip3 install --upgrade pip

RUN pip3 install sanic

RUN pip3 install sanic-cors

RUN pip3 install sanic-simple-swagger

RUN pip3 install python-dateutil

RUN pip3 install realog

RUN pip3 install python-magic

RUN pip3 install pymediainfo

EXPOSE 80

ADD src /application/
WORKDIR /application/
CMD ["python3", "-u", "./app_video.py"]



