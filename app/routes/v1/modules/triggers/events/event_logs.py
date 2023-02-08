from app.db import get_cursor

GET_SMS_LOGS_DATA = """
    SELECT el.*
    FROM tgf_catalog.event_logs el
    JOIN tgf_catalog.event_triggers et 
    ON el.trigger_name = et.name
    WHERE et.sms_template_id IS NOT NULL
    ORDER BY el.updated_at DESC
    LIMIT %(limit)s
    OFFSET %(offset)s
"""

GET_EMAIL_LOGS_DATA = """
    SELECT el.*
    FROM tgf_catalog.event_logs el
    JOIN tgf_catalog.event_triggers et 
    ON el.trigger_name = et.name
    WHERE et.email_template_id IS NOT NULL
    ORDER BY el.updated_at DESC
    LIMIT %(limit)s
    OFFSET %(offset)s
"""


def get_logs_data(trigger_type: str, limit: int, offset: int):
    db_cursor = get_cursor()
    if trigger_type == "sms":
        db_cursor.execute(GET_SMS_LOGS_DATA, {
                          "limit": limit, "offset": offset})
    else:
        db_cursor.execute(GET_EMAIL_LOGS_DATA, {
                          "limit": limit, "offset": offset})
    res = db_cursor.fetchall()
    return res


GET_SMS_LOGS_COUNT = """
    SELECT count(*) 
    FROM tgf_catalog.event_logs el
    JOIN tgf_catalog.event_triggers et 
    ON el.trigger_name = et.name
    WHERE et.sms_template_id IS NOT NULL
"""

GET_EMAIL_LOGS_COUNT = """
    SELECT count(*) 
    FROM tgf_catalog.event_logs el
    JOIN tgf_catalog.event_triggers et 
    ON el.trigger_name = et.name
    WHERE et.email_template_id IS NOT NULL
"""


def get_logs_count(trigger_type: str):
    db_cursor = get_cursor()
    if trigger_type == "sms":
        db_cursor.execute(GET_SMS_LOGS_COUNT)
    else:
        db_cursor.execute(GET_EMAIL_LOGS_COUNT)
    res = db_cursor.fetchone()
    return {
        "count": res["count"]
    }
