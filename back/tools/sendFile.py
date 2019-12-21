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
import sys
import requests  # pip install requests

class upload_in_chunks(object):
    def __init__(self, filename, chunksize=1 << 13):
        self.filename = filename
        self.chunksize = chunksize
        self.totalsize = os.path.getsize(filename)
        self.readsofar = 0

    def __iter__(self):
        with open(self.filename, 'rb') as file:
            while True:
                data = file.read(self.chunksize)
                if not data:
                    sys.stderr.write("\n")
                    break
                self.readsofar += len(data)
                percent = self.readsofar * 1e2 / self.totalsize
                sys.stderr.write("\rSendfing data: {percent:3.0f}% {size:14.0f} / {total_size}".format(percent=percent, size=self.readsofar, total_size=self.totalsize))
                yield data

    def __len__(self):
        return self.totalsize

filename = 'Totally_Spies.mp4'

result = requests.post("http://127.0.0.1:15080/data", data=upload_in_chunks(filename, chunksize=4096))


print("result : " + str(result) + "  " + result.text)#str(dir(result)))

