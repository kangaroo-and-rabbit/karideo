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
			"tmp_data": "tmp",
			"data": "data",
			"data_media": "data/media",
			"host": os.getenv('REST_HOSTNAME', "0.0.0.0"),
			"port": int(os.getenv('REST_PORT', 80)),
		}
	return variable

