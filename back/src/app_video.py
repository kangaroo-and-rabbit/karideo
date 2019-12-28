#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2019, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##
#pip install flask --user
#pip install flask_restful --user
#pip install python-dateutil --user
#pip install sanic --user
#pip install sanic_simple_swagger --user

from sanic import Sanic
from sanic import response
from sanic import views
from sanic import Blueprint
from sanic.exceptions import ServerError
from sanic_simple_swagger import swagger_blueprint, openapi_blueprint
from sanic_simple_swagger import doc
from spf import SanicPluginsFramework

import dateutil.parser


import time
import json
import os
import sys
import datetime
import time, threading
import realog.debug as debug

debug.enable_color()

import tools
import data_interface
import data_global_elements


from sanic_cors.extension import cors
app = Sanic(__name__)
spf = SanicPluginsFramework(app)
spf.register_plugin(cors, automatic_options=True)

app.config['API_VERSION'] = '1.0.0'
app.config['API_TITLE'] = 'Rest personal video API'
app.config['API_DESCRIPTION'] = 'Simple API for the Video broker.'
app.config['API_CONTACT_EMAIL'] = "yui.heero@gmail.com"
app.config['API_LICENSE_NAME'] = 'MPL 2.0'
app.config['API_LICENSE_URL'] = 'https://www.mozilla.org/en-US/MPL/2.0/'
app.config['schemes'] = ['http', 'https']
if "REST_TMP_DATA" not in app.config.keys():
	app.config['REST_TMP_DATA'] = os.path.join("data", "tmp")
if "REST_MEDIA_DATA" not in app.config.keys():
	app.config['REST_MEDIA_DATA'] = os.path.join("data", "media")
if "REST_DATA" not in app.config.keys():
	app.config['REST_DATA'] = "data"
if "REST_HOST" not in app.config.keys():
	app.config['REST_HOST'] = "localhost"
if "REST_PORT" not in app.config.keys():
	app.config['REST_PORT'] = "80"

app.blueprint(openapi_blueprint)
app.blueprint(swagger_blueprint)


default_values_type = [
	{
		"id": 0,
		"name": "Documentary",
		"description": "Documentary (annimals, space, earth...)"
	},{
		"id": 1,
		"name": "Movie",
		"description": "Movie with real humans (film)"
	},{
		"id": 2,
		"name": "Annimation",
		"description": "Annimation movies (film)"
	},{
		"id": 3,
		"name": "Short Films",
		"description": "Small movies (less 2 minutes)"
	},{
		"id": 4,
		"name": "tv show",
		"description": "Tv show form old peoples"
	}, {
		"id": 5,
		"name": "Anniation tv show",
		"description": "Tv show form young peoples"
	}, {
		"id": 6,
		"name": "Theater",
		"description": "recorder theater pices"
	}, {
		"id": 7,
		"name": "One man show",
		"description": "Recorded stand up"
	}, {
		"id": 8,
		"name": "Concert",
		"description": "Recorded concert"
	}, {
		"id": 9,
		"name": "Opera",
		"description": "Recorded Opera"
	}
]


def add_interface(_name, _default_value = None):
	interface = data_interface.DataInterface(_name, os.path.join(tools.get_run_path(), app.config['REST_DATA'], "bdd_" + _name + ".json"))
	if _default_value != None:
		if interface.count() == 0:
			interface.reset_with_value(_default_value);
	data_global_elements.add_interface(_name, interface)

add_interface(data_global_elements.API_DATA)
add_interface(data_global_elements.API_TYPE, default_values_type)
add_interface(data_global_elements.API_GROUP)
add_interface(data_global_elements.API_SAISON)
add_interface(data_global_elements.API_VIDEO)

import api.root as api_root
api_root.add(app)

import api.type as api_type
api_type.add(app, data_global_elements.API_TYPE)

import api.group as api_group
api_group.add(app, data_global_elements.API_GROUP)

import api.saison as api_saison
api_saison.add(app, data_global_elements.API_SAISON)

import api.video as api_video
api_video.add(app, data_global_elements.API_VIDEO)

import api.data as api_data
api_data.add(app, data_global_elements.API_DATA)




if __name__ == "__main__":
	debug.info("Start REST application: " + str(app.config['REST_HOST']) + ":" + str(app.config['REST_PORT']))
	app.config.REQUEST_MAX_SIZE=10*1024*1024*1024
	app.run(host=app.config['REST_HOST'], port=int(app.config['REST_PORT']))
	#app.stop()
	debug.info("Sync all BDD ... (do not force stop ...)");
	data_global_elements.save_all_before_stop();
	debug.info("END program");
	sys.exit(0)


