from app.db import get_cursor
import os
from fastapi.encoders import jsonable_encoder
from psycopg2.extras import Json
from .queries.create_tables import CREATE_TABLE_EVENT_LOGS, CREATE_TABLE_EVENT_TRIGGERS
from .queries.create_functions import CREATE_INSERT_EVENT_LOG_FUNCTION, CREATE_INSERT_TRIGGER_FUNCTION, CREATE_UPDATE_TRIGGER_FUNCTION, CREATE_DELETE_TRIGGER_FUNCTION
from .get_trigger import get_trigger
from dotenv import load_dotenv

CREATE_NOTIFY_FUNCTION = """
    CREATE OR REPLACE FUNCTION tgf_catalog.notify() RETURNS trigger AS
    $BODY$
    BEGIN
        PERFORM pg_notify('insert_event', row_to_json(NEW)::text);
        RETURN new;
    END;
    $BODY$
    LANGUAGE 'plpgsql' VOLATILE COST 100;   
"""

CREATE_NOTIFY_TRIGGER = """
    CREATE TRIGGER event_notify
    AFTER INSERT
    ON tgf_catalog.event_logs
    FOR EACH ROW
    EXECUTE FUNCTION tgf_catalog.notify();
"""

CREATE_TRIGGER = """
    CREATE TRIGGER {trigger_name}
    AFTER {event} ON {schema_name}.{table_name}
    FOR EACH ROW
        EXECUTE FUNCTION tgf_catalog.flasho_{trigger_name}_{event}();
"""

INSERT_EVENT_TRIGGER = """
    INSERT INTO tgf_catalog.event_triggers(
	name, type, schema_name, table_name, primary_key_column, sms_template_id, email_template_id, configuration, comment, foreign_key_column)
	VALUES (%(trigger_name)s, %(event)s, %(schema_name)s, %(table_name)s, %(primary_key_column)s, %(sms_template_id)s, %(email_template_id)s, %(configuration)s,%(comment)s,%(foreign_key_column)s)
    RETURNING id;
"""


def create_manual_trigger(configuration):
    load_dotenv()
    db_cursor = get_cursor()
    db_cursor.execute(CREATE_TABLE_EVENT_TRIGGERS)

    db_cursor.execute(
        INSERT_EVENT_TRIGGER, {
            "trigger_name": configuration.trigger_name, "event": configuration.event, "schema_name": configuration.schema_name, "table_name": configuration.table_name, "primary_key_column": configuration.primary_key_column, "sms_template_id": configuration.sms_template_id, "email_template_id": configuration.email_template_id, "configuration": Json(jsonable_encoder(configuration.configuration)), "comment": '', "foreign_key_column": configuration.foreign_key_column
        }
    )
    trigger_id = db_cursor.fetchone()['id']

    type = ''

    if (configuration.sms_template_id is None):
        type = 'email'
    elif (configuration.email_template_id is None):
        type = 'sms'

    return get_trigger(trigger_id, type)


def create_trigger(configuration):
    if (configuration.event == 'MANUAL'):
        return create_manual_trigger(configuration=configuration)
    load_dotenv()
    db_cursor = get_cursor()

    database = os.environ.get('PG_DATABASE')

    db_cursor.execute(CREATE_TABLE_EVENT_TRIGGERS)
    db_cursor.execute(CREATE_TABLE_EVENT_LOGS)
    db_cursor.execute(CREATE_NOTIFY_FUNCTION)
    try:
        db_cursor.execute(CREATE_NOTIFY_TRIGGER)
    except Exception as e:
        print(e)
    db_cursor.execute(
        CREATE_INSERT_EVENT_LOG_FUNCTION.format(database=database))

    if configuration.event == 'UPDATE':
        db_cursor.execute(
            CREATE_UPDATE_TRIGGER_FUNCTION.format(
                database=database, trigger_name=configuration.trigger_name, event=configuration.event)
        )
    elif configuration.event == 'INSERT':
        db_cursor.execute(
            CREATE_INSERT_TRIGGER_FUNCTION.format(
                database=database, trigger_name=configuration.trigger_name, event=configuration.event)
        )
    else:
        db_cursor.execute(
            CREATE_DELETE_TRIGGER_FUNCTION.format(
                database=database, trigger_name=configuration.trigger_name, event=configuration.event)
        )

    db_cursor.execute(
        INSERT_EVENT_TRIGGER, {
            "trigger_name": configuration.trigger_name, "event": configuration.event, "schema_name": configuration.schema_name, "table_name": configuration.table_name, "primary_key_column": configuration.primary_key_column, "sms_template_id": configuration.sms_template_id, "email_template_id": configuration.email_template_id, "configuration": Json(jsonable_encoder(configuration.configuration)), "comment": '', "foreign_key_column": configuration.foreign_key_column
        }
    )
    trigger_id = db_cursor.fetchone()['id']

    db_cursor.execute(
        CREATE_TRIGGER.format(
            trigger_name=configuration.trigger_name, event=configuration.event, schema_name=configuration.schema_name, table_name=configuration.table_name
        )
    )
    type = ''

    if (configuration.sms_template_id is None):
        type = 'email'
    elif (configuration.email_template_id is None):
        type = 'sms'

    return get_trigger(trigger_id, type)
