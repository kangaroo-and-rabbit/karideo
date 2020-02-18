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

data = file_read_data('bdd_data.json')
my_old_bdd = json.loads(data)

debug.info("create the table:")

c = connection.cursor()

# Create table
c.execute('''
CREATE TABLE data(
	id SERIAL PRIMARY KEY,
	deleted BOOLEAN,
	create_date TIMESTAMPTZ NOT NULL,
	modify_date TIMESTAMPTZ NOT NULL,
	sha512 TEXT NOT NULL,
	mime_type TEXT NOT NULL,
	size BIGINT NOT NULL,
	original_name TEXT)
''')

debug.info("insert elements: ")
iii = 0;
for elem in my_old_bdd:
	iii+=1;
	debug.info("[" + str(iii) + "/" + str(len(my_old_bdd)) + "] send new element")
	id = elem["id"]
	time_create = elem["create_date"];
	mime_type = elem["mime_type"]
	original_name = elem["original_name"]
	sha512 = elem["sha512"]
	size = elem["size"]
	request_insert = (id, time_create, sha512, mime_type, size, original_name)
	c.execute('INSERT INTO data VALUES (%s,false,%s,CURRENT_TIMESTAMP,%s,%s,%s,%s)', request_insert)

# Save (commit) the changes
connection.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
connection.close()

