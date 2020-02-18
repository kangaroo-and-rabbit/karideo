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
connection = db.connect_bdd();


def file_read_data(path):
	if not os.path.isfile(path):
		return ""
	file = open(path, "r")
	data_file = file.read()
	file.close()
	return data_file

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
	if "episode" not in elem.keys():
		episode = None
	else:
		episode = elem["episode"]
	if "time" not in elem.keys():
		time = None
	else:
		time = elem["time"]
	request_insert = (id, time_create, name, description, data_id, type_id, univers_id, group_id, saison_id, date, episode, time)
	c.execute('INSERT INTO video (id, create_date, name, description, data_id, type_id, univers_id, group_id, saison_id, date, episode, time) VALUES (%s,false,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', request_insert)
	
	connection.commit()
	for elem_cover in covers:
		request_insert = (id, elem_cover)
		print("    insert cover " + str(request_insert))
		c.execute('INSERT INTO cover_link (node_id, data_id) VALUES (%s,%s)', request_insert)
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

