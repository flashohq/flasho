from app.db import get_cursor, validate_db_connection

GET_COLUMNS = "SELECT column_name, data_type FROM  information_schema.columns WHERE table_name = '{table}' and table_schema = '{schema}';"


def read_columns(schema, table):
    validate_db_connection()

    db_cursor = get_cursor()

    db_cursor.execute(GET_COLUMNS.format(schema=schema, table=table))

    columns = db_cursor.fetchall()
    print(columns)
    columns = [{"name": column['column_name'],
                "data_type": column['data_type']}for column in columns]

    return columns
