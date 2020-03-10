#!/usr/bin/python
# -*- coding: utf-8 -*-
##
## @author Edouard DUPIN
##
## @copyright 2012, Edouard DUPIN, all right reserved
##
## @license MPL v2.0 (see license file)
##
#pip install paho-mqtt --user

import os

def get_rest_config():
	variable = {
			#"tmp_data": "tmp",
			#"data": "data",
			#"data_media": "data/media",
			#"host": os.getenv('REST_HOSTNAME', "0.0.0.0"),
			#"port": int(os.getenv('REST_PORT', 80)),
			"db_host": os.getenv('DB_HOSTNAME', "localhost"),
			"db_port": int(os.getenv('DB_PORT', 15032)),
			"db_name": os.getenv('DB_NAME', "karideo"),
			"db_user": os.getenv('DB_USER', "root"),
			"db_password": os.getenv('DB_PASSWORD', "postgress_password"),
		}
	return variable
