#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2019, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##
import os
import copy
import sys
import datetime
import hashlib
import requests  # pip install requests
import realog.debug as debug
#import magic
import json
import shutil

debug.enable_color();


def get_run_path():
	return os.getcwd()

folder = get_run_path()
src_path = folder
dst_path = os.path.join(folder, "..", "zzz_video_push_done")

property = {
	#"hostname": "192.168.1.157",
	"hostname": "127.0.0.1",
	"port": 15080,
	"login": None,
	"password": None,
}

def get_base_url():
	return "http://" + property["hostname"] + ":" + str(property["port"]) + "/"


def create_directory_of_file(file):
	path = os.path.dirname(file)
	try:
		os.stat(path)
	except:
		os.makedirs(path)

def file_move(path_src, path_dst):
	#real write of data:
	print("Move file from: " + path_src)
	print("            to: " + path_dst)
	create_directory_of_file(path_dst)
	shutil.move(path_src, path_dst)
	return True


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


class upload_in_chunks(object):
    def __init__(self, filename, chunksize=1 + 13):
        self.filename = filename
        self.chunksize = chunksize
        self.totalsize = os.path.getsize(filename)
        self.start_time = datetime.datetime.utcnow()
        self.performance_time = datetime.datetime.utcnow()
        self.performance_data = 0
        self.readsofar = 0
        self.performance_result = 0

    def __iter__(self):
        with open(self.filename, 'rb') as file:
            while True:
                data = file.read(self.chunksize)
                if not data:
                    sys.stderr.write("\n")
                    break
                self.readsofar += len(data)
                self.performance_data += len(data)
                percent = self.readsofar * 1e2 / self.totalsize
                since_time = datetime.datetime.utcnow() - self.start_time
                delta_time = datetime.datetime.utcnow() - self.performance_time
                if delta_time > datetime.timedelta(seconds=2):
                    delta_seconds = delta_time.total_seconds()
                    self.performance_result = self.performance_data / delta_seconds
                    self.performance_time = datetime.datetime.utcnow()
                    self.performance_data = 0
                #sys.stderr.write("\rSending data: {percent:3.0f}% {size:14.0f} / {total_size}    {timeee}".format(percent=percent, size=self.readsofar, total_size=self.totalsize, timeee=str(since_time)))
                sys.stderr.write("\r        Sending data: {percent:3.0f}% {size} / {total_size}    {timeee}    {speed}/s".format(percent=percent, size=int_to_human(self.readsofar), total_size=int_to_human(self.totalsize), timeee=str(since_time), speed=int_to_human(self.performance_result, True)))
                yield data

    def __len__(self):
        return self.totalsize

#filename = 'Totally_Spies.mp4'
#result = requests.post(get_base_url() + "data", data=upload_in_chunks(filename, chunksize=4096))
#debug.info("result : " + str(result) + "  " + result.text)#str(dir(result)))


def extract_and_remove(_input_value, _start_mark, _stop_mark):
	values = []
	out = ""
	inside = False
	inside_data = ""
	for it in _input_value:
		if     inside == False \
		   and it == _start_mark:
			inside = True
		elif     inside == True \
		     and it == _stop_mark:
			inside = False
			values.append(inside_data)
			inside_data = ""
		elif inside == True:
			inside_data += it
		else:
			out += it
	return (out, values)

def create_directory_of_file(_file):
	path = os.path.dirname(_file)
	try:
		os.stat(path)
	except:
		os.makedirs(path)

##
## @brief Write data in a specific path.
## @param[in] path Path of the data might be written.
## @param[in] data Data To write in the file.
## @param[in] only_if_new (default: False) Write data only if data is different.
## @return True Something has been copied
## @return False Nothing has been copied
##
def file_write_data(_path, _data, _only_if_new=False):
	if _only_if_new == True:
		if os.path.exists(_path) == True:
			old_data = file_read_data(_path)
			if old_data == _data:
				return False
	#real write of data:
	create_directory_of_file(_path)
	file = open(_path, "w")
	file.write(_data)
	file.close()
	return True

def get_modify_time(_path):
	return os.stat(_path).st_mtime

