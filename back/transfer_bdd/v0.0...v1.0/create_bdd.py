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
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS cover_link;
DROP TABLE IF EXISTS node;
DROP TABLE IF EXISTS data;
DROP TABLE IF EXISTS object;
DROP SEQUENCE IF EXISTS kar_id_sequence;
''');
connection.commit()

c.execute('''
CREATE TYPE node_type AS ENUM ('type', 'univers', 'serie', 'saison', 'media');
CREATE TYPE age_type AS ENUM ('-', '5', '9', '12', '14', '16', '18');
''')
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

c.execute("""
CREATE OR REPLACE FUNCTION check_node_exist(_type character, _id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE vvv int;
DECLARE eee text;
BEGIN
	IF _id IS NULL THEN
		RETURN 1;
	END IF;
	EXECUTE 'select 1 FROM node WHERE type = ''' || quote_ident(_type) || ''' AND id = ' || _id INTO vvv;
	IF vvv = 1 THEN
		RETURN 1;
	ELSE
		RETURN 0;
	END IF;
END;
$$ LANGUAGE plpgsql;
""")
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
	type node_type NOT NULL,
	name TEXT NOT NULL,
	description TEXT,
	parent_id INTEGER CHECK(check_exist('node', parent_id))
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
CREATE TABLE media (
	data_id INTEGER CHECK(check_exist('data', data_id)),
	type_id INTEGER CHECK(check_node_exist('type', type_id)),
	univers_id INTEGER CHECK(check_node_exist('univers', univers_id)),
	serie_id INTEGER CHECK(check_node_exist('serie', serie_id)),
	saison_id INTEGER CHECK(check_node_exist('saison', saison_id)),
	episode INTEGER CHECK(episode >=0),
	date INTEGER CHECK(date > 1850),
	time INTEGER CHECK(time >= 0),
	age_limit age_type NOT NULL DEFAULT '-'
	) INHERITS (node);
COMMENT ON TABLE media IS 'Media Media that is visible.';
COMMENT ON COLUMN media.episode IS 'Number of the episode in the saison sequence.';
COMMENT ON COLUMN media.date IS 'Simple date in years of the creation of the media.';
COMMENT ON COLUMN media.time IS 'Time in second of the media';
COMMENT ON COLUMN media.age_limit IS 'Limitation of the age to show the display ("-" for no limitation)';
''')

# Save (commit) the changes
connection.commit()
c.execute('''
CREATE TRIGGER set_timestamp_media
BEFORE UPDATE ON media
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
''')
connection.commit()


c.execute('''
CREATE VIEW view_data AS
    SELECT id, sha512, mime_type, size
    FROM data
    WHERE deleted = false
    ORDER BY id;
CREATE VIEW view_type AS
    SELECT id, name, description,
    array(
        SELECT data_id
        FROM cover_link
        WHERE cover_link.node_id = node.id
        ) AS covers
    FROM node
    WHERE deleted = false AND type = 'type'
    ORDER BY name;
CREATE VIEW view_univers AS
    SELECT id, name, description,
    array(
        SELECT data_id
        FROM cover_link
        WHERE cover_link.node_id = node.id
        ) AS covers
    FROM node
    WHERE deleted = false AND type = 'univers'
    ORDER BY name;
CREATE VIEW view_serie AS
    SELECT id, name, description,
    array(
        SELECT data_id
        FROM cover_link
        WHERE cover_link.node_id = node.id
        ) AS covers
    FROM node
    WHERE deleted = false AND type = 'serie'
    ORDER BY name;
CREATE VIEW view_saison AS
    SELECT id, name, description, parent_id,
    array(
        SELECT data_id
        FROM cover_link
        WHERE cover_link.node_id = node.id
        ) AS covers
    FROM node
    WHERE deleted = false AND type = 'saison'
    ORDER BY name;
CREATE VIEW view_video AS
    SELECT id, name, description, data_id, type_id, univers_id, serie_id, saison_id, episode, date, time, age_limit,
    array(
        SELECT data_id
        FROM cover_link
        WHERE cover_link.node_id = media.id
        ) AS covers
    FROM media
    WHERE deleted = false AND type = 'media'
    ORDER BY name;
''')
connection.commit()


"""
default_values_type = [
	{
		"id": 0,
		"name": "Documentary",
		"description": "Documentary (annimals, space, earth...)",
		"image": "type_documentary.svg"
	},{
		"id": 1,
		"name": "Movie",
		"description": "Movie with real humans (film)",
		"image": "type_film.svg"
	},{
		"id": 2,
		"name": "Annimation",
		"description": "Annimation movies (film)",
		"image": "type_annimation.svg"
	},{
		"id": 3,
		"name": "Short films",
		"description": "Small movies (less 2 minutes)",
		"image": "type_film-short.svg"
	},{
		"id": 4,
		"name": "TV show",
		"description": "Tv show form old peoples",
		"image": "type_tv-show.svg"
	}, {
		"id": 5,
		"name": "Anniation tv show",
		"description": "Tv show form young peoples",
		"image": "type_tv-show-annimation.svg"
	}, {
		"id": 6,
		"name": "Theater",
		"description": "recorder theater pices",
		"image": "type_theater.svg"
	}, {
		"id": 7,
		"name": "One man show",
		"description": "Recorded stand up",
		"image": "type_one-man-show.svg"
	}, {
		"id": 8,
		"name": "Concert",
		"description": "Recorded concert",
		"image": "type_concert.svg"
	}, {
		"id": 9,
		"name": "Opera",
		"description": "Recorded Opera",
		"image": "type_opera.svg"
	}
]

for elem in default_values_type:
	print("add type: " + elem["name"]);
	request_insert = (elem["name"], elem["description"])
	c.execute('INSERT INTO node (type, name, description) VALUES (\'type\', %s, %s) RETURNING id', request_insert)
	elem["id"] = c.fetchone()[0]
connection.commit()
"""



# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
connection.close()
#exit(0);

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
print(" =================================================== Send Medias ");
import transfert_video
video_mapping = transfert_video.transfert_db(data_mapping, type_mapping, group_mapping, saison_mapping)

