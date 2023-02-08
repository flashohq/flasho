import psycopg2
import os
from psycopg2 import Error
import psycopg2.extras
from fastapi import HTTPException
from dotenv import load_dotenv


def get_cursor():
    load_dotenv()

    connection = {}

    connectionParameters = {
        "user": os.environ.get('PG_USER'),
        "password": os.environ.get('PG_PASSWORD'),
        "host": os.environ.get('PG_HOST'),
        "port": os.environ.get('PG_PORT'),
        "database": os.environ.get('PG_DATABASE')
    }

    print(connectionParameters)

    try:
        connection = psycopg2.connect(**connectionParameters)
        connection.autocommit = True

        cursor = connection.cursor(
            cursor_factory=psycopg2.extras.RealDictCursor)

        return cursor

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL ", error)
        del os.environ['PG_USER'], os.environ['PG_PASSWORD'], os.environ['PG_HOST'], os.environ['PG_PORT'], os.environ['PG_DATABASE']
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'Database error, kindly verify the credentials and try again'
        })


def validate_db_connection():
    if 'PG_USER' not in os.environ:
        raise HTTPException(status_code=400, detail={
            'status': 'failed',
            'message': 'Kindly initialize the database credentials first'
        })
