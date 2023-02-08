from fastapi import HTTPException
from app.db import get_cursor
from psycopg2 import sql

DELETE_TRIGGER = """
   DROP TRIGGER {trigger_name}
   ON {table_name};
"""

GET_TRIGGER = """
    SELECT * from tgf_catalog.event_triggers
    WHERE id = {id}
"""

DELETE_TRIGGER_FUNCTION = """
    DROP FUNCTION tgf_catalog.{function_name}
    CASCADE
"""

DELETE_TRIGGER_ENTRY = """
    DELETE FROM tgf_catalog.event_triggers
    WHERE id = {id}
"""

DELETE_TEMPLATE_ENTRY = """
    DELETE FROM tgf_catalog.{template_type}
    WHERE id = {id}
"""


def delete_trigger(id):
    try:
        db_cursor = get_cursor()

        db_cursor.execute(GET_TRIGGER.format(id=id))

        triggers = db_cursor.fetchall()

        trigger = [{"table_name": trigger["table_name"], "name": trigger['name'], "type": trigger["type"],
                    "sms_template_id": trigger["sms_template_id"], "email_template_id": trigger["email_template_id"]} for trigger in triggers][0]

        if (trigger["type"] != "MANUAL"):
            db_cursor.execute(DELETE_TRIGGER.format(
                trigger_name=trigger["name"], table_name=trigger["table_name"]))

            function_name = "flasho_{trigger_name}_{trigger_type}".format(
                trigger_name=trigger["name"], trigger_type=trigger["type"])
            function_name = function_name.lower()

            query = sql.SQL(DELETE_TRIGGER_FUNCTION).format(
                function_name=sql.Identifier(function_name))

            db_cursor.execute(query)

        db_cursor.execute(DELETE_TRIGGER_ENTRY.format(id=id))

        if (trigger["sms_template_id"] is not None):
            db_cursor.execute(DELETE_TEMPLATE_ENTRY.format(
                template_type="sms_templates", id=trigger["sms_template_id"]))
        else:
            db_cursor.execute(DELETE_TEMPLATE_ENTRY.format(
                template_type="email_templates", id=trigger["email_template_id"]))

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail={"status": "failed", "message": "delete error"}
        )
