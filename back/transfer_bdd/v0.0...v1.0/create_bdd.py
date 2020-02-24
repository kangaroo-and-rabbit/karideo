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

c.execute('''
DROP TABLE IF EXISTS video;
DROP TABLE IF EXISTS univers;
DROP TABLE IF EXISTS saison;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS grp;
DROP TABLE IF EXISTS cover_link;
DROP TABLE IF EXISTS node;
DROP TABLE IF EXISTS data;
DROP TABLE IF EXISTS object;
DROP SEQUENCE IF EXISTS kar_id_sequence;
''');
connection.commit()


# Create table
c.execute('''
CREATE SEQUENCE kar_id_sequence;
''')
connection.commit()

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

aaa = '''
CREATE OR REPLACE FUNCTION check_exist(_table character, _id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE vvv int;
DECLARE eee text;
BEGIN
	raise WARNING 'check_exist(%,%)%', _table, _id, E'\n';
	IF _id IS NULL THEN
		raise WARNING '    ==> return 1 (detect NULL)%', E'\n';
		RETURN 1;
	END IF;
	eee = 'select 1 FROM ' || quote_ident(_table) || ' WHERE id = ' || _id;
	raise WARNING 'Execute: % %', eee, E'\n';
	EXECUTE 'select 1 FROM ' || quote_ident(_table) || ' WHERE id = ' || _id INTO vvv;
	raise WARNING 'Value vvv: % %', vvv, E'\n';
	IF vvv = 1 THEN
		raise WARNING '    ==> return 1 %', E'\n';
		RETURN 1;
	ELSE
		raise WARNING '    ==> return 0 %', E'\n';
		RETURN 0;
	END IF;
END;
$$ LANGUAGE plpgsql;
'''

c.execute('''
CREATE OR REPLACE FUNCTION check_exist(_table character, _id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE vvv int;
DECLARE eee text;
BEGIN
	IF _id IS NULL THEN
		RETURN 1;
	END IF;
	eee = 'select 1 FROM ' || quote_ident(_table) || ' WHERE id = ' || _id;
	EXECUTE 'select 1 FROM ' || quote_ident(_table) || ' WHERE id = ' || _id INTO vvv;
	IF vvv = 1 THEN
		RETURN 1;
	ELSE
		RETURN 0;
	END IF;
END;
$$ LANGUAGE plpgsql;
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE object (
	id INTEGER PRIMARY KEY default nextval('kar_id_sequence'),
	deleted BOOLEAN NOT NULL DEFAULT false,
	create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	modify_date TIMESTAMPTZ NOT NULL DEFAULT NOW());
COMMENT ON TABLE object IS 'Basic element in this BDD (manage the create and modfy property, the deletion and the unique ID.';
COMMENT ON COLUMN object.id IS 'Unique global ID in the BDD.';
COMMENT ON COLUMN object.deleted IS 'If true the element is dead and must not be shown.';
COMMENT ON COLUMN object.create_date IS 'Creation date of this Object (automatically setup by the BDD).';
COMMENT ON COLUMN object.modify_date IS 'Modify date of this object (automatically updated by the BDD).';
''')

c.execute('''
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON object
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE data (
	sha512 VARCHAR(129) NOT NULL,
	mime_type VARCHAR(128) NOT NULL,
	size BIGINT NOT NULL,
	original_name TEXT
	) INHERITS (object);
COMMENT ON TABLE data IS 'Data basic reference on the big data managed.';
COMMENT ON COLUMN data.sha512 IS 'Unique Sha512 of the file.';
COMMENT ON COLUMN data.mime_type IS 'Type of the object with his mine-type description.';
COMMENT ON COLUMN data.size IS 'Size of the file in Byte.';
COMMENT ON COLUMN data.original_name IS 'Name of the file when upload it in the BDD ==> MUST be remove later.';
''')
connection.commit()

c.execute('''
CREATE TRIGGER set_timestamp_data
BEFORE UPDATE ON data
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE node (
	name TEXT NOT NULL,
	description TEXT
	) INHERITS (object);
COMMENT ON TABLE node IS 'Node is a basic element of what must be hierarchie apears.';
COMMENT ON COLUMN node.name IS 'Name of the Node.';
COMMENT ON COLUMN node.description IS 'Description of the Node.';
''')
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamp_node
BEFORE UPDATE ON node
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE cover_link (
	node_id INTEGER CHECK(check_exist('node', node_id)),
	data_id INTEGER CHECK(check_exist('data', data_id))
	) INHERITS (object);
COMMENT ON TABLE cover_link IS 'Link between cover data id and Nodes.';
''')
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamp_cover_link
BEFORE UPDATE ON cover_link
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE grp () INHERITS (node);
COMMENT ON TABLE grp IS 'Group of the video.';
''')
connection.commit()

c.execute('''
CREATE TRIGGER set_timestamp_grp
BEFORE UPDATE ON grp
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE saison (
	group_id INTEGER CHECK(check_exist('grp', group_id))
	) INHERITS (node);
COMMENT ON TABLE saison IS 'Saison of the video.';
''')
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamps_saison
BEFORE UPDATE ON saison
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE type () INHERITS (node);
COMMENT ON TABLE type IS 'Type of the video.';
''')
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamp_type
BEFORE UPDATE ON type
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE univers () INHERITS (node);
COMMENT ON TABLE univers IS 'Univers of the video.';
''')
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamp_univers
BEFORE UPDATE ON univers
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# Create table
c.execute('''
CREATE TABLE video (
	data_id INTEGER CHECK(check_exist('data', data_id)),
	type_id INTEGER CHECK(check_exist('type', type_id)),
	univers_id INTEGER CHECK(check_exist('univers', univers_id)),
	group_id INTEGER CHECK(check_exist('grp', group_id)),
	saison_id INTEGER CHECK(check_exist('saison', saison_id)),
	episode INTEGER CHECK(episode >=0),
	date INTEGER CHECK(date > 1850),
	time INTEGER CHECK(time >= 0),
	age_limit INTEGER CHECK(age_limit >= 0)
	) INHERITS (node);
COMMENT ON TABLE video IS 'Video Media that is visible.';
COMMENT ON COLUMN video.episode IS 'Number of the episode in the saison sequence.';
COMMENT ON COLUMN video.date IS 'Simple date in years of the creation of the media.';
COMMENT ON COLUMN video.time IS 'Time in second of the media';
COMMENT ON COLUMN video.age_limit IS 'Limitation of the age to show the display';
''')

# Save (commit) the changes
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamp_video
BEFORE UPDATE ON video
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
connection.close()

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
#print(" =================================================== Send UNIVERS ");
#import transfert_univers
#univers_mapping = transfert_univers.transfert_db(data_mapping, type_mapping, group_mapping)
print(" =================================================== Send VIDEO ");
import transfert_video
video_mapping = transfert_video.transfert_db(data_mapping, type_mapping, group_mapping, saison_mapping)

