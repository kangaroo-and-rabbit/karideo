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
import copy
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



def generate_name(_value):
	group_name = ""
	if "univers_id" in _value.keys():
		univers_property = data_global_elements.get_interface(data_global_elements.API_UNIVERS).get(_value["univers_id"])
		if univers_property != None:
			group_name = univers_property["name"] + ":"
	if "group_id" in _value.keys():
		group_property = data_global_elements.get_interface(data_global_elements.API_GROUP).get(_value["group_id"])
		if group_property != None:
			group_name = group_property["name"]
	saison_number = ""
	if "saison_id" in _value.keys():
		saison_property = data_global_elements.get_interface(data_global_elements.API_SAISON).get(_value["saison_id"])
		if saison_property != None:
			saison_number = str(saison_property["number"])
			if len(saison_number) == 1:
				saison_number = "0" + saison_number
	out = ""
	if group_name != "":
		out += group_name + "-"
	if saison_number != "":
		out += "s" + saison_number + "-"
	if "episode" in _value.keys() and _value["episode"] != None:
		episode_id = _value["episode"];
		if type(episode_id) == str:
			episode_id = int(episode_id)
		if episode_id < 10:
			out += "e00" + str(episode_id) + "-" 
		elif episode_id < 100:
			out += "e0" + str(episode_id) + "-" 
		else:
			out += "e" + str(episode_id) + "-" 
	out += _value["name"]
	if "time" in _value.keys() and _value["time"] != None:
		out += "(" + _value["name"] + ")"
	return out
	

def add(_app, _name_api):
	elem_blueprint = Blueprint(_name_api)
	
	dataModelBdd = [
		{
			"name": "id",
			"type": "int",
			"modifiable": False,
			"can_be_null": False,
			"visible": True,
		},
		{
			"name": "data_id",
			"type": "int",
			"modifiable": True,
			"can_be_null": False,
			"visible": True,
		},
		{
			"name": "type_id",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "saison_id",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "episode",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "univers_id",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "group_id",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "name",
			"type": "str",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "description",
			"type": "str",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "date",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
		{
			"name": "time",
			"type": "int",
			"modifiable": True,
			"can_be_null": True,
			"visible": True,
		},
	]
	data_global_elements.get_interface(_name_api).set_data_model(dataModelBdd)
	data_global_elements.get_interface(_name_api).set_add_where(" AND type='media' ")
	
	class DataModel:
		type_id = int
		saison_id = int
		episode = int
		univers_id = int
		group_id = int
		name = str
		description = str
		# creating time
		create_date = str
		# date of the video
		date = str
		# number of second
		time = int
	
	@elem_blueprint.get('/' + _name_api, strict_slashes=True)
	@doc.summary("Show saisons")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def list(request):
		return response.json(data_global_elements.get_interface(_name_api).gets())
	
	@elem_blueprint.post('/' + _name_api, strict_slashes=True)
	@doc.summary("Create new saison")
	@doc.description("Create a new saison for a aspecific group id.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def create(request):
		data = request.json
		for type_key in ["data_id","name"]:
			if type_key not in data.keys():
				raise ServerError("Bad Request: Missing Key '" + type_key + "'", status_code=400)
		for type_key in ["create_date"]:
			if type_key in data.keys():
				raise ServerError("Forbidden: Must not be set Key '" + type_key + "'", status_code=403)
		#Find if already exist
		data["type"] = 'media'
		return response.json(data_global_elements.get_interface(_name_api).post(data))
	
	@elem_blueprint.get('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		value = data_global_elements.get_interface(_name_api).get(id)
		if value != None:
			generated_name = generate_name(value)
			tmp = copy.deepcopy(value)
			tmp["generated_name"] = generated_name
			return response.json(tmp)
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.put('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Update resource")
	@doc.description("Update the specified resource in storage.")
	@doc.response_success(status=201, description='If successful updated')
	async def update(request, id):
		ret = data_global_elements.get_interface(_name_api).put(id, request.json)
		return response.json({"update":"done"});
	
	@elem_blueprint.delete('/' + _name_api + '/<id:int>', strict_slashes=True)
	@doc.summary("Remove resource")
	@doc.description("Remove the specified resource from storage.")
	@doc.response_success(status=201, description='If successful deleted')
	async def delete(request, id):
		ret = data_global_elements.get_interface(_name_api).delete(id)
		if ret == True:
			return response.json({})
		raise ServerError("No data found", status_code=404)
	
	@elem_blueprint.post('/' + _name_api + "/<id:int>/add_cover", strict_slashes=True)
	@doc.summary("Add cover on video")
	@doc.description("Add a cover data ID to the video.")
	@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful added')
	async def create_cover(request, id):
		for type_key in ["data_id"]:
			if type_key not in request.json.keys():
				raise ServerError("Bad Request: Missing Key '" + type_key + "'", status_code=400)
		data = {}
		data["node_id"] = id
		data["data_id"] = request.json["data_id"]
		value = data_global_elements.get_interface(_name_api).get(id)
		if value == None:
			raise ServerError("No data found", status_code=404)
		data_global_elements.get_interface(data_global_elements.API_COVER).post(data)
		value = data_global_elements.get_interface(_name_api).get(id)
		
		return response.json(value)
	
	_app.blueprint(elem_blueprint)