def file_read_data(_path, _binary=False):
	debug.verbose("path= " + _path)
	if not os.path.isfile(_path):
		return ""
	if _binary == True:
		file = open(_path, "rb")
	else:
		file = open(_path, "r")
	data_file = file.read()
	file.close()
	return data_file

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
		sys.stderr.write("\r        Checking data: {percent:3.0f}% {size} / {total_size}".format(percent=percent, size=int_to_human(current), total_size=int_to_human(totalsize)))
	file.close()
	sys.stderr.write("\n")
	return str(sha1.hexdigest())


result_list_types = requests.get(get_base_url() + "type")
debug.info("    List of types *********** : " + str(result_list_types))
#debug.info("         " + str(result_list_types.json()))
result_list_types = result_list_types.json()

def get_type_id(_name):
	for elem in result_list_types:
		if elem["name"] == _name:
			return elem["id"]
	return None

def print_list_of_type():
	print("List of type:")
	for elem in result_list_types:
		print("    - '" + elem["name"] + "'")

def get_list_of_type():
	print("List of type:")
	out = []
	for elem in result_list_types:
		out.append(elem["name"])
	return out

#exit(-1);
nb_file_try_send = 0
nb_file_sended = 0

def push_video_file(_path, _basic_key={}):
	file_name, file_extension = os.path.splitext(_path);
	# internal file_extension ...
	if file_extension == "sha512":
		debug.verbose("    file: '" + _path + "' sha512 extention ...")
		return True
	
	debug.verbose("    Add media : '" + _path + "'")
	# "avi", , "mov", , "ts", "cover_1.tiff", "cover_1.bmp", "cover_1.tga"] copy only file that is supported by the html5 video player (chrome mode only)
	if     file_extension[1:] not in ["webm", "mkv", "mp4"] \
	   and file_name not in ["cover_1.jpg","cover_1.png"]:
		debug.verbose("    Not send file : " + _path + " Not manage file_extension... " + file_extension)
		return False
	
	debug.info("=======================================================================")
	debug.info("Send file: '" + file_name + "'  with extention " + file_extension)
	debug.info("=======================================================================")
	
	if file_name in ["cover_1.jpg","cover_1.png", "cover_1.till", "cover_1.bmp", "cover_1.tga"]:
		# find a cover...
		return True
	global nb_file_try_send
	nb_file_try_send += 1
	
	mime_type = "unknown"
	# do it by myself .. it is better ...
	filename___, file_extension = os.path.splitext(_path)
	if file_extension in ["mkv", ".mkv"]:
		mime_type = "video/x-matroska"
	elif file_extension in ["mka", ".mka"]:
		mime_type = "audio/x-matroska"
	elif file_extension in ["mp4", ".mp4"]:
		mime_type = "video/mp4"
	elif file_extension in ["webm", ".webm"]:
		mime_type = "video/webm"
	elif file_extension in ["json", ".json"]:
		mime_type = "application/json"
	elif file_extension in ["jpeg", ".jpeg", ".JPEG", "JPEG", "jpg", ".jpg", ".JPG", "JPG"]:
		mime_type = "image/jpeg"
	elif file_extension in ["png", ".png"]:
		mime_type = "image/png"
	try:
		_path.encode('latin-1')
		path_send = _path;
	except UnicodeEncodeError:
		path_send = "";
		for elem in _path:
			if elem in "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890_- []{})(:.,;?/\%$&~#'|@=+°*!²":
				path_send += elem
		#debug.warning("    value " + _path)
		#debug.error("  ==> " + path_send)
	headers_values = {
		'filename': path_send,
		'mime-type': mime_type
		}
	debug.info("    Calculate SHA ...")
	local_sha = calculate_sha512(_path)
	debug.info("        ==> sha is " + local_sha)
	result_check_sha = requests.get(get_base_url() + "data/exist/" + local_sha)
	remote_id_data = None
	if result_check_sha.status_code == 200:
		debug.debug("    Find the data : " + str(result_check_sha) + "  " + result_check_sha.text)
		remote_id_data = result_check_sha.json()["id"]
	elif result_check_sha.status_code == 404:
		debug.info("        Did not find the file ... ==> need to send it")
	else:
		debug.warning("        error interface ...")
	if remote_id_data == None:
		result_send_data = requests.post(get_base_url() + "data", headers=headers_values, data=upload_in_chunks(_path, chunksize=4096))
		debug.debug("    result *********** : " + str(result_send_data) + "  " + result_send_data.text)
		remote_id_data = result_send_data.json()["id"]
	if remote_id_data == None:
		debug.warning("    pb in file sending ....");
		return
	
	file_name = os.path.basename(file_name)
	debug.info("    Find file_name : '" + file_name + "'");
	debug.verbose("1111111");
	# Remove Date (XXXX) or other titreadsofarle
	file_name, dates = extract_and_remove(file_name, '(', ')');
	have_date = False
	have_Title = False
	debug.verbose("1111111 2222222 ");
	for it in dates:
		#debug.info("       2222222 ==> 1 " + it);
		if len(it) == 0:
			continue
		#debug.info("       2222222 ==> 2 ");
		if      it[0] == '0' \
		     or it[0] == '1' \
		     or it[0] == '2' \
		     or it[0] == '3' \
		     or it[0] == '4' \
		     or it[0] == '5' \
		     or it[0] == '6' \
		     or it[0] == '7' \
		     or it[0] == '8' \
		     or it[0] == '9':
			#debug.info("       2222222 ==> 3 ");
			# find a date ...
			if have_date == True:
				debug.debug("                '" + file_name + "'")
				debug.error("        Parse Date error : () : " + it + " ==> multiple date")
				continue
			#debug.info("       2222222 ==> 4 ");
			have_date = True
			_basic_key["date"] = it
		else:
			#debug.info("       2222222 ==> 9 ");
			if have_Title == True:
				debug.debug("                '" + file_name + "'")
				debug.error("        Parse Title error : () : " + it + " ==> multiple title")
				continue
			#debug.info("       2222222 ==> 10 ");
			have_Title = True
			# Other title
			_basic_key["title2"] = it;
			#debug.info("       2222222 ==> 11 ");
	
	debug.verbose("1111111 2222222 3333333 ");
	# Remove the actors [XXX YYY][EEE TTT]...
	file_name, actors = extract_and_remove(file_name, '[', ']');
	if len(actors) > 0:
		debug.info("                '" + file_name + "'")
		actor_list = []
		for it_actor in actors:
			if actor_list != "":
				actor_list += ";"
			actor_list.append(it_actor)
		_basic_key["actors"] = actor_list
	list_element_base = file_name.split('-')
	debug.debug("    ==> Title file: " + file_name)
	debug.debug("    ==> Title cut : " + str(list_element_base))
	
	debug.verbose("1111111 2222222 3333333 555555");
	list_element = [];
	tmp_start_string = "";
	iii = 0
	while iii <len(list_element_base):
		if     list_element_base[iii][0] != 's' \
		   and list_element_base[iii][0] != 'e':
			if tmp_start_string != "":
				tmp_start_string += '-'
			tmp_start_string += list_element_base[iii]
		else:
			list_element.append(tmp_start_string)
			tmp_start_string = ""
			while iii<len(list_element_base):
				list_element.append(list_element_base[iii])
				iii += 1
		iii += 1
	
	debug.debug("    ==> start elem: " + str(tmp_start_string))
	
	debug.verbose("1111111 2222222 3333333 555555 666666");
	
	if tmp_start_string != "":
		list_element.append(tmp_start_string)
	
	debug.debug("    ==> list_element : " + str(list_element))
	
	if len(list_element) == 1:
		# nothing to do , it might be a film ...
		_basic_key["title"] = list_element[0]
	else:
		if     len(list_element) > 3 \
		   and list_element[1][0] == 's' \
		   and list_element[2][0] == 'e':
			debug.debug("    Parse format: xxx-sXX-eXX-kjhlkjlkj(1234).*")
			# internal formalisme ...
			saison = -1;
			episode = -1;
			series_name = list_element[0];
			
			_basic_key["series-name"] = series_name
			full_episode_name = list_element[3]
			for yyy in range(4, len(list_element)):
				full_episode_name += "-" + list_element[yyy]
			
			_basic_key["title"] = full_episode_name
			if list_element[1][1:] == "XX":
				# saison unknow ... ==> nothing to do ...
				#saison = 123456789;
				pass
			else:
				try:
					saison = int(list_element[1][1:]);
				finally:
					pass
			
			if list_element[2][1:] == "XX":
				# episode unknow ... ==> nothing to do ...
				pass
			else:
				try:
					episode = int(list_element[2][1:]);
					_basic_key["episode"] = int(episode)
				finally:
					pass
			
			debug.debug("    Find a internal mode series: :");
			debug.debug("        origin       : '" + file_name + "'");
			saisonPrint = "XX";
			episodePrint = "XX";
			if saison < 0:
				# nothing to do
				pass
			else:
				saisonPrint = str(saison)
				_basic_key["saison"] = str(saison)
			
			if episode < 0:
				# nothing to do
				pass
			elif episode < 10:
				episodePrint = "0" + str(episode);
				_basic_key["episode"] = episode
			else:
				episodePrint = str(episode);
				_basic_key["episode"] = episode
			
			debug.info("         ==> '" + series_name + "-s" + saisonPrint + "-e" + episodePrint + "-" + full_episode_name + "'");
		elif     len(list_element) > 2 \
		     and list_element[1][0] == 'e':
			debug.debug("    Parse format: xxx-eXX-kjhlkjlkj(1234).*")
			# internal formalisme ...
			saison = -1;
			episode = -1;
			series_name = list_element[0];
			
			_basic_key["series-name"] = series_name
			full_episode_name = list_element[2]
			for yyy in range(3, len(list_element)):
				full_episode_name += "-" + list_element[yyy]
			
			_basic_key["title"] = full_episode_name
			if list_element[1][1:] == "XX":
				# episode unknow ... ==> nothing to do ...
				pass
			else:
				try:
					episode = int(list_element[1][1:]);
					_basic_key["episode"] = int(episode)
				finally:
					pass
			
			debug.debug("    Find a internal mode series: :");
			debug.debug("        origin       : '" + file_name + "'");
			saisonPrint = "XX";
			episodePrint = "XX";
			if episode < 0:
				# nothing to do
				pass
			elif episode < 10:
				episodePrint = "0" + str(episode);
				_basic_key["episode"] = episode
			else:
				episodePrint = str(episode);
				_basic_key["episode"] = episode
			
			debug.info("         ==> '" + series_name + "-s" + saisonPrint + "-e" + episodePrint + "-" + full_episode_name + "'");
	
	debug.verbose("1111111 2222222 3333333 555555 666666 777777 ");
	
	debug.debug("    pared meta data: " + json.dumps(_basic_key, sort_keys=True, indent=4))
	data_model = {
		"type_id": _basic_key["type"],
		"data_id": remote_id_data,
		#"group_id": int,
		"name": _basic_key["title"],
		# number of second
		"time": None,
	}
	for elem in ["date", "description", "episode"]: #["actors", "date", "description", "episode", "title2"]:
		if elem in _basic_key.keys():
			data_model[elem] = _basic_key[elem]
	
	debug.verbose("1111111 2222222 3333333 555555 666666 777777 888888");
	if "series-name" in _basic_key.keys():
		result_group_data = requests.post(get_base_url() + "group/find", data=json.dumps({"name":_basic_key["series-name"]}, sort_keys=True, indent=4))
		debug.debug("    Create group ??? *********** : " + str(result_group_data) + "  " + result_group_data.text)
		if result_group_data.status_code == 404:
			result_group_data = requests.post(get_base_url() + "group", data=json.dumps({"name":_basic_key["series-name"]}, sort_keys=True, indent=4))
			debug.debug("        yes we create new group *********** : " + str(result_group_data) + "  " + result_group_data.text)
		group_id = result_group_data.json()["id"]
		data_model["serie_id"] = group_id
		if "saison" in _basic_key.keys():
			result_saison_data = requests.post(get_base_url() + "saison/find", data=json.dumps({"name":str(_basic_key["saison"]), "parent_id":group_id}, sort_keys=True, indent=4))
			debug.debug("    Create saison ??? *********** : " + str(result_saison_data) + "  " + result_saison_data.text)
			if result_saison_data.status_code == 404:
				result_saison_data = requests.post(get_base_url() + "saison", data=json.dumps({"name":str(_basic_key["saison"]), "parent_id":group_id}, sort_keys=True, indent=4))
				debug.debug("        yes we create new saison *********** : " + str(result_saison_data) + "  " + result_saison_data.text)
			saison_id = result_saison_data.json()["id"]
			data_model["saison_id"] = saison_id
	
	debug.verbose("1111111 2222222 3333333 555555 666666 777777 888888 999999 ");
	debug.debug("    Send media information")
	result_send_data = requests.post(get_base_url() + "video", data=json.dumps(data_model, sort_keys=True, indent=4))
	debug.verbose("        result: " + str(result_send_data) + "  " + result_send_data.text)
	if result_send_data.status_code == 200:
		debug.info("           ====================================");
		debug.info("           ==             Send OK            ==");
		debug.info("           ====================================");
		global nb_file_sended
		nb_file_sended += 1
	else:
		debug.warning("           ====================================");
		debug.warning("           ==      ERROR sending Media       ==");
		debug.warning("           ====================================");
		return False
	debug.verbose("1111111 2222222 3333333 555555 666666 777777 888888 999999 101010");
	file_move(_path, os.path.join(dst_path, _path[len(src_path)+1:]))
	debug.verbose("1111111 2222222 3333333 555555 666666 777777 888888 999999 101010 111111");
	return True


