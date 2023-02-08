from app.db import get_cursor
from fastapi.encoders import jsonable_encoder
from psycopg2.extras import Json
from .get_trigger import get_trigger

ENABLE_TRIGGER = """
    ALTER TABLE {table_name}
    ENABLE TRIGGER {trigger_name};
"""

DISABLE_TRIGGER = """
    ALTER TABLE {table_name}
    DISABLE TRIGGER {trigger_name};
"""

UPDATE_TRIGGER_STATE = """
    UPDATE tgf_catalog.event_triggers 
    SET active = {state}
    WHERE id = {id}
"""

UPDATE_TRIGGER = """
    UPDATE tgf_catalog.event_triggers 
    SET primary_key_column =  %(primary_key_column)s, sms_template_id = %(sms_template_id)s, email_template_id =  %(email_template_id)s, configuration = %(configuration)s, comment =%(comment)s
    WHERE id = %(id)s
"""

UPDATE_SMS_TEMPLATE = """
    UPDATE tgf_catalog.sms_templates 
    SET title = %(title)s, service_name = %(service_name)s , schema_name =  %(schema_name)s, table_name = %(table_name)s, 
        contains_country_code = %(contains_country_code)s, country_code_column = %(country_code_column)s, phone_number_column = %(phone_number_column)s, type = %(type)s, language =  %(language)s, message_body=  %(message_body)s
    WHERE id = %(id)s   
"""

UPDATE_EMAIL_TEMPLATE = """
    UPDATE tgf_catalog.email_templates
    SET title = %(title)s, service_name = %(service_name)s , schema_name =  %(schema_name)s , table_name = %(table_name)s, email_column = %(email_column)s, language = %(language)s, subject = %(subject)s, body_html = %(body_html)s, body_design = %(body_design)s
    WHERE id = %(id)s 
"""


def enable_trigger(trigger_name, id, event, table_name):
    db_cursor = get_cursor()
    if (event != "MANUAL"):
        db_cursor.execute(ENABLE_TRIGGER.format(
            trigger_name=trigger_name, table_name=table_name))

    db_cursor.execute(UPDATE_TRIGGER_STATE.format(state=True, id=id))


def disable_trigger(trigger_name, id, event, table_name):
    db_cursor = get_cursor()
    if (event != "MANUAL"):
        db_cursor.execute(DISABLE_TRIGGER.format(
            trigger_name=trigger_name, table_name=table_name))

    db_cursor.execute(UPDATE_TRIGGER_STATE.format(state=False, id=id))


def update_trigger(id, configuration):

    db_cursor = get_cursor()

    db_cursor.execute(UPDATE_TRIGGER, {
        "id": id, "primary_key_column": configuration.primary_key_column, "sms_template_id": configuration.sms_template_id, "email_template_id": configuration.email_template_id, "configuration": Json(jsonable_encoder(configuration.configuration)), "comment": '', "id": id
    })

    if (configuration.email_template_id is None):
        db_cursor.execute(UPDATE_SMS_TEMPLATE, {
            "id": configuration.sms_template_id, "title": configuration.title, "service_name": configuration.sms_service, "schema_name": configuration.schema_name, "table_name": configuration.table_name,
            "contains_country_code": configuration.contains_country_code, "country_code_column": configuration.country_code_column, "phone_number_column": configuration.phone_number_column, "type": configuration.sms_type, "language": configuration.language, "message_body": configuration.message_body
        })
    else:
        db_cursor.execute(UPDATE_EMAIL_TEMPLATE, {
            "id": configuration.email_template_id, "title": configuration.title, "service_name": configuration.email_service, "schema_name": configuration.schema_name, "table_name": configuration.table_name,
            "email_column": configuration.email_column, "language": configuration.language, "subject": configuration.subject, "body_html": configuration.body_html, "body_design": Json(jsonable_encoder(configuration.body_design))
        })

    return get_trigger(id)
