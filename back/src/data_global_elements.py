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

system_stop = False
system_counter = 0

def save_all():
	global system_counter
	system_counter += 1
	if system_counter <= 10:
		return
	system_counter = 0
	print(time.ctime())
	for elem in interfaces.keys():
		if system_stop == True:
			return
		interfaces[elem].check_save()

def save_all_before_stop():
	global system_stop
	system_stop = True
	for elem in interfaces.keys():
		interfaces[elem].check_save()

def check_save():
	save_all()
	if system_stop == True:
		return
	threading.Timer(1, check_save).start()

check_save()

API_TYPE = "type"
API_UNIVERS = "univers"
API_GROUP = "group"
API_SAISON = "saison"
API_VIDEO = "video"
API_DATA = "data"
API_COVER = "cover_link"

