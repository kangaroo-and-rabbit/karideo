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

data = file_read_data('bdd_type.json')
my_old_bdd = json.loads(data)

debug.info("create the table:")

c = connection.cursor()

# Create table
c.execute('''
CREATE TABLE type (
	id SERIAL PRIMARY KEY,
	deleted BOOLEAN,
	create_date TIMESTAMPTZ NOT NULL,
	modify_date TIMESTAMPTZ NOT NULL,
	name TEXT NOT NULL,
	description TEXT,
	covers INTEGER[] REFERENCES data(id))
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
	request_insert = (id, name, description, covers)
	c.execute('INSERT INTO type VALUES (%s,false,now,now,%s,%s,%s)', request_insert)

# Save (commit) the changes
connection.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
connection.close()

