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

debug.info("open new BDD: ")
import sqlite3
conn = sqlite3.connect('bdd_data.db3')

debug.info("create the table:")

c = conn.cursor()

# Create table
c.execute('''
CREATE TABLE data(
	id INTEGER PRIMARY KEY ,
	sha512 TEXT NOT NULL,
	mime_type TEXT NOT NULL,
	size INTEGER NOT NULL,
	create_date INTEGER NOT NULL,
	original_name TEXT)
''')

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
	mime_type = elem["mime_type"]
	original_name = elem["original_name"]
	sha512 = elem["sha512"]
	size = elem["size"]
	request_insert = (id, sha512, mime_type, size, new_time, original_name)
	c.execute('INSERT INTO data VALUES (?,?,?,?,?,?)', request_insert)

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()

