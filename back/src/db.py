from realog import debug

import psycopg2


def connect_bdd():
	debug.info("connect BDD: ")
	conn = psycopg2.connect(dbname="karideo", user="root", password="postgress_password", host="localhost", port="15032")
	return conn


base_bdd_name = "karideo_"
