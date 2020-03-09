FROM python:alpine3.6

RUN apk update && \
    apk upgrade && \
    apk add --update-cache \
        --repository http://dl-cdn.alpinelinux.org/alpine/edge/community \
        --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
        --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
        build-base mediainfo

RUN pip3 install --upgrade pip

RUN pip3 install sanic==19.9.0

RUN pip3 install sanic-cors

RUN pip3 install sanic-simple-swagger

RUN pip3 install python-dateutil

RUN pip3 install realog

RUN pip3 install python-magic

RUN pip3 install pymediainfo

RUN pip3 install psycopg2

EXPOSE 80

ADD . /application/
WORKDIR /application/
CMD ["python3", "-u", "./app_video.py"]



