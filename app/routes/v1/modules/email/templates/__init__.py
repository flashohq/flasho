from pydantic import BaseModel
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from psycopg2.extras import Json

from app.db import get_cursor, validate_db_connection
from app.routes.v1.modules import email


GET_DEFAULT_TEMPLATES = """ SELECT * FROM tgf_catalog.email_templates
                            WHERE user_created=false; """
GET_CREATED_TEMPLATES = """ SELECT * FROM tgf_catalog.email_templates
                            WHERE user_created=true; """
GET_ALL_TEMPLATES = """ SELECT * FROM tgf_catalog.email_templates; """


def get_default_templates():
    db_cursor = get_cursor()
    db_cursor.execute(GET_DEFAULT_TEMPLATES)

    template_data = db_cursor.fetchall()

    return template_data


def get_created_templates():
    db_cursor = get_cursor()
    db_cursor.execute(GET_CREATED_TEMPLATES)

    template_data = db_cursor.fetchall()

    return template_data


def get_email_templates(template_type: str):
    validate_db_connection()
    try:
        if template_type == "default":
            return get_default_templates()
        elif template_type == "created":
            return get_created_templates()
        else:
            return {"default_templates": get_default_templates(), "user_created_templates": get_created_templates()}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'Database error, check if email service is initialized'
        })


INSERT_TEMPLATE = """
    INSERT INTO tgf_catalog.email_templates(title, service_name, email_column, language, subject, user_created, body_html, body_design, table_type)
    VALUES (%(title)s, %(service_name)s, %(email_column)s, %(language)s, %(subject)s, %(user_created)s, %(body_html)s, %(body_design)s, %(table_type)s)
    RETURNING id;
"""


class EmailTemplate(BaseModel):
    title: str
    service_name: str
    email_column: str
    language: str
    subject: str
    user_created: bool
    body_html: str
    body_design: dict
    table_type: str


def create_email_template(email_template: EmailTemplate):
    # try:
    #     print(emailTemplate.bodyHTML.decode("UTF-8"))
    #     return
    # except Exception as e:
    #     print(e)
    #     return
    validate_db_connection()

    try:
        db_cursor = get_cursor()
        db_cursor.execute(INSERT_TEMPLATE, {"table_type": email_template.table_type, "title": email_template.title, "service_name": email_template.service_name, "email_column": email_template.email_column,
                          "language": email_template.language, "subject": email_template.subject, "user_created": email_template.user_created, "body_html": email_template.body_html, "body_design": Json(jsonable_encoder(email_template.body_design))})

        template_id = db_cursor.fetchone()['id']
        return template_id

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'Template names must be unique'
        })
