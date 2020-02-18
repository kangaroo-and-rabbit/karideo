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

data = file_read_data('bdd_saison.json')
my_old_bdd = json.loads(data)

debug.info("create the table:")

c = connection.cursor()

debug.info("insert elements: ")
iii = 0;
for elem in my_old_bdd:
	iii+=1;
	debug.info("[" + str(iii) + "/" + str(len(my_old_bdd)) + "] send new element " + str(elem["id"]))
	id = elem["id"]
	name = elem["number"]
	if "group_id" not in elem.keys():
		group_id = None
	else:
		group_id = elem["group_id"]
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
	request_insert = (id, name, description, group_id)
	c.execute('INSERT INTO saison (id, name, description, group_id) VALUES (%s,%s,%s,%s)', request_insert)
	connection.commit()
	for elem_cover in covers:
		request_insert = (id, elem_cover)
		print("    insert cover " + str(request_insert))
		c.execute('INSERT INTO cover_link (node_id, data_id) VALUES (%s,%s)', request_insert)
	connection.commit()

# Save (commit) the changes
connection.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
connection.close()

