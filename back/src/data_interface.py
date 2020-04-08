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
import psycopg2

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
	def __init__(self, _name, _base_name, _name_view):
		self.model = None
		self.name = _name
		self.name_view = _name_view
		self.extract_base = "*"
		self.base_name = _base_name
		self.connection = db.connect_bdd();
		self.need_save = False
		self.where_expand = "";
		#self.conn = self.connection.cursor()
	
	def __del__(self):
		db.remove_connection();
	
	def set_data_model(self, _data_model):
		self.model = _data_model
		"""
		self.extract_base = ""
		for elem in self.model:
			if elem["visible"] == True:
				if self.extract_base != "":
					self.extract_base += ","
				self.extract_base += elem["name"]
		"""
	def set_add_where(self, _expand):
		self.where_expand = _expand
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
		self.need_save = False
	
	def gets(self, filter=None):
		debug.info("gets " + self.name)
		cursor = self.connection.cursor(cursor_factory=RealDictCursor)
		cursor.execute('SELECT * FROM ' + self.name_view + '')
		results = cursor.fetchall()
		#debug.info("gets data = " + json.dumps(results, indent=4))
		if filter == None:
			return results
		debug.warning("BDD does not suppor filter now ...");
		self.connection.commit()
		return results
	
	def get(self, _id):
		if type(_id) != int:
			debug.warning("get wrong input type...")
		debug.info("get " + self.name + ": " + str(_id))
		cursor = self.connection.cursor(cursor_factory=RealDictCursor)
		#cursor.execute('SELECT * FROM data WHERE deleted=0')
		#results = cursor.fetchall()
		#debug.info("display data = " + json.dumps(results, indent=4))
		req = (_id,)
		try:
			cursor.execute('SELECT * FROM ' + self.name_view + ' WHERE id=%s', req)
		except psycopg2.errors.UndefinedFunction:
			raise ServerError("INTERNAL_ERROR fail request SQL ...", status_code=500)
		finally:
			self.connection.commit()
		results = cursor.fetchone()
		#debug.info("get specific data = " + json.dumps(results))
		return results;
	
	def find(self, _key, _value):
		debug.info("get " + self.name + ": " + str(_value))
		cursor = self.connection.cursor(cursor_factory=RealDictCursor)
		req = (_value,)
		try:
			cursor.execute('SELECT * FROM ' + self.name_view + ' WHERE ' + _key + '=%s', req)
		except psycopg2.errors.UndefinedFunction:
			raise ServerError("INTERNAL_ERROR fail request SQL ...", status_code=500)
		finally:
			self.connection.commit()
		results = cursor.fetchone()
		#debug.info("get specific data = " + json.dumps(results))
		return results;
	def find2(self, _key1, _value1, _key2, _value2):
		debug.info("get " + self.name + ": " + str(_value1))
		cursor = self.connection.cursor(cursor_factory=RealDictCursor)
		req = (_value1,_value2)
		try:
			cursor.execute('SELECT * FROM ' + self.name_view + ' WHERE ' + _key1 + '=%s AND ' + _key2 + '=%s', req)
		except psycopg2.errors.UndefinedFunction:
			raise ServerError("INTERNAL_ERROR fail request SQL ...", status_code=500)
		finally:
			self.connection.commit()
		results = cursor.fetchone()
		#debug.info("get specific data = " + json.dumps(results))
		return results;
	
	def delete(self, _id):
		debug.info("delete " + self.name + ": " + str(_id))
		cursor = self.connection.cursor()
		req = (_id,)
		try:
			cursor.execute('UPDATE ' + self.base_name + ' SET deleted=true WHERE id=%s' + self.where_expand, req)
		except psycopg2.errors.UndefinedFunction:
			raise ServerError("INTERNAL_ERROR fail request SQL ...", status_code=500)
		finally:
			self.connection.commit()
		self.mark_to_store();
		return True
	
	def is_value_modifiable_and_good_type(self, _key, _value, _check_with="modifiable"):
		if self.model == None:
			return True
		for elem in self.model:
			if _key == elem["name"]:
				if elem[_check_with] == False:
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
		return False
	
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
		request += " WHERE id = %s " + self.where_expand
		list_data.append(_id)
		debug.info("Request executed : '" + request + "'")
		try:
			cursor.execute(request, list_data)
		except psycopg2.errors.UndefinedFunction:
			raise ServerError("INTERNAL_ERROR fail request SQL ...", status_code=500)
		finally:
			self.connection.commit()
		self.mark_to_store();
		return self.get(_id);
	
	def post(self, _value):
		debug.info("post " + self.name)
		cursor = self.connection.cursor()
		request = 'INSERT INTO ' + self.base_name
		list_data = []
		first = True;
		aaa = ""
		bbb = ""
		for elem in _value.keys():
			if elem == "id":
				continue
			if self.is_value_modifiable_and_good_type(elem, _value[elem], "creatable") == False:
				return;
			if aaa != "":
				aaa += " , "
			if bbb != "":
				bbb += " , "
			aaa += elem
			bbb += "%s"
			list_data.append(_value[elem])
		request += " ( " + aaa + ") VALUES  ( " + bbb + ") RETURNING id"
		debug.info("Request executed : '" + request + "'")
		try:
			cursor.execute(request, list_data)
		except psycopg2.errors.UndefinedFunction:
			raise ServerError("INTERNAL_ERROR fail request SQL ...", status_code=500)
		finally:
			self.connection.commit()
		id_of_new_row = cursor.fetchone()[0]
		self.mark_to_store();
		return self.get(id_of_new_row);
	


