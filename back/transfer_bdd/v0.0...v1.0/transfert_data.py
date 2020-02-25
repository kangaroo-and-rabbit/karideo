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
import shutil
from dateutil import parser

import db

def file_read_data(path):
	if not os.path.isfile(path):
		return ""
	file = open(path, "r")
	data_file = file.read()
	file.close()
	return data_file



def create_directory_of_file(file):
	debug.info("Create directory of path: '" + file + "'")
	path = os.path.dirname(file)
	debug.info("Create directory: '" + path + "'")
	try:
		os.stat(path)
	except:
		os.makedirs(path)

def file_move(path_src, path_dst):
	#real write of data:
	create_directory_of_file(path_dst)
	shutil.move(path_src, path_dst)
	return True

def transfert_db():
	out = {}
	out[str(None)] = None
	connection = db.connect_bdd();
	
	debug.info("Load old BDD: ")
	
	data = file_read_data('bdd_data.json')
	my_old_bdd = json.loads(data)
	
	debug.info("create the table:")
	
	c = connection.cursor()
	file_object = open("data_transfer.txt", "w")
	file_object2 = open("data_transfer2.txt", "w")
	debug.info("insert elements: ")
	iii = 0;
	for elem in my_old_bdd:
		iii+=1;
		debug.info("[" + str(iii) + "/" + str(len(my_old_bdd)) + "] send new element " + str(elem["id"]))
		id = elem["id"]
		time_create = elem["create_date"];
		mime_type = elem["mime_type"]
		original_name = elem["original_name"]
		sha512 = elem["sha512"]
		size = elem["size"]
		if mime_type == "unknown" and len(original_name) > 3 and original_name[-3:] == "mkv":
			mime_type = "video/x-matroska"
		request_insert = (time_create, sha512, mime_type, size, original_name)
		c.execute('INSERT INTO data (create_date, sha512, mime_type, size, original_name) VALUES (%s,%s,%s,%s,%s) RETURNING id', request_insert)
		id_of_new_row = c.fetchone()[0]
		debug.info("data transform: " + str(id) + " => " + str(id_of_new_row))
		out[str(id)] = id_of_new_row
		file_object.write("mv \"media2/" + str(id_of_new_row) + "/data\" \"media/" + str(id) + "/video\"\n")
		file_object.write("mv \"media2/" + str(id_of_new_row) + "/meta.json\" \"media/" + str(id) + "/meta.json\"\n\n")
		file_object2.write("mv \"media/" + str(id) + "/video\" \"media2/" + str(id_of_new_row) + "/data\"\n")
		file_object2.write("mv \"media/" + str(id) + "/meta.json\" \"media2/" + str(id_of_new_row) + "/meta.json\"\n\n")
		#file_move("media/" + str(id) + "/video", "media2/" + str(id_of_new_row) + "/data")
		#file_move("media/" + str(id) + "/meta.json", "media2/" + str(id_of_new_row) + "/meta.json")
	file_object.close()
	file_object2.close()
	# Save (commit) the changes
	connection.commit()
	
	# We can also close the connection if we are done with it.
	# Just be sure any changes have been committed or they will be lost.
	connection.close()
	
	return out

