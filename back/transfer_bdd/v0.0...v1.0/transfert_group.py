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

data = file_read_data('bdd_group.json')
my_old_bdd = json.loads(data)

debug.info("open new BDD: ")
import sqlite3
conn = sqlite3.connect('bdd_group.db3')

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
	covers TEXT)
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
	new_time = int(datetime.datetime.utcnow().timestamp());
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
	request_insert = (id, new_time, new_time, name, description, list_to_string(covers))
	c.execute('INSERT INTO data VALUES (?,?,?,?,?,?)', request_insert)

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()

