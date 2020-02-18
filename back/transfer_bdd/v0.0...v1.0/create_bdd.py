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

import db
connection = db.connect_bdd();

debug.info("create the table:")

c = connection.cursor()

# Create table
c.execute('''
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modify_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
''')
connection.commit()


# Create table
c.execute('''
CREATE TABLE object (
	id SERIAL PRIMARY KEY,
	deleted BOOLEAN NOT NULL DEFAULT false,
	create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	modify_date TIMESTAMPTZ NOT NULL DEFAULT NOW());
''')
connection.commit()

c.execute('''
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON object
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE data(
	sha512 VARCHAR(129) NOT NULL,
	mime_type VARCHAR(50) NOT NULL,
	size BIGINT NOT NULL,
	original_name TEXT
	) INHERITS (object)
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE node (
	name TEXT NOT NULL,
	description TEXT
	) INHERITS (object);
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE cover_link (
	id SERIAL PRIMARY KEY,
	deleted BOOLEAN NOT NULL DEFAULT false,
	node_id INTEGER REFERENCES object(id),
	data_id INTEGER REFERENCES object(id)
	);
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE grp () INHERITS (node);
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE saison (
	group_id INTEGER REFERENCES object(id)
	) INHERITS (node);
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE type () INHERITS (node);
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE univers () INHERITS (node);
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE video (
	data_id INTEGER REFERENCES object(id),
	type_id INTEGER REFERENCES object(id),
	univers_id INTEGER REFERENCES object(id),
	group_id INTEGER REFERENCES object(id),
	saison_id INTEGER REFERENCES object(id),
	episode INTEGER,
	date INTEGER, -- simple date in years of the creation of the media
	time INTEGER -- Time in second of the media
	) INHERITS (node);
''')

# Save (commit) the changes
connection.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
connection.close()

print(" =================================================== Send DATA ");
import transfert_data
print(" =================================================== Send TYPE ");
import transfert_type
print(" =================================================== Send GROUP ");
import transfert_group
print(" =================================================== Send SAISON ");
import transfert_saison
print(" =================================================== Send UNIVERS ");
import transfert_univers
print(" =================================================== Send VIDEO ");
import transfert_video


