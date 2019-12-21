REST video API
==============

REST API for video streaming for personal web / application interface


Download the project
====================

simply download the application:
```
mkdir WORKSPACE & cd $_
git clone http://xxx/HeeroYui/rest_video.git restvideo
cd rest_video
```

**Note:** It is important to remove ```-``` and ```_``` becose some docker remove these element in the network name _(like ubuntu ...)_
**Note:** The networkname of a docker compose is ```thefoldername_default```


Run the application
===================

Start the application:
```
docker-compose up -d
```

Stop the application:
```
docker-compose down
```

Restart the application (on the fly):
```
docker-compose up -d --force-recreate --build
```



Run the application (debug)
===========================
before the first run:
```
cp -r data_base data
```

```
./src/app_video.py
```

or
```
SANIC_REST_PORT=15080 ./src/app_video.py
```

