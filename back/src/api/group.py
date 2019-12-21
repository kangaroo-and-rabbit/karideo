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

def add(_app, _name_api):
	elem_blueprint = Blueprint(_name_api)
	
	class DataModelBdd:
		id = int
		name = str
	
	data_global_elements.get_interface(_name_api).set_data_model(DataModelBdd)
	
	class DataModel:
		name = str
	
	@elem_blueprint.get('/' + _name_api, strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def list(request):
		return response.json(data_global_elements.get_interface(_name_api).gets())
	
	@elem_blueprint.post('/' + _name_api, strict_slashes=True)
	@doc.summary("Create new resource")
	@doc.description("Store a newly created resource in storage.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def create(request):
		return response.json(data_global_elements.get_interface(_name_api).post(request.json))
	
	@elem_blueprint.post('/' + _name_api + "/find", strict_slashes=True)
	@doc.summary("Create new resource if the name does not already exist")
	@doc.description("Store a newly created resource in storage.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def find_with_name(request):
		api = data_global_elements.get_interface(_name_api)
		for elem in api.bdd:
			if elem["name"] == request.json["name"]:
				return response.json({"id": elem["id"]})
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		value = data_global_elements.get_interface(_name_api).get(id)
		if value != None:
			return response.json(value)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>/video', strict_slashes=True)
	@doc.summary("get videos list")
	@doc.description("List all the videos availlable for this group.")
	@doc.produces(content_type='application/json')
	async def retrive_video(request, id):
		value = data_global_elements.get_interface(data_global_elements.API_VIDEO).gets_where(select=[["==", "group_id", id]], filter=["id"])
		if value != None:
			return response.json(value)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>/video_no_saison', strict_slashes=True)
	@doc.summary("get videos list who have no saison")
	@doc.description("List all the videos availlable for this group tht does not depend on saison.")
	@doc.produces(content_type='application/json')
	async def retrive_video_no_saison(request, id):
		value = data_global_elements.get_interface(data_global_elements.API_VIDEO).gets_where(select=[["==", "group_id", id], ["==", "saison_id", None]], filter=["id"])
		if value != None:
			return response.json(value)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>/saison', strict_slashes=True)
	@doc.summary("get videos list who have no saison")
	@doc.description("List all the videos availlable for this group tht does not depend on saison.")
	@doc.produces(content_type='application/json')
	async def retrive_saison(request, id):
		value = data_global_elements.get_interface(data_global_elements.API_SAISON).gets_where(select=[["==", "group_id", id]], filter=["id"])
		if value != None:
			return response.json(value)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.put('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Update resource")
	@doc.description("Update the specified resource in storage.")
	@doc.response_success(status=201, description='If successful updated')
	async def update(request, id):
		ret = data_global_elements.get_interface(_name_api).put(id)
		return response.json({})
	
	@elem_blueprint.delete('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Remove resource")
	@doc.description("Remove the specified resource from storage.")
	@doc.response_success(status=201, description='If successful deleted')
	async def delete(request, id):
		ret = data_global_elements.get_interface(_name_api).delete(id)
		if ret == True:
			return response.json({})
		raise ServerError("No data found", status_code=404)
	
	_app.blueprint(elem_blueprint)