def install_video_path( _path, _basic_key = {}):
	debug.info("Parse : '" + _path + "'");
	list_sub_path = [fff for fff in os.listdir(_path) if os.path.isdir(os.path.join(_path, fff))]
	list_sub_path.sort()
	for it_path in list_sub_path:
		try:
			basic_key_tmp = copy.deepcopy(_basic_key)
			debug.info("Add Sub path: '" + it_path + "'");
			if len(basic_key_tmp) == 0:
				debug.info("find A '" + it_path + "' " + str(len(basic_key_tmp)));
				basic_key_tmp["type"] = get_type_id(it_path);
				if basic_key_tmp["type"] == None:
					debug.warning("Not supported type: '" + str(it_path) + "' availlable: " + str(get_list_of_type()))
					continue
			else:
				debug.info("find B '" + it_path + "' " + str(len(basic_key_tmp)))
				if it_path == "saison_01":
					basic_key_tmp["saison"] = 1
				elif it_path == "saison_02":
					basic_key_tmp["saison"] = 2
				elif it_path == "saison_03":
					basic_key_tmp["saison"] = 3
				elif it_path == "saison_04":
					basic_key_tmp["saison"] = 4
				elif it_path == "saison_05":
					basic_key_tmp["saison"] = 5
				elif it_path == "saison_06":
					basic_key_tmp["saison"] = 6
				elif it_path == "saison_07":
					basic_key_tmp["saison"] = 7
				elif it_path == "saison_08":
					basic_key_tmp["saison"] = 8
				elif it_path == "saison_09":
					basic_key_tmp["saison"] = 9
				elif it_path == "saison_10":
					basic_key_tmp["saison"] = 10
				elif it_path == "saison_11":
					basic_key_tmp["saison"] = 11
				elif it_path == "saison_12":
					basic_key_tmp["saison"] = 12
				elif it_path == "saison_13":
					basic_key_tmp["saison"] = 13
				elif it_path == "saison_14":
					basic_key_tmp["saison"] = 14
				elif it_path == "saison_15":
					basic_key_tmp["saison"] = 15
				elif it_path == "saison_16":
					basic_key_tmp["saison"] = 16
				elif it_path == "saison_17":
					basic_key_tmp["saison"] = 17
				elif it_path == "saison_18":
					basic_key_tmp["saison"] = 18
				elif it_path == "saison_19":
					basic_key_tmp["saison"] = 19
				elif it_path == "saison_20":
					basic_key_tmp["saison"] = 20
				elif it_path == "saison_21":
					basic_key_tmp["saison"] = 21
				elif it_path == "saison_22":
					basic_key_tmp["saison"] = 22
				elif it_path == "saison_23":
					basic_key_tmp["saison"] = 23
				elif it_path == "saison_24":
					basic_key_tmp["saison"] = 24
				elif it_path == "saison_25":
					basic_key_tmp["saison"] = 25
				elif it_path == "saison_26":
					basic_key_tmp["saison"] = 26
				elif it_path == "saison_27":
					basic_key_tmp["saison"] = 27
				elif it_path == "saison_28":
					basic_key_tmp["saison"] = 28
				elif it_path == "saison_29":
					basic_key_tmp["saison"] = 29
				else:
					basic_key_tmp["series-name"] = it_path
			debug.info("add a path " + os.path.join(_path, it_path) + " with keys " + str(basic_key_tmp))
			install_video_path(os.path.join(_path, it_path), basic_key_tmp);
		except KeyboardInterrupt:
			print('Interrupted')
			try:
				sys.exit(0)
			except SystemExit:
				os._exit(0)
		except UnicodeEncodeError:
			debug.warning("Can not send file.1. " + os.path.join(_path, it_path))
			raise
			continue
		except:
			debug.warning("Can not send file.2. " + os.path.join(_path, it_path))
			#raise
			debug.warning( "get exception:" + str(sys.exc_info()[0]))
			#import traceback
			#traceback.print_stack()
			#continue
			raise
	
	# Add files :
	list_sub_file = [fff for fff in os.listdir(_path) if os.path.isfile(os.path.join(_path, fff))]
	for it_file in list_sub_file:
		basic_key_tmp = copy.deepcopy(_basic_key)
		try:
			push_video_file(os.path.join(_path, it_file), basic_key_tmp);
		except KeyboardInterrupt:
			print('Interrupted')
			try:
				sys.exit(0)
			except SystemExit:
				os._exit(0)
		except UnicodeEncodeError:
			debug.warning("Can not send file.3. " + os.path.join(_path, it_file))
			raise
		"""
		except:
			debug.warning("Can not send file.4. " + os.path.join(_path, it_file))
			#debug.warning( "get exception:" + str(sys.exc_info()[0]))
			#debug.warning("------------------------------")
			#traceback.print_exc(file=sys.stdout)
			#continue
			#raise
		"""




