from realog import debug

import psycopg2

connection = None
connection_count = 0
def connect_bdd():
	global connection
	global connection_count
	if connection == None:
		debug.info("connect BDD: ")
		connection = psycopg2.connect(dbname="karideo", user="root", password="postgress_password", host="localhost", port="15032")
	connection_count += 1
	return connection

def remove_connection():
	global connection
	global connection_count
	connection_count -= 1
	if connection_count < 0:
		debug.warning("Request remove too much time the BDD connection");
		connection_count = 0;
		return;
	if connection_count == 0:
		debug.warning("dicconnect BDD");
		connection.commit()
		connection.close()
		connection = None
		return;
	

base_bdd_name = "karideo_"
