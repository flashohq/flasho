from app.db import get_cursor, validate_db_connection

GET_SCHEMAS = "SELECT schema_name FROM information_schema.schemata"


def read_schemas():
    validate_db_connection()

    db_cursor = get_cursor()

    db_cursor.execute(GET_SCHEMAS)

    schemas = db_cursor.fetchall()

    schemas = [schema['schema_name'] for schema in schemas]

    return schemas
