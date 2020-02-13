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
import sqlite3


def dict_factory(cursor, row):
	d = {}
	for idx, col in enumerate(cursor.description):
		if col[0] == "covers":
			if row[idx] != None:
				d[col[0]] = row[idx].split("/")
			else:
				d[col[0]] = None
		else:
			d[col[0]] = row[idx]
	return d

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
		else:
			self.conn = sqlite3.connect(self.file)
			self.conn.row_factory = dict_factory
			#self.cursor = self.conn.cursor()
		##self.upgrade_global_bdd_id();
	
	def set_data_model(self, _data_model):
		self.model = _data_model
	
	def reset_with_value(self, _data):
		self.bdd = _data
		self.last_id = 0
		self.mark_to_store()
		##self.upgrade_global_bdd_id();
	
	def check_with_model(self, _data):
		return True
		"""
		if self.model == None:
			return True
		values = []
		for elem in dir(self.model):
			debug.info("check element : " + elem);
			if elem[:2] == "__":
				continue
				debug.info("    ==> select");
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
		"""
	
	def upgrade_global_bdd_id(self):
		"""
		self.last_id = 0
		for elem in self.bdd:
			if 'id' not in elem.keys():
				continue
			if elem["id"] >= self.last_id:
				self.last_id = elem["id"] + 1
		# start at a random value permit to vaidate the basis inctance test
		if self.last_id == 0:
			self.last_id = random.randint(20, 100)
		"""
	
	def get_table_index(self, _id):
		"""
		id_in_bdd = 0
		for elem in self.bdd:
			if     'id' in elem.keys() \
			   and elem["id"] == _id:
				return id_in_bdd
			id_in_bdd += 1
		return None
		"""
	
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
		conn.commit()
	
	def gets(self, filter=None):
		debug.info("gets " + self.name)
		cursor = self.conn.cursor()
		cursor.execute('SELECT * FROM data WHERE deleted=0')
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
		cursor = self.conn.cursor()
		#cursor.execute('SELECT * FROM data WHERE deleted=0')
		#results = cursor.fetchall()
		#debug.info("display data = " + json.dumps(results, indent=4))
		req = (_id,)
		cursor.execute('SELECT * FROM data WHERE deleted=0 AND id=?', req)
		results = cursor.fetchone()
		#debug.info("get specific data = " + json.dumps(results))
		return results;
	
	def set(self, _id, _value):
		"""
		if type(_id) != int:
			debug.warning("get wrong input type...")
		for elem in self.bdd:
			if     'id' in elem.keys() \
			   and elem["id"] == _id:
				elem = _value
				self.mark_to_store()
				return elem
		debug.warning("not found element: " + str(len(self.bdd)))
		"""
		return None
	
	def delete(self, _id):
		debug.info("delete " + self.name + ": " + str(_id))
		req = (_id,)
		cursor.execute('UPDATE data SET deleted=1 WHERE id=?', req)
		return True
	
	def put(self, _id, _value):
		request = 'UPDATE data WHERE id=? SET'
		list_data = [_id]
		for elem in _value.keys():
			if elem == "id":
				continue
			list_data.append(_value[elem])
			request += " '" + elem + "' = ?"
		cursor.execute(request, list_data)
		
		"""
		debug.info("put " + self.name + ": " + str(_id))
		id_in_bdd = self.get_table_index(_id)
		if id_in_bdd == None:
			return False
		# todo: check the model before update ...
		debug.warning("update element: " + str(_id))
		value_bdd = copy.deepcopy(self.bdd[id_in_bdd]);
		for elem in _value.keys():
			debug.warning("    [" + elem + "] " + str(value_bdd[elem]) + " ==> " + str(_value[elem]))
			value_bdd[elem] = _value[elem]
		if self.check_with_model(value_bdd) == False:
			raise ServerError("FORBIDDEN Corelation with BDD error", status_code=403)
		self.bdd[id_in_bdd] = value_bdd
		debug.warning("    ==> " + str(self.bdd[id_in_bdd]))
		self.mark_to_store()
		"""
		return True
	
	def post(self, _value):
		"""
		debug.info("post " + self.name)
		_value["id"] = self.last_id
		self.last_id += 1
		if self.check_with_model(_value) == False:
			raise ServerError("Corelation with BDD error", status_code=404)
		self.bdd.append(_value)
		self.mark_to_store()
		"""
		return _value
	
	# TODO : rework this
	def find(self, _list_token, _values):
		"""
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
		"""
		pass
	
	def count(self, select = None):
		"""if select == None:
			return len(self.bdd)
		tmp = self.get_sub_list(self.bdd, select)
		return len(tmp)
		"""
		pass
	
	def get_sub_list(self, _values, _select):
		"""
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
				if type(value) == list:
					if token in elem.keys():
						if type_check == "==":
							if not (elem[token] in value):
								find = False
								break
						elif type_check == "!=":
							if not (elem[token] not in value):
								find = False
								break
						else:
							raise ServerError("Internal Server Error: unknow comparing type ...", 500)
					else:
						find = False
						break
				else:
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
		"""
		pass
	
	def order_by(self, _values, _order):
		"""
		if _order == None:
			return _values
		if len(_order) == 0:
			return _values
		value_order = _order[0]
		out = []
		out_unclassable = []
		for elem in _values:
			if value_order not in elem.keys():
				out_unclassable.append(elem);
				continue
			if elem[value_order] == None:
				out_unclassable.append(elem);
				continue
			out.append(elem);
		out = sorted(out, key=lambda x: x[value_order])
		if len(_order) > 1:
			out_unclassable = self.order_by(out_unclassable, _order[1:]);
		for elem in out_unclassable:
			out.append(elem);
		return out;
		"""
		pass
	
	def filter_object_values(self, _values, _filter):
		"""
		out = []
		if _filter == None:
			return _values
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
		"""


