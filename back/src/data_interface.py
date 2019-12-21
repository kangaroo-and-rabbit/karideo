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
from sanic.exceptions import ServerError
##
## @breif Generic interface to access to the BDD (no BDD, direct file IO)
##
class DataInterface():
	def __init__(self, _name, _file):
		self.model = None
		self.name = _name
		self.file = _file
		self.bdd = []
		self.need_save = False
		self.last_id = 0
		if tools.exist(self.file) == False:
			self.mark_to_store()
			self.last_id = random.randint(20, 100)
		else:
			data = tools.file_read_data(self.file)
			self.bdd = json.loads(data)
		self.upgrade_global_bdd_id();
	
	def set_data_model(self, _data_model):
		self.model = _data_model
	
	def check_with_model(self, _data):
		if self.model == None:
			return True
		values = []
		for elem in dir(self.model):
			if elem[:2] == "__":
				continue
			values.append(elem)
		have_error = False
		for key in _data.keys():
			if key not in values:
				have_error = True
				# TODO: ...
				debug.warning("Add element that is not allowed " + key + " not in " + str(values))
		for elem in values:
			if key not in _data.keys():
				have_error = True
				# TODO: ...
				debug.warning("Missing key " + elem + " not in " + str(_data.keys()))
		if have_error == True:
			return False
		for key in _data.keys():
			elem = getattr(self.model, key)
			if type(elem) == list:
				find_error = True
				for my_type in elem:
					if type(_data[key]) == my_type:
						find_error = False
						break
				if find_error == True:
					debug.warning("data : " + str(_data))
					tmp_list = []
					for my_type in elem:
						tmp_list.append(my_type.__name__)
					debug.warning("[key='" + key + "'] try to add wrong type in BDD " + type(_data[key]).__name__ + " is not: " + str(my_type))
			else:
				if type(_data[key]) != getattr(self.model, key):
					debug.warning("data : " + str(_data))
					debug.warning("[key='" + key + "'] try to add wrong type in BDD " + type(_data[key]).__name__ + " is not: " + getattr(self.model, key).__name__)
					return False
		return True
	
	def upgrade_global_bdd_id(self):
		for elem in self.bdd:
			if 'id' not in elem.keys():
				continue
			if elem["id"] >= self.last_id:
				self.last_id = elem["id"] + 1
	
	def get_table_index(self, _id):
		id_in_bdd = 0
		for elem in self.bdd:
			if     'id' in elem.keys() \
			   and elem["id"] == _id:
				return id_in_bdd
			id_in_bdd += 1
		return None
	
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
		debug.warning("Save bdd: " + self.file)
		data = json.dumps(self.bdd, sort_keys=True, indent=4)
		self.need_save = False
		tools.file_write_data_safe(self.file, data)
	
	def gets(self, filter=None):
		debug.info("gets " + self.name)
		if filter == None:
			return self.bdd
		return self.filter_object_values(self.bdd, filter)
	
	def gets_where(self, select, filter=None):
		debug.info("gets " + self.name)
		tmp_list = self.get_sub_list(self.bdd, select)
		return self.filter_object_values(tmp_list, filter);
	
	def get(self, _id):
		debug.info("get " + self.name + ": " + str(_id))
		for elem in self.bdd:
			if     'id' in elem.keys() \
			   and elem["id"] == _id:
				return elem
		return None
	
	def delete(self, _id):
		debug.info("delete " + self.name + ": " + str(_id))
		id_in_bdd = self.get_table_index(_id)
		if id_in_bdd == None:
			return False
		del self.bdd[id_in_bdd]
		self.mark_to_store()
		return True
	
	def put(self, _id, _value):
		debug.info("put " + self.name + ": " + str(_id))
		id_in_bdd = self.get_table_index(_id)
		if id_in_bdd == None:
			return False
		_value["id"] = _id
		self.bdd[id_in_bdd] = _value
		self.mark_to_store()
		return True
	
	def post(self, _value):
		debug.info("post " + self.name)
		_value["id"] = self.last_id
		self.last_id += 1
		if self.check_with_model(_value) == False:
			raise ServerError("Corelation with BDD error", status_code=404)
		self.bdd.append(_value)
		self.mark_to_store()
		return _value
	
	# TODO : rework this
	def find(self, _list_token, _values):
		out = []
		for elem in self.bdd:
			find = True
			for token in _list_token:
				if elem[token] != _values[token]:
					find = False
					break
			if find == True:
				out.append(elem)
		return out
	
	def count(self, select = None):
		if select == None:
			return len(self.bdd)
		tmp = self.get_sub_list(self.bdd, select)
		return len(tmp)
	
	def get_sub_list(self, _values, _select):
		out = []
		for elem in _values:
			find = True
			if len(_select) == 0:
				find = False
			for elem_select in _select:
				if len(elem_select) != 3:
					raise ServerError("Internal Server Error: wrong select definition", 500)
				type_check = elem_select[0]
				token = elem_select[1]
				value = elem_select[2]
				if token in elem.keys():
					if type_check == "==":
						if not (elem[token] == value):
							find = False
							break
					elif type_check == "!=":
						if not (elem[token] != value):
							find = False
							break
					elif type_check == "<":
						if not (elem[token] < value):
							find = False
							break
					elif type_check == "<=":
						if not (elem[token] <= value):
							find = False
							break
					elif type_check == ">":
						if not (elem[token] >= value):
							find = False
							break
					elif type_check == ">=":
						if not (elem[token] >= value):
							find = False
							break
					else:
						raise ServerError("Internal Server Error: unknow comparing type ...", 500)
				else:
					find = False
					break
			if find == True:
				out.append(elem)
		return out
	
	def filter_object_values(self, _values, _filter):
		out = []
		if len(_filter) == 1:
			token = _filter[0]
			for elem in _values:
				if token not in elem.keys():
					continue
				if elem[token] not in out:
					out.append(elem[token])
			return out
		for elem in _values:
			element_out = {}
			for token in _filter:
				if token not in elem.keys():
					continue
				element_out[token] = elem[token]
			out.append(element_out)
		return out


