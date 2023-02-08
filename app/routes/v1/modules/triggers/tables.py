from app.db import get_cursor, validate_db_connection

GET_TABLES = "SELECT table_name FROM information_schema.tables WHERE(table_schema = '{schema}' AND table_type = 'BASE TABLE') ORDER BY table_schema, table_name;"


def read_tables(schema):
    validate_db_connection()

    db_cursor = get_cursor()

    db_cursor.execute(GET_TABLES.format(schema=schema))

    tables = db_cursor.fetchall()

    tables = [table['table_name'] for table in tables]

    return tables
