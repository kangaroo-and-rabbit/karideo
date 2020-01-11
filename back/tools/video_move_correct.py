#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2016, Edouard DUPIN, all right reserved
##
## @license APACHE v2.0 (see license file)
##
import os
import fnmatch
import sys
import subprocess
import shlex
import shutil

##
## @brief Execute the command with no get of output
##
def run_command(cmd_line):
	# prepare command line:
	args = shlex.split(cmd_line)
	print("[INFO] cmd = " + str(args))
	try:
		# create the subprocess
		p = subprocess.Popen(args)
	except subprocess.CalledProcessError as e:
		print("[ERROR] subprocess.CalledProcessError : " + str(args))
		return False
	#except:
	#	debug.error("Exception on : " + str(args))
	# launch the subprocess:
	output, err = p.communicate()
	# Check error :
	if p.returncode == 0:
		return True
	else:
		return False


##
## @brief Get list of all Files in a specific path (with a regex)
## @param[in] path (string) Full path of the machine to search files (start with / or x:)
## @param[in] regex (string) Regular expression to search data
## @param[in] recursive (bool) List file with recursive search
## @param[in] remove_path (string) Data to remove in the path
## @return (list) return files requested
##
def get_list_of_file_in_path(path, regex="*", recursive = False, remove_path=""):
	out = []
	if os.path.isdir(os.path.realpath(path)):
		tmp_path = os.path.realpath(path)
		tmp_rule = regex
	else:
		debug.error("path does not exist : '" + str(path) + "'")
	
	for root, dirnames, filenames in os.walk(tmp_path):
		deltaRoot = root[len(tmp_path):]
		while     len(deltaRoot) > 0 \
		      and (    deltaRoot[0] == '/' \
		            or deltaRoot[0] == '\\' ):
			deltaRoot = deltaRoot[1:]
		if     recursive == False \
		   and deltaRoot != "":
			return out
		tmpList = filenames
		if len(tmp_rule) > 0:
			tmpList = fnmatch.filter(filenames, tmp_rule)
		# Import the module :
		for cycleFile in tmpList:
			#for cycleFile in filenames:
			add_file = os.path.join(tmp_path, deltaRoot, cycleFile)
			if len(remove_path) != 0:
				if add_file[:len(remove_path)] != remove_path:
					print("ERROR : Request remove start of a path that is not the same: '" + add_file[:len(remove_path)] + "' demand remove of '" + str(remove_path) + "'")
				else:
					add_file = add_file[len(remove_path)+1:]
			out.append(add_file)
	return out;

def get_run_path():
	return os.getcwd()

src_path = get_run_path()
dst_path = os.path.join(src_path, "..", "zzz_video_push_correct")
list_files_mkv = get_list_of_file_in_path(src_path, "*.mkv", recursive = True)
list_files_webm = get_list_of_file_in_path(src_path, "*.webm", recursive = True)
list_files_jpg = get_list_of_file_in_path(src_path, "*.jpg", recursive = True)
list_files_png = get_list_of_file_in_path(src_path, "*.png", recursive = True)

print("list of elements MKV : ")
for elem in list_files_mkv:
	print("    - '" + str(elem) + "'")
print("list of elements webm : ")
for elem in list_files_webm:
	print("    - '" + str(elem) + "'")

import random
from pymediainfo import MediaInfo

for arg in sys.argv:
	print("arg: " + arg)

id_value = 0
if len(sys.argv) == 2:
	id_value = int(sys.argv[1])



def create_directory_of_file(file):
	path = os.path.dirname(file)
	try:
		os.stat(path)
	except:
		os.makedirs(path)

def file_move(path_src, path_dst):
	#real write of data:
	print("kljlkjlkjklj " + path_src)
	print("kljlkjlkjklj " + path_dst)
	create_directory_of_file(path_dst)
	shutil.move(path_src, path_dst)
	return True


def move_local(list_of_file=[], extention="mkv") :
	global element_error;
	print("Start strancoding: '." + extention + "' ... " + str(len(list_of_file)))
	id_elem = 0
	total_count_of_file = len(list_of_file)
	for elem in list_of_file:
		id_elem += 1
		print("    ========================================================================================")
		print("    == " + str(id_elem) + " / " + str(total_count_of_file))
		print("    == Trancode: '" + elem.replace("'", "\'") + "'")
		print("    ========================================================================================")
		if not os.path.isfile(elem):
			print("        ==> file does not exist")
			continue
		
		# collect media info ...
		#if it is a mk: .. chack the opus format...
		if extention == "mkv":
			media_info = MediaInfo.parse(elem)
			print("media-info: ...   " + str(len(media_info.tracks)))
			need_move_file = True
			for elem_track in media_info.tracks:
				data_print = "[" + str(elem_track.track_id) + "] " + str(elem_track.track_type)
				#print('track_id     = ' + str(elem_track.track_id))
				#print('track_type   = ' + str(elem_track.track_type))
				if elem_track.track_type == "Audio":
					data_print += " (" + str(elem_track.language) + ") enc=" + str(elem_track.format);
					#print('language     = ' + str(elem_track.language))
					#print('format       = ' + str(elem_track.format))
					if elem_track.format != "Opus":
						need_move_file = False
				elif elem_track.track_type == "Video":
					data_print += " enc=" + str(elem_track.format);
					if elem_track.format != "AVC":
						need_move_file = False
				print("    - " + data_print)
				#print("media-info: ..." + str(dir(elem_track)))
			if need_move_file == False:
				print("  ==> Need transcode, NOT already in the good format...")
				continue
		
		file_move(elem, os.path.join(dst_path, elem[len(src_path)+1:]))

move_local(list_files_mkv, "mkv")
move_local(list_files_webm, "webm")
move_local(list_files_jpg, "jpg")
move_local(list_files_png, "png")