import death.Arguments as arguments
import death.ArgElement as arg_element


my_args = arguments.Arguments()
my_args.add_section("option", "Can be set one time in all case")
my_args.add("h", "help", desc="Display this help")
my_args.add("",  "version", desc="Display the application version")
my_args.add("v", "verbose", list=[
								["0","None"],
								["1","error"],
								["2","warning"],
								["3","info"],
								["4","debug"],
								["5","verbose"],
								["6","extreme_verbose"],
								], desc="display debug level (verbose) default =2")
my_args.add("a", "action", list=[
								["tree","List all the files in a tree view ..."],
								["list","List all the files"],
								["push","push a single file"],
								["push_path","push a full folder"],
								["types","List all the types availlable"],
								], desc="possible action")
my_args.add("c", "color", desc="Display message in color")
my_args.add("f", "folder", haveParam=False, desc="Display the folder instead of the git repository name")
local_argument = my_args.parse()

##
## @brief Display the help of this package.
##
def usage():
	color = debug.get_color_set()
	# generic argument displayed : 
	my_args.display()
	exit(0)

##
## @brief Display the version of this package.
##
def version():
	color = debug.get_color_set()
	import pkg_resources
	debug.info("version: 0.0.0")
	foldername = os.path.dirname(__file__)
	debug.info("source folder is: " + foldername)
	exit(0)

