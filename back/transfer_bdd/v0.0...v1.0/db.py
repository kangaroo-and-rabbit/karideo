from realog import debug

import psycopg2

debug.info("connect BDD: ")

conn = psycopg2.connect(dbname="karideo", user="postgres", password="postgres", host="localhost", port="15032")
