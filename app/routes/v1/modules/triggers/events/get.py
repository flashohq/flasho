from app.db import get_cursor

GET_EMAIL_TRIGGERS = """
   SELECT et.id, et.type, et.table_name, et.schema_name, et.name, email.title, email.subject, email.language, et.active
   FROM tgf_catalog.event_triggers et JOIN tgf_catalog.email_templates email
   ON (et.email_template_id = email.id)
"""
GET_SMS_TRIGGERS = """
    SELECT et.id, et.type, et.table_name, et.schema_name, et.name, sms.title, sms.message_body, sms.language, et.active
    FROM tgf_catalog.event_triggers et JOIN tgf_catalog.sms_templates sms
    ON (et.sms_template_id = sms.id)
"""


def get_email_triggers():
    db_cursor = get_cursor()
    db_cursor.execute(GET_EMAIL_TRIGGERS)
    triggers = db_cursor.fetchall()
    triggers = {trigger["id"]: {"id": trigger["id"], "event": trigger["type"], "title": trigger["title"], "table_name": trigger["table_name"], "schema_name": trigger["schema_name"], "name": trigger['name'], "language": trigger["language"],
                                "preview": trigger['subject'], "active": trigger['active']} for trigger in triggers}
    return triggers


def get_sms_triggers():
    db_cursor = get_cursor()
    db_cursor.execute(GET_SMS_TRIGGERS)
    triggers = db_cursor.fetchall()
    triggers = {trigger["id"]: {"id": trigger["id"], "title": trigger["title"], "event": trigger["type"], "table_name": trigger["table_name"], "schema_name": trigger["schema_name"], "name": trigger['name'], "language": trigger['language'],
                                "preview": trigger['message_body'], "active": trigger["active"]} for trigger in triggers}
    return triggers