requestAction = "list"

# preparse the argument to get the verbose element for debug mode
def parse_arg(argument):
	debug.warning("parse arg : " + argument.get_option_name() + " " + argument.get_arg())
	if argument.get_option_name() == "help":
		usage()
		return True
	elif argument.get_option_name() == "version":
		version()
		return True
	elif argument.get_option_name() == "verbose":
		debug.set_level(int(argument.get_arg()))
		return True
	elif argument.get_option_name() == "color":
		if check_boolean(argument.get_arg()) == True:
			debug.enable_color()
		else:
			debug.disable_color()
		return True
	elif argument.get_option_name() == "folder":
		folder = argument.get_arg()
		return True
	elif argument.get_option_name() == "action":
		global requestAction
		requestAction = argument.get_arg()
		return True
	return False


# parse default unique argument:
for argument in local_argument:
	parse_arg(argument)

debug.info("==================================");
debug.info("== ZEUS test client start        ==");
debug.info("==================================");


def show_video(elem_video_id, indent):
	indent_data = ""
	while indent > 0:
		indent_data += "\t"
		indent -= 1
	result_video = requests.get(get_base_url() + "video/" + str(elem_video_id) + "")
	if result_video.status_code == 200:
		video = result_video.json()
		debug.info(indent_data + "- " + str(video["generated_name"]))
	else:
		debug.warning(indent_data + "get video id: " + str(elem_video_id) + " !!!!!! " + str(result_video.status_code) + "")

