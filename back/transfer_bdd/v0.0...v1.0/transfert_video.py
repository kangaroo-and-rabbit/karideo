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

def force_number(s):
    if s == None:
        return None;
    try:
        return int(s)
    except ValueError:
        return None

def file_read_data(path):
	if not os.path.isfile(path):
		return ""
	file = open(path, "r")
	data_file = file.read()
	file.close()
	return data_file

def transfert_db(data_mapping, type_mapping, group_mapping, saison_mapping):
	out = {}
	out[str(None)] = None
	connection = db.connect_bdd();
	debug.info("Load old BDD: ")
	
	data = file_read_data('bdd_video.json')
	my_old_bdd = json.loads(data)
	
	debug.info("create the table:")
	
	c = connection.cursor()
	
	
	debug.info("insert elements: ")
	iii = 0;
	for elem in my_old_bdd:
		iii+=1;
		debug.info("[" + str(iii) + "/" + str(len(my_old_bdd)) + "] send new element " + str(elem["id"]))
		id = elem["id"]
		time_create = elem["create_date"];
		name = elem["name"]
		if "description" not in elem.keys():
			description = None
		else:
			description = elem["description"]
		if "covers" not in elem.keys():
			covers = []
		else:
			covers = elem["covers"]
			if covers == None:
				covers = [];
		if "data_id" not in elem.keys():
			data_id = None
		else:
			data_id = elem["data_id"]
		if "type_id" not in elem.keys():
			type_id = None
		else:
			type_id = elem["type_id"]
		if "univers_id" not in elem.keys():
			univers_id = None
		else:
			univers_id = elem["univers_id"]
		if "group_id" not in elem.keys():
			group_id = None
		else:
			group_id = elem["group_id"]
		if "saison_id" not in elem.keys():
			saison_id = None
		else:
			saison_id = elem["saison_id"]
		if "date" not in elem.keys():
			date = None
		else:
			date = elem["date"]
			date = force_number(date)
			if date != None and date < 1850:
				date = None
		if "episode" not in elem.keys():
			episode = None
		else:
			episode = elem["episode"]
		if "time" not in elem.keys():
			time = None
		else:
			time = elem["time"]
		request_insert = (time_create, name, description, data_mapping[str(data_id)], type_mapping[str(type_id)], group_mapping[str(group_id)], saison_mapping[str(saison_id)], force_number(date), force_number(episode), time)
		c.execute('INSERT INTO video (create_date, name, description, data_id, type_id, group_id, saison_id, date, episode, time) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id', request_insert)
		
		id_of_new_row = c.fetchone()[0]
		debug.info("data transform: " + str(id) + " => " + str(id_of_new_row))
		out[str(id)] = id_of_new_row
		connection.commit()
		for elem_cover in covers:
			request_insert = (id_of_new_row, data_mapping[str(elem_cover)])
			print("    insert cover " + str(request_insert))
			c.execute('INSERT INTO cover_link (node_id, data_id) VALUES (%s,%s) RETURNING id', request_insert)
		connection.commit()
	
	# Save (commit) the changes
	connection.commit()
	
	# def dict_factory(cursor, row):
	#     d = {}
	#     for idx, col in enumerate(cursor.description):
	#         d[col[0]] = row[idx]
	#     return d
	
	# conn.row_factory = dict_factory
	# c = conn.cursor()
	# c.execute('SELECT * FROM video WHERE deleted=false')
	# results = c.fetchall()
	# print(results)
	
	# We can also close the connection if we are done with it.
	# Just be sure any changes have been committed or they will be lost.
	connection.close()
	
