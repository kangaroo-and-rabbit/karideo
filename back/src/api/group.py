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
	
	dataModelBdd = [
		{
			"name": "id",
			"type": "int",
			"modifiable": False,
			"creatable": False,
			"can_be_null": False,
		},
		{
			"name": "type",
			"type": "string",
			"modifiable": False,
			"creatable": True,
			"can_be_null": False,
		},
		{
			"name": "name",
			"type": "str",
			"modifiable": True,
			"creatable": True,
			"can_be_null": False,
		},
		{
			"name": "description",
			"type": "str",
			"modifiable": True,
			"creatable": True,
			"can_be_null": False,
		}
	]
	data_global_elements.get_interface(_name_api).set_data_model(dataModelBdd)
	data_global_elements.get_interface(_name_api).set_add_where(" AND type='serie' ")
	
	class DataModel:
		name = str
		description = str
	
	@elem_blueprint.get('/' + _name_api, strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def list(request):
		if "select" in request.args:
			if request.args["select"] == "*":
				list_values = data_global_elements.get_interface(_name_api).gets_where(select=[["!=", "id", None]], order_by=["name"])
			else:
				list_values = data_global_elements.get_interface(_name_api).gets_where(select=[["!=", "id", None]], order_by=["name"], filter=request.args["select"])
			return response.json(list_values)
		return response.json(data_global_elements.get_interface(_name_api).gets())
	
	@elem_blueprint.post('/' + _name_api, strict_slashes=True)
	@doc.summary("Create new resource")
	@doc.description("Store a newly created resource in storage.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def create(request):
		data = request.json
		data["type"] = 'serie'
		return response.json(data_global_elements.get_interface(_name_api).post(data))
	
	@elem_blueprint.post('/' + _name_api + "/find", strict_slashes=True)
	@doc.summary("Create new resource if the name does not already exist")
	@doc.description("Store a newly created resource in storage.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def find_with_name(request):
		value = data_global_elements.get_interface(_name_api).find("name", request.json["name"])
		if value != None:
			return response.json(value)
		return response.HTTPResponse("No data found", status=404)
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		value = data_global_elements.get_interface(_name_api).get(id)
		if value != None:
			return response.json(value)
		return response.HTTPResponse("No data found", status=404)
	
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
		return response.HTTPResponse("No data found", status=404)
	
	@elem_blueprint.post('/' + _name_api + "/<id:int>/add_cover", strict_slashes=True)
	@doc.summary("Add cover on group")
	@doc.description("Add a cover data ID to the group.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful added')
	async def create_cover(request, id):
		for type_key in ["data_id"]:
			if type_key not in request.json.keys():
				return response.HTTPResponse("Bad Request: Missing Key '" + type_key + "'", status=400)
		data = {}
		data["node_id"] = id
		data["data_id"] = request.json["data_id"]
		value = data_global_elements.get_interface(_name_api).get(id)
		if value == None:
			return response.HTTPResponse("No data found", status=404)
		data_global_elements.get_interface(data_global_elements.API_COVER).post(data)
		value = data_global_elements.get_interface(_name_api).get(id)
		return response.json(value)
	
	_app.blueprint(elem_blueprint)
