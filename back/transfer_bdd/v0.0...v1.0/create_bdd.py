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
data_mapping = {}
print(" =================================================== Send DATA ");
import transfert_data
data_mapping = transfert_data.transfert_db()
print(" =================================================== Send TYPE ");
import transfert_type
type_mapping = transfert_type.transfert_db(data_mapping)
print(" =================================================== Send GROUP ");
import transfert_group
group_mapping = transfert_group.transfert_db(data_mapping, type_mapping)
print(" =================================================== Send SAISON ");
import transfert_saison
saison_mapping = transfert_saison.transfert_db(data_mapping, type_mapping, group_mapping)
##print(" =================================================== Send UNIVERS ");
##import transfert_univers
##univers_mapping = transfert_univers.transfert_db(data_mapping, type_mapping, group_mapping)
print(" =================================================== Send Medias ");
import transfert_video
video_mapping = transfert_video.transfert_db(data_mapping, type_mapping, group_mapping, saison_mapping)