# ****************************************************************************************
# **   Clear All the data base ...
# ****************************************************************************************
if requestAction == "clear":
	debug.info("============================================");
	debug.info("== Clear data base: ");
	debug.info("============================================");
	# TODO : Do it :
	debug.error("NEED to add check in cmd line to execute it ...");
	"""
	uint32_t count = remoteServiceVideo.count().wait().get();
	debug.debug("have " + count + " medias");
	for (uint32_t iii=0; iii<count ; iii += 1024:
		uint32_t tmpMax = etk::min(iii + 1024, count);
		debug.debug("read section " + iii + " -> " + tmpMax);
		etk::Vector<uint32_t> list = remoteServiceVideo.getIds(iii,tmpMax).wait().get();
		zeus::FutureGroup groupWait;
		for (auto& it : list:
			debug.info("remove ELEMENT : " + it);
			groupWait.add(remoteServiceVideo.remove(it));
		groupWait.waitFor(echrono::seconds(2000));
	"""
	debug.info("============================================");
	debug.info("==              DONE                      ==");
	debug.info("============================================");
elif requestAction == "list":
	debug.info("============================================");
	debug.info("== list files: ");
	debug.info("============================================");
	list_types = requests.get(get_base_url() + "type")
	if list_types.status_code != 200:
		debug.warning(" !! ca, ot get type list ... " + str(list_types.status_code) + "")
	for elem in list_types.json():
		debug.info(" get type id: " + str(elem["id"]))
		debug.info("        name: " + str(elem["name"]))
		# get the count of video in this type
		result_count = requests.get(get_base_url() + "type/" + str(elem["id"]) + "/count")
		if result_count.status_code == 200:
			debug.info("        count: " + str(result_count.json()["count"]))
		else:
			debug.warning("        count: !!!!!! " + str(result_count.status_code) + "")
		# get all the video list
		result_video = requests.get(get_base_url() + "type/" + str(elem["id"]) + "/video")
		if result_video.status_code == 200:
			if len(result_video.json()) != 0:
				debug.info("        List video: " + str(result_video.json()))
		else:
			debug.warning("        List video: !!!!!! " + str(result_video.status_code) + "")
		# get list of groups for this type
		result_groups = requests.get(get_base_url() + "type/" + str(elem["id"]) + "/group")
		if result_groups.status_code == 200:
			if len(result_groups.json()) != 0:
				debug.info("        List group: " + str(result_groups.json()))
		else:
			debug.warning("        List group: !!!!!! " + str(result_groups.status_code) + "")
		# get list of video without groups
		result_video_solo = requests.get(get_base_url() + "type/" + str(elem["id"]) + "/video_no_group")
		if result_video_solo.status_code == 200:
			if len(result_video_solo.json()) != 0:
				debug.info("        List video solo: " + str(result_video_solo.json()))
		else:
			debug.warning("        List video solo: !!!!!! " + str(result_video_solo.status_code) + "")
