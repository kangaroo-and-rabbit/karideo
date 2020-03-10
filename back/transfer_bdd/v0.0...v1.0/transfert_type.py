#!/usr/bin/python3
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2012, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##
#pip install paho-mqtt --user

from realog import debug
import json
import os
import random
import copy
from dateutil import parser
import datetime

import db


def file_read_data(path):
	if not os.path.isfile(path):
		return ""
	file = open(path, "r")
	data_file = file.read()
	file.close()
	return data_file

def transfert_db(data_mapping):
	out = {}
	out[str(None)] = None
	connection = db.connect_bdd();
	debug.info("Load old BDD: ")
	
	data = file_read_data('bdd_type.json')
	my_old_bdd = json.loads(data)
	
	debug.info("create the table:")
	
	c = connection.cursor()
	
	debug.info("insert elements: ")
	iii = 0;
	for elem in my_old_bdd:
		iii+=1;
		debug.info("[" + str(iii) + "/" + str(len(my_old_bdd)) + "]         ???           Get element " + str(elem["id"]) + " with name: '" + elem["name"] + "'")
		id = elem["id"]
		name = elem["name"]
		if name == 'Short Films':
			name = 'Short movie'
		if name == 'tv show':
			name = 'TV show'
		if name == 'Anniation tv show':
			name = 'Anniation TV show'
		request_insert = (name,)
		c.execute("SELECT id FROM node WHERE type = 'type' AND name = %s LIMIT 1", request_insert)
		id_of_new_row = c.fetchone()[0]
		debug.info("data transform: " + str(id) + " => " + str(id_of_new_row))
		out[str(id)] = id_of_new_row
	
	# Save (commit) the changes
	connection.commit()
	
	# We can also close the connection if we are done with it.
	# Just be sure any changes have been committed or they will be lost.
	connection.close()
	return out
	
