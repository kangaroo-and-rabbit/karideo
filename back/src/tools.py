#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2012, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##

import os
import shutil
import errno
import fnmatch
import stat
# Local import
from realog import debug

"""
	
"""
def get_run_path():
	return os.getcwd()

"""
	
"""
def get_current_path(file):
	return os.path.dirname(os.path.realpath(file))

def create_directory_of_file(file):
	debug.info("Create directory of path: '" + file + "'")
	path = os.path.dirname(file)
	debug.info("Create directory: '" + path + "'")
	try:
		os.stat(path)
	except:
		os.makedirs(path)

def get_list_sub_path(path):
	# TODO : os.listdir(path)
	for dirname, dirnames, filenames in os.walk(path):
		return dirnames
	return []

def remove_path_and_sub_path(path):
	if os.path.isdir(path):
		debug.verbose("remove path : '" + path + "'")
		shutil.rmtree(path)

def remove_file(path):
	if os.path.isfile(path):
		os.remove(path)
	elif os.path.islink(path):
		os.remove(path)

def exist(path):
	if os.path.isdir(path):
		return True
	if os.path.isfile(path):
		return True
	if os.path.islink(path):
		return True
	return False

def file_size(path):
	if not os.path.isfile(path):
		return 0
	statinfo = os.stat(path)
	return statinfo.st_size

def file_read_data(path, binary=False):
	debug.verbose("path= " + path)
	if not os.path.isfile(path):
		return ""
	if binary == True:
		file = open(path, "rb")
	else:
		file = open(path, "r")
	data_file = file.read()
	file.close()
	return data_file

def version_to_string(version):
	version_ID = ""
	for id in version:
		if len(version_ID) != 0:
			if type(id) == str:
				version_ID += "-"
			else:
				version_ID += "."
		version_ID += str(id)
	return version_ID

##
## @brief Write data in a specific path.
## @param[in] path Path of the data might be written.
## @param[in] data Data To write in the file.
## @param[in] only_if_new (default: False) Write data only if data is different.
## @return True Something has been copied
## @return False Nothing has been copied
##
def file_write_data(path, data, only_if_new=False):
	if only_if_new == True:
		if os.path.exists(path) == True:
			old_data = file_read_data(path)
			if old_data == data:
				return False
	#real write of data:
	create_directory_of_file(path)
	file = open(path, "w")
	file.write(data)
	file.close()
	return True

def file_write_data_safe(path, data):
	#real write of data:
	create_directory_of_file(path)
	file = open(path + ".tmp", "w")
	file.write(data)
	file.close()
	shutil.move(path + ".tmp", path)
	return True


def file_move(path_src, path_dst):
	create_directory_of_file(path_dst)
	shutil.move(path_src, path_dst)
	return True

def file_copy(path_src, path_dst):
	create_directory_of_file(path_dst)
	shutil.copyfile(path_src, path_dst)
	return True


def list_to_str(list):
	if type(list) == type(str()):
		return list + " "
	else:
		result = ""
		# mulyiple imput in the list ...
		for elem in list:
			result += list_to_str(elem)
		return result

import hashlib

def str_limit_4(_data):
	data = str(_data)
	if len(data) >= 4:
		return data
	if len(data) == 3:
		return " " + data
	if len(data) == 2:
		return "  " + data
	return "   " + data

def int_to_human(_data, _bigger = False):
	tera = int(_data/(1024*1024*1024*1024))%1024
	giga = int(_data/(1024*1024*1024))%1024
	mega = int(_data/(1024*1024))%1024
	kilo = int(_data/(1024))%1024
	byte = int(_data)%1024
	
	tera_str = str_limit_4(tera)
	giga_str = str_limit_4(giga)
	mega_str = str_limit_4(mega)
	kilo_str = str_limit_4(kilo)
	byte_str = str_limit_4(byte)
	out = ""
	if tera != 0:
		out += tera_str + "T"
		if _bigger == True:
			return out
	if giga != 0 or len(out) != 0:
		out += giga_str + "G"
		if _bigger == True:
			return out
	if mega != 0 or len(out) != 0:
		out += mega_str + "M"
		if _bigger == True:
			return out
	if kilo != 0 or len(out) != 0:
		out += kilo_str + "k"
		if _bigger == True:
			return out
	out += byte_str + "B"
	return out

def calculate_sha512(_path):
	sha1 = hashlib.sha512()
	file = open(_path, "rb")
	totalsize = os.path.getsize(_path)
	current = 0
	while True:
		body = file.read(10*1024*1024)
		if len(body) == 0:
			break;
		current += len(body)
		sha1.update(body)
		percent = current/totalsize*100
		debug.debug("\r        Checking data: {percent:3.0f}% {size} / {total_size}".format(percent=percent, size=int_to_human(current), total_size=int_to_human(totalsize)))
	file.close()
	return str(sha1.hexdigest())