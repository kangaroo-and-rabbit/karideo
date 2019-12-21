#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2019, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##

import time
import json
import os
import sys
import datetime
import time, threading
import realog.debug as debug

from sanic import Sanic
from sanic import response
from sanic import views
from sanic import Blueprint
from sanic.exceptions import ServerError

from sanic_simple_swagger import swagger_blueprint, openapi_blueprint
from sanic_simple_swagger import doc

import tools
import data_interface
import data_global_elements

def add(_app):
	@_app.route("/")
	@doc.description("get api system information")
	async def test(request):
		return response.json({
				"api-type": "video-broker",
				"api-version": _app.config['API_VERSION'],
				"title": _app.config['API_TITLE'],
				"description": _app.config['API_DESCRIPTION'],
				"contact": _app.config['API_CONTACT_EMAIL'],
				"licence": _app.config['API_LICENSE_NAME']
			})
