#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2019, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##

import tools
import json
from realog import debug
import random
import copy
from sanic.exceptions import ServerError
from psycopg2.extras import RealDictCursor

import db

def is_str(s, authorise):
	if s == None:
		if authorise == True:
			return True
		return False;
	if type(s) == str:
		return True
	return False

def is_boolean(s, authorise):
	if s == None:
		if authorise == True:
			return True
		return False;
	if s == True or s == False:
		return True
	return False

def is_int(s, authorise):
	if s == None:
		if authorise == True:
			return True
		return False;
	try:
		int(s)
		return True
	except ValueError:
		return False
	return False

def is_float(s, authorise):
	if s == None:
		if authorise == True:
			return True
		return False;
	try:
		float(s)
		return True
	except ValueError:
		return False
	return False
##
## @breif Generic interface to access to the BDD (no BDD, direct file IO)
##
class DataInterface():
	def __init__(self, _name, _base_name):
		self.model = None
		self.name = _name
		self.extract_base = "*"
		self.base_name = _base_name
		self.connection = db.connect_bdd();
		self.need_save = False
		#self.conn = self.connection.cursor()
	
	def __del__(self):
		db.remove_connection();
	
	def set_data_model(self, _data_model):
		self.model = _data_model
		self.extract_base = ""
		for elem in self.model:
			if elem["visible"] == True:
				if self.extract_base != "":
					self.extract_base += ","
				self.extract_base += elem["name"]
	
	##
	## @brief Mark the current BDD to store all in File system (sync)
	##
	def mark_to_store(self):
		self.need_save = True
	
	##
	## @brief Check if the Bdd need to be stored. It is stored if it has been requested.
	## The BDD is store in a separate file and move in the old one. Safe way to store
	##
	def check_save(self):
		if self.need_save == False:
			return
		debug.warning("Save bdd: ")
		self.connection.commit()
	
	def gets(self, filter=None):
		debug.info("gets " + self.name)
		cursor = self.connection.cursor(cursor_factory=RealDictCursor)
		cursor.execute('SELECT ' + self.extract_base + ' FROM ' + self.base_name + ' WHERE deleted = false')
		results = cursor.fetchall()
		#debug.info("gets data = " + json.dumps(results, indent=4))
		if filter == None:
			return results
		debug.warning("BDD does not suppor filter now ...");
		return results
	
	def gets_where(self, select, filter=None, order_by=None):
		debug.info("gets " + self.name)
		"""
		tmp_list = self.get_sub_list(self.bdd, select)
		tmp_list = self.order_by(tmp_list, order_by)
		return self.filter_object_values(tmp_list, filter);
		"""
	
	def get(self, _id):
		if type(_id) != int:
			debug.warning("get wrong input type...")
		debug.info("get " + self.name + ": " + str(_id))
		cursor = self.connection.cursor(cursor_factory=RealDictCursor)
		#cursor.execute('SELECT * FROM data WHERE deleted=0')
		#results = cursor.fetchall()
		#debug.info("display data = " + json.dumps(results, indent=4))
		req = (_id,)
		cursor.execute('SELECT ' + self.extract_base + ' FROM ' + self.base_name + ' WHERE deleted=false AND id=%s', req)
		results = cursor.fetchone()
		#debug.info("get specific data = " + json.dumps(results))
		return results;
	
	def delete(self, _id):
		debug.info("delete " + self.name + ": " + str(_id))
		cursor = self.connection.cursor()
		req = (_id,)
		cursor.execute('UPDATE ' + self.base_name + ' SET deleted=true WHERE id=%s', req)
		self.mark_to_store();
		return True
	
	def is_value_modifiable_and_good_type(self, _key, _value):
		if self.model == None:
			return True
		for elem in self.model:
			if _key == elem["name"]:
				if elem["modifiable"] == False:
					debug.warning("Try to set an input '" + str(_key) + "' but the element is not modifiable ... ");
					raise ServerError("FORBIDDEN Try to set an input '" + str(_key) + "' but the element is not modifiable", status_code=403)
				if elem["type"] == "str":
					if is_str(_value, elem["can_be_null"]) == True:
						return True
				elif elem["type"] == "int":
					if is_int(_value, elem["can_be_null"]) == True:
						return True
				elif elem["type"] == "float":
					if is_float(_value, elem["can_be_null"]) == True:
						return True
				elif elem["type"] == "boolean":
					if is_boolean(_value, elem["can_be_null"]) == True:
						return True
				else:
					return True;
				debug.warning("get element type == '" + str(type(_value)) + "' but request " + str(elem["type"]));
				raise ServerError("FORBIDDEN get element type == '" + str(type(_value)) + "' but request " + str(elem["type"]), status_code=403)
		# The key does not exist ...
		debug.warning("The KEY: '" + str(_key) + "' Is not in the list of availlable keys");
		raise ServerError("FORBIDDEN The KEY: '" + str(_key) + "' Is not in the list of availlable keys", status_code=403)
	
	def put(self, _id, _value):
		debug.info("put in " + self.name + ": " + str(_id))
		cursor = self.connection.cursor()
		request = 'UPDATE ' + self.base_name + ' SET'
		list_data = []
		first = True;
		for elem in _value.keys():
			if elem == "id":
				continue
			if self.is_value_modifiable_and_good_type(elem, _value[elem]) == False:
				return;
			if first == True:
				first = False
			else:
				request += " , "
			list_data.append(_value[elem])
			request += " " + elem + " = %s"
		request += " WHERE id = %s "
		list_data.append(_id)
		debug.info("Request executed : '" + request + "'")
		cursor.execute(request, list_data)
		self.mark_to_store();
		return True
	
	def post(self, _value):
		debug.info("post " + self.name)
		"""
		if self.check_with_model(_value) == False:
			raise ServerError("Corelation with BDD error", status_code=404)
		self.bdd.append(_value)
		"""
		self.mark_to_store();
		return _value
	


