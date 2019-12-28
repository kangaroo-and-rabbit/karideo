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
	
	class DataModelBdd:
		id = int
		size = int
		sha512 = str
		mime_type = str
		original_name = [str, type(None)]
		# creating time
		create_date = str
	
	data_global_elements.get_interface(_name_api).set_data_model(DataModelBdd)
	
	
	
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
			
			new_data = {
					"size": total_size,
					"sha512": str(sha1.hexdigest()),
					'original_name': _request.headers["filename"],
					'mime_type': _request.headers["mime-type"],
					'create_date': datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
				}
			# TODO: Check if the element already exist ...
			
			return_bdd = data_global_elements.get_interface(_name_api).post(new_data)
			
			basic_data_path = os.path.join(_app.config['REST_MEDIA_DATA'], str(return_bdd["id"]))
			
			if not os.path.exists(basic_data_path):
				os.makedirs(basic_data_path)
			destination_filename = os.path.join(basic_data_path, "video")
			"""
			if os.path.isfile(destination_filename) == True:
				answer_data = {
					"size": total_size,
					"sha512": str(sha1.hexdigest()),
					'filename': _request.headers["filename"],
					'mime_type': _request.headers["mime-type"],
					"already_exist": True,
				}
				await _response.write(json.dumps(answer_data, sort_keys=True, indent=4))
				return
			"""
			
			# move the file
			shutil.move(temporary_file, destination_filename)
			# collect media info ...
			media_info = MediaInfo.parse(destination_filename)
			data_metafile = {
				"sha512": str(sha1.hexdigest()),
				"size": total_size,
				'filename': _request.headers["filename"],
				'mime_type': _request.headers["mime-type"],
				'media_info': json.loads(media_info.to_json())
			}
			tools.file_write_data(os.path.join(basic_data_path, "meta.json"), json.dumps(data_metafile, sort_keys=True, indent=4))
			await _response.write(json.dumps(return_bdd, sort_keys=True, indent=4))
		return response.stream(streaming, content_type='application/json')
	
	@elem_blueprint.get('/' + _name_api + '/<id:string>', strict_slashes=True)
	@doc.summary("get a specific resource")
	@doc.description("Get a resource with all the needed datas ... It permeit seek for video stream.")
	@doc.produces(content_type='application/json')
	async def retrive(request, id):
		debug.warning("Request data media 2 : " + id);
		if id[-4:] == ".mp4":
			id = id[:-4]
		if id[-4:] == ".mkv":
			id = id[:-4]
		if id[-4:] == ".avi":
			id = id[:-4]
		if id[-4:] == ".ts":
			id = id[:-3]
		filename = os.path.join(_app.config['REST_MEDIA_DATA'], id, "video")
		value = data_global_elements.get_interface(_name_api).get(id)
		headers = {
			'Content-Type': value["mime_type"],
			'Accept-Ranges': 'Accept-Ranges: bytes'
			}
		try:
			with open(filename, 'rb') as fff:
				range_start = None
				range_end = None
				fff.seek(0, 2)
				file_length = fff.tell()
				fff.seek(0)
				try:
					range_ = '0-' + str(file_length)
					if 'range' in request.headers:
						range_ = request.headers['range'].split('=')[1]
					range_split = range_.split('-')
					range_start = int(range_split[0])
					fff.seek(range_start)
					range_end = int(range_split[1])
				except ValueError:
					pass
				if range_start and range_start != 0:
					if not range_end:
						range_end = file_length
					read_length = range_end - range_start
				else:
					range_start = 0
					read_length = file_length
					range_end = file_length
				fff.seek(range_start)
				headers['Content-Length'] = read_length
				headers['Content-Range'] = f'bytes {range_start}-{range_end-1}/{file_length}'
				async def streaming_fn(response):
					with open(filename, 'rb') as fff:
						chunk_size = 8192
						current_offset = range_start
						while (current_offset < file_length):
							chunk_start = current_offset
							fff.seek(current_offset)
							chunk_data = fff.read(min(chunk_size, file_length - current_offset))
							current_offset += chunk_size
							await response.write(chunk_data)
				return response.stream(streaming_fn, headers=headers, status=206)
		except FileNotFoundError:
			return response.HTTPResponse(status=404)
	
	
	_app.blueprint(elem_blueprint)