elif requestAction == "tree":
	debug.info("============================================");
	debug.info("== tree files: ");
	debug.info("============================================");
	for elem in result_list_types:
		debug.info("-------------------------------------------------")
		debug.info(" " + str(elem["name"]))
		debug.info("-------------------------------------------------")
		# Does not work anymore...
		"""
		# First get all the groups:
		result_groups = requests.get(get_base_url() + "type/" + str(elem["id"]) + "/group")
		if result_groups.status_code == 200:
			for elem_group_id in result_groups.json():
				result_group = requests.get(get_base_url() + "group/" + str(elem_group_id) + "")
				if result_group.status_code == 200:
					group = result_group.json()
					debug.info("\to- " + str(group["name"]))
					# step 1: all the saison:
					result_saison_in_group = requests.get(get_base_url() + "group/" + str(elem_group_id) + "/saison")
					if result_saison_in_group.status_code == 200:
						for elem_saison_id in result_saison_in_group.json():
							result_saison = requests.get(get_base_url() + "saison/" + str(elem_saison_id) + "")
							if result_saison.status_code == 200:
								debug.info("\t\t* saison " + str(result_saison.json()["name"]))
								result_videos_in_saison = requests.get(get_base_url() + "saison/" + str(result_saison.json()["id"]) + "/video")
								if result_videos_in_saison.status_code == 200:
									for elem_video_id in result_videos_in_saison.json():
										show_video(elem_video_id, 3)
								else:
									debug.warning("\t\tget video in saison id: " + str(elem_saison_id) + " !!!!!! " + str(result_videos_in_saison.status_code) + "")
									show_video(elem_video_id, 2)
							else:
								debug.warning("\t\tget saison id: " + str(elem_saison_id) + " !!!!!! " + str(result_saison.status_code) + "")
					else:
						debug.warning("\t\tget saison in group id: " + str(elem_group_id) + " !!!!!! " + str(result_saison_in_group.status_code) + "")
					# step 2: all the video with no saison:
					result_videos_in_group = requests.get(get_base_url() + "group/" + str(elem_group_id) + "/video_no_saison")
					if result_videos_in_group.status_code == 200:
						for elem_video_id in result_videos_in_group.json():
							show_video(elem_video_id, 2)
					else:
						debug.warning("\t\tget video in group id: " + str(elem_group_id) + " !!!!!! " + str(result_videos_in_group.status_code) + "")
				else:
					debug.warning("\tget group id: " + str(elem_group_id) + " !!!!!! " + str(result_group.status_code) + "")
		else:
			debug.warning("\t\tList group: !!!!!! " + str(result_groups.status_code) + "")
		# get list of video without groups
		result_video_solo = requests.get(get_base_url() + "type/" + str(elem["id"]) + "/video_no_group")
		if result_video_solo.status_code == 200:
			for elem_video_id in result_video_solo.json():
				show_video(elem_video_id, 1)
		else:
			debug.warning("\t\tList video solo: !!!!!! " + str(result_video_solo.status_code) + "")
		"""
	
	debug.info("============================================");
	debug.info("==              DONE                      ==");
	debug.info("============================================");
elif requestAction == "push":
	debug.info("============================================");
	debug.info("== push file: ");
	debug.info("============================================");
	push_video_file(folder);
	debug.info("============================================");
	debug.info("==              DONE                      ==");
	debug.info("============================================");
elif requestAction == "push_path":
	debug.info("============================================");
	debug.info("== push path: ");
	debug.info("============================================");
	install_video_path(folder);
	debug.info(" Send: " + str(nb_file_sended) + " / " + str(nb_file_try_send))
	debug.info("============================================");
	debug.info("==              DONE                      ==");
	debug.info("============================================");
elif requestAction == "types":
	debug.info("============================================");
	debug.info("== Display list of types: ");
	debug.info("============================================");
	print_list_of_type();
	debug.info("============================================");
	debug.info("==              DONE                      ==");
	debug.info("============================================");
else:
	debug.info("============================================");
	debug.error("== Unknow action: '" + requestAction + "'");
	debug.info("============================================");
