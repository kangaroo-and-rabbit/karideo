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

from aiofiles import os as async_os

from pymediainfo import MediaInfo

from sanic import Sanic
from sanic import response
from sanic import views
from sanic import Blueprint
from sanic.exceptions import ServerError
from sanic.response import file_stream

from sanic_simple_swagger import swagger_blueprint, openapi_blueprint
from sanic_simple_swagger import doc

import tools
import data_interface
import data_global_elements

import hashlib
import shutil

tmp_value = 0

#curl  -F 'file=@Totally_Spies.mp4;type=application/octet-stream' -H 'transfer-encoding:chunked' 127.0.0.1:15080/data -X POST -O; echo ;

def add(_app, _name_api):
	elem_blueprint = Blueprint(_name_api)
	"""
	@elem_blueprint.get('/' + _name_api, strict_slashes=True)
	@doc.summary("Show saisons")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def list(request):
		return response.json(data_global_elements.get_interface(_name_api).gets())
	"""
	
	@elem_blueprint.post('/' + _name_api, strict_slashes=True, stream=True)
	@doc.summary("send new file data")
	@doc.description("Create a new data file (associated with his sha512.")
	#@doc.consumes(DataModel, location='body')#, required=True)
	@doc.response_success(status=201, description='If successful created')
	async def create(_request):
		debug.info("request streaming " + str(_request));
		args_with_blank_values = _request.headers
		debug.info("List arguments: " + str(args_with_blank_values));
		async def streaming(_response):
			debug.info("streaming " + str(_response));
			total_size = 0
			temporary_file = os.path.join(_app.config['REST_TMP_DATA'], str(tmp_value) + ".tmp")
			if not os.path.exists(_app.config['REST_TMP_DATA']):
				os.makedirs(_app.config['REST_TMP_DATA'])
			if not os.path.exists(_app.config['REST_MEDIA_DATA']):
				os.makedirs(_app.config['REST_MEDIA_DATA'])
			file_stream = open(temporary_file,"wb")
			sha1 = hashlib.sha512()
			while True:
				body = await _request.stream.read()
				if body is None:
					debug.warning("empty body");
					break
				total_size += len(body)
				debug.verbose("body " + str(len(body)) + "/" + str(total_size))
				file_stream.write(body)
				sha1.update(body)
			file_stream.close()
			print("SHA512: " + str(sha1.hexdigest()))
			destination_filename = os.path.join(_app.config['REST_MEDIA_DATA'], str(sha1.hexdigest()))
			if os.path.isfile(destination_filename) == True:
				answer_data = {
					"size": total_size,
					"sha512": str(sha1.hexdigest()),
					'filename': _request.headers["filename"],
					'mime-type': _request.headers["mime-type"],
					"already_exist": True,
				}
				await _response.write(json.dumps(answer_data, sort_keys=True, indent=4))
				return
			# move the file
			shutil.move(temporary_file, destination_filename)
			
			# collect media info ...
			media_info = MediaInfo.parse(destination_filename)
			data_metafile = {
				"sha512": str(sha1.hexdigest()),
				"size": total_size,
				'filename': _request.headers["filename"],
				'mime-type': _request.headers["mime-type"],
				'media-info': json.loads(media_info.to_json())
			}
			tools.file_write_data(destination_filename + ".meta", json.dumps(data_metafile, sort_keys=True, indent=4))
			answer_data = {
				"size": total_size,
				"sha512": str(sha1.hexdigest()),
				'filename': _request.headers["filename"],
				'mime-type': _request.headers["mime-type"],
				"already_exist": True,
			}
			await _response.write(json.dumps(answer_data, sort_keys=True, indent=4))
		return response.stream(streaming, content_type='application/json')
	
	@elem_blueprint.get('/' + _name_api + '/<id:string>', strict_slashes=True)
	@doc.summary("Show resources")
	@doc.description("Display a listing of the resource.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		filename = os.path.join(_app.config['REST_MEDIA_DATA'], id)
		if os.path.isfile(filename) == True:
			file_stat = await async_os.stat(filename)
			headers = {"Content-Length": str(file_stat.st_size)}
			return await file_stream(
				filename,
				headers=headers,
				chunked=False,
			)
		raise ServerError("No data found", status_code=404)
	
	_app.blueprint(elem_blueprint)


