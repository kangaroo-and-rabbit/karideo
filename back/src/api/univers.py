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
		description = str
		covers = [[], type(None)]
	
	data_global_elements.get_interface(_name_api).set_data_model(DataModelBdd)
	
	class DataModel:
		name = str
		description = str
	
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
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		value = data_global_elements.get_interface(_name_api).get(id)
		if value != None:
			return response.json(value)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.put('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Update resource")
	@doc.description("Update the specified resource in storage.")
	@doc.response_success(status=201, description='If successful updated')
	async def update(request, id):
		ret = data_global_elements.get_interface(_name_api).put(id, request.json)
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
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>/count', strict_slashes=True)
	@doc.summary("Count resources in this cathegory")
	@doc.description("count resources in this cathegory, in the whole tree.")
	@doc.produces(content_type='application/json')
	async def count_values(request, id):
		count_value = data_global_elements.get_interface(data_global_elements.API_VIDEO).count(select=[["==", "univers_id", id]])
		return response.json({"count":count_value})
	
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>/video_all', strict_slashes=True)
	@doc.summary("List the whole video ids even if they are in a group or a univers...")
	@doc.description("List all video availlable with this univers (list of ids).")
	@doc.produces(content_type='application/json')
	async def retrive_video(request, id):
		list_values = data_global_elements.get_interface(data_global_elements.API_VIDEO).gets_where(select=[["==", "univers_id", id]], filter=["id"])
		return response.json(list_values)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>/video', strict_slashes=True)
	@doc.summary("List the whole video free")
	@doc.description("List all video availlable with this univers ... not link with an univers or a group.")
	@doc.produces(content_type='application/json')
	async def retrive_video_no_group(request, id):
		list_values = data_global_elements.get_interface(data_global_elements.API_VIDEO).gets_where(select=[["==", "univers_id", id], ["==", "group_id", None], ["==", "univers_id", None]], filter=["id"])
		return response.json(list_values)
	
	## ----------------------------------------------------------------------------------------
	@elem_blueprint.get('/' + _name_api + '/<id:int>/group', strict_slashes=True)
	@doc.summary("List all group availlable.")
	@doc.description("List all groups availlable in this univers (not depending of an univers).")
	@doc.produces(content_type='application/json')
	async def retrive_group(request, id):
		list_values = data_global_elements.get_interface(data_global_elements.API_VIDEO).gets_where(select=[["==", "univers_id", id], ["!=", "group_id", None], ["==", "univers_id", None]], filter=["group_id"])
		if "select" in request.args:
			if request.args["select"] == "*":
				list_values = data_global_elements.get_interface(data_global_elements.API_GROUP).gets_where(select=[["==", "id", list_values]])
			else:
				list_values = data_global_elements.get_interface(data_global_elements.API_GROUP).gets_where(select=[["==", "id", list_values]], filter=request.args["select"].split('|'))
		return response.json(list_values)
	
	@elem_blueprint.post('/' + _name_api + "/<id:int>/add_cover", strict_slashes=True)
	@doc.summary("Add cover on univers")
	@doc.description("Add a cover data ID to the univers.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful added')
	async def create(request, id):
		for type_key in ["data_id"]:
			if type_key not in request.json.keys():
				raise ServerError("Bad Request: Missing Key '" + type_key + "'", status_code=400)
		# TODO: check if it is a number...
		value = data_global_elements.get_interface(_name_api).get(id)
		if value == None:
			raise ServerError("No data found", status_code=404)
		if "covers" not in value.keys():
			value["covers"] = [];
		
		for elem in value["covers"]:
			if request.json["data_id"] == elem:
				return response.json(elem)
		value["covers"].append(request.json["data_id"]);
		data_global_elements.get_interface(_name_api).set(id, value)
		return response.json(value)
	
	_app.blueprint(elem_blueprint)