#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2019, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##

interfaces = {}

def get_list_interface():
	global interfaces
	return interfaces

def get_interface(_name):
	global interfaces
	return interfaces[_name]

def add_interface(_name, _interface):
	global interfaces
	interfaces[_name] = _interface


import time, threading
def check_save():
	print(time.ctime())
	for elem in interfaces.keys():
		interfaces[elem].check_save()
	threading.Timer(10, check_save).start()

check_save()


API_TYPE = "type"
API_GROUP = "group"
API_SAISON = "saison"
API_VIDEO = "video"
API_DATA = "data"

