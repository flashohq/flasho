from app.db import get_cursor

GET_TRIGGER_AND_TEMPLATE = """
    SELECT et.id, et.name, et.type, et.table_name, et.schema_name, et.foreign_key_column, et.configuration, et.email_template_id, email.title as email_title, email.service_name as email_service, email.email_column, email.subject, email.user_created, email.body_html, email.body_design, email.language as email_language,email.table_type as email_table_type, et.sms_template_id, sms.title as sms_title, sms.service_name as sms_service, sms.contains_country_code, sms.country_code_column, sms.phone_number_column, sms.type as sms_type, sms.language as sms_language, sms.message_body, sms.table_type as sms_table_type
    FROM tgf_catalog.event_triggers et 
    LEFT JOIN tgf_catalog.email_templates email
    ON (et.email_template_id = email.id)
    LEFT JOIN tgf_catalog.sms_templates sms
    on (et.sms_template_id = sms.id)
    WHERE et.id='{trigger_id}'
"""

GET_TRIGGER_AND_TEMPLATE_EMAIL = """
    SELECT et.id, et.name, et.type, et.table_name, et.schema_name, et.configuration, et.email_template_id, email.title as email_title, email.service_name as email_service, email.email_column, email.subject, email.user_created, email.body_html, email.body_design, email.language as email_language
    FROM tgf_catalog.event_triggers et 
    LEFT JOIN tgf_catalog.email_templates email
    ON (et.email_template_id = email.id)
    WHERE et.id='{trigger_id}'
"""

GET_TRIGGER_AND_TEMPLATE_SMS = """
    SELECT et.id, et.name, et.type, et.table_name, et.schema_name, et.configuration, et.sms_template_id, sms.title as sms_title, sms.service_name as sms_service, sms.contains_country_code, sms.country_code_column, sms.phone_number_column, sms.type as sms_type, sms.language as sms_language, sms.message_body
    FROM tgf_catalog.event_triggers et 
    LEFT JOIN tgf_catalog.sms_templates sms
    on (et.sms_template_id = sms.id)
    WHERE et.id='{trigger_id}'
"""

GET_TRIGGER_BY_NAME = """
    SELECT et.id
    FROM tgf_catalog.event_triggers et 
    WHERE et.name='{trigger_name}'
"""


def get_trigger(trigger_id, type='all'):

    db_cursor = get_cursor()
    if (type == 'all'):
        db_cursor.execute(
            GET_TRIGGER_AND_TEMPLATE.format(trigger_id=trigger_id))
    elif (type == 'email'):
        db_cursor.execute(
            GET_TRIGGER_AND_TEMPLATE_EMAIL.format(trigger_id=trigger_id))
    elif (type == 'sms'):
        db_cursor.execute(
            GET_TRIGGER_AND_TEMPLATE_SMS.format(trigger_id=trigger_id))
    res = db_cursor.fetchone()
    if (type == 'all'):
        return {
            "trigger": {
                "id": res["id"],
                "name": res["name"],
                "event": res["type"],
                "table_name": res["table_name"],
                "schema_name": res["schema_name"],
                "configuration": res["configuration"],
                "foreign_key_column": res["foreign_key_column"],
                "sms_template_id": res["sms_template_id"],
                "email_template_id": res["email_template_id"]
            },
            "email_template": {
                "title": res["email_title"],
                "service_name": res["email_service"],
                "email_column": res["email_column"],
                "subject": res["subject"],
                "user_create": res["user_created"],
                "body_html": res["body_html"],
                "body_design": res["body_design"],
                "language":  res["email_language"],
                "table_type": res["email_table_type"]
            },
            "sms_template": {
                "title": res["sms_title"],
                "service_name": res["sms_service"],

                "contains_country_code": res["contains_country_code"],
                "country_code_column": res["country_code_column"],
                "phone_number_column": res["phone_number_column"],
                "type": res["sms_type"],
                "language": res["sms_language"],
                "table_type": res["sms_table_type"],
                "message_body": res["message_body"]
            }
        }
    else:
        return res


def get_trigger_by_name(trigger_name):
    db_cursor = get_cursor()
    try:
        db_cursor.execute(GET_TRIGGER_BY_NAME.format(
            trigger_name=trigger_name))
    except Exception as e:
        print(e)
        return []
    res = db_cursor.fetchall()
    return res
