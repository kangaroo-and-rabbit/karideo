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

debug.info("open new BDD: ")
import sqlite3
conn = sqlite3.connect('bdd_video.db3')

debug.info("create the table:")

c = conn.cursor()

# Create table
c.execute('''
CREATE TABLE data (
	id INTEGER PRIMARY KEY ,
	create_date INTEGER NOT NULL,
	modify_date INTEGER NOT NULL,
	name TEXT NOT NULL,
	description TEXT,
	covers TEXT,
	data_id INTEGER,
	type_id INTEGER,
	univers_id INTEGER,
	group_id INTEGER,
	saison_id INTEGER,
	date INTEGER,
	episode INTEGER,
	time INTEGER)
''')

def list_to_string(data):
	out = "";
	for elem in data:
		if out != "":
			out += "/"
		out +=str(elem)
	return out

#sqlite3 bdd_group.db3 "SELECT * from data"

debug.info("insert elements: ")
iii = 0;
for elem in my_old_bdd:
	iii+=1;
	debug.info("[" + str(iii) + "/" + str(len(my_old_bdd)) + "] send new element")
	id = elem["id"]
	time = elem["create_date"].replace("Z","").replace("H"," ");
	tmp_time = parser.parse(time)
	debug.info("    => " + str(tmp_time) + "    from    " + elem["create_date"])
	new_time = int(tmp_time.timestamp())
	modify_time = int(datetime.datetime.utcnow().timestamp());
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
	request_insert = (id, new_time, modify_time, name, description, list_to_string(covers), data_id, type_id, univers_id, group_id, saison_id, date, episode, time)
	c.execute('INSERT INTO data VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', request_insert)

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()

