from db import get_cursor
from psycopg2.extras import Json

UPDATE_STATUS = """
    UPDATE tgf_catalog.event_logs
	set status=%(status)s, updated_at=CURRENT_TIMESTAMP
	where id=%(id)s
"""

UPDATE_RESPONSE = """
    UPDATE tgf_catalog.event_logs
	set response=%(response)s, updated_at=CURRENT_TIMESTAMP
	where id=%(id)s
"""


def update_status(event_id, new_status):
    db_cursor = get_cursor()
    db_cursor.execute(UPDATE_STATUS, {
        "id": event_id, "status": new_status
    })


def update_response(event_id, response_data):
    db_cursor = get_cursor()
    db_cursor.execute(UPDATE_RESPONSE, {
        "id": event_id, "response": Json(response_data)
    })
