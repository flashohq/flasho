from fastapi import HTTPException
from pydantic import BaseModel

from app.db import get_cursor, validate_db_connection

GET_TEMPLATES = """ SELECT * FROM tgf_catalog.sms_templates; """


def get_sms_templates():
    validate_db_connection()
    try:
        db_cursor = get_cursor()
        db_cursor.execute(GET_TEMPLATES)

        template_data = db_cursor.fetchall()

        return template_data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'Database error, check if SMS service is initialized'
        })


class SMSTemplate(BaseModel):
    title: str
    service_name: str
    contains_country_code: bool
    country_code_column:  str
    phone_number_column: str
    type: str
    language: str
    message_body: str
    table_type: str


INSERT_TEMPLATE = """
    INSERT INTO tgf_catalog.sms_templates(title, service_name, contains_country_code, country_code_column, phone_number_column, type, language, message_body, table_type)
    VALUES (%(title)s, %(service_name)s, %(contains_country_code)s,%(country_code_column)s, %(phone_number_column)s, %(type)s, %(language)s, %(message_body)s, %(table_type)s)
    RETURNING id; 
"""


def create_sms_template(sms_template: SMSTemplate):
    validate_db_connection()

    try:
        db_cursor = get_cursor()
        db_cursor.execute(
            INSERT_TEMPLATE, vars(sms_template))

        template_id = db_cursor.fetchone()['id']
        return template_id

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'Template names must be unique'
        })
