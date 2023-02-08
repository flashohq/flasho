from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, Response
from fastapi.encoders import jsonable_encoder
from psycopg2.extras import Json
import os
import json

from . import ses
from . import twilio_sendgrid
from . import pinpoint
from app.db import get_cursor, validate_db_connection
from .templates import get_email_templates, create_email_template, EmailTemplate

router = APIRouter()

CREATE_SCHEMA_AND_TABLE = """
    CREATE SCHEMA IF NOT EXISTS tgf_catalog;
    CREATE TABLE IF NOT EXISTS tgf_catalog.email_templates(
        id SERIAL PRIMARY KEY,
        title TEXT,
        service_name TEXT,
        email_column TEXT,
        language TEXT,
        subject TEXT,
        user_created BOOLEAN,
        body_html TEXT,
        body_design JSON,
        body_image TEXT,
        table_type TEXT
    );
    SELECT title from tgf_catalog.email_templates
    WHERE title = 'Sample Template 1'
"""

INSERT_TEMPLATE = """
    INSERT INTO tgf_catalog.email_templates(title, service_name, email_column, language, subject, user_created, body_html, body_design, body_image)
    VALUES (%(title)s, '', '', '', '', false, %(body_html)s, %(body_design)s, %(body_image)s)
    RETURNING id;
"""

images = ["https://d35pnp6c7e171b.cloudfront.net/templates/temp4.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp6.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp7.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp1.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp2.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp3.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp5.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp8.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp9.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp10.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp11.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp12.png",
          "https://d35pnp6c7e171b.cloudfront.net/templates/temp13.png"]


def add_default_templates(db_cursor):

    for i in range(1, 14):
        template_path = os.getcwd() + '/app/routes/v1/modules/email/templates/data/template' + \
            str(i)

        html_path = template_path + '/body.html'
        design_path = template_path + '/design.json'

        body_html = open(html_path)
        design_json = open(design_path)

        db_cursor.execute(INSERT_TEMPLATE, {"title": "Sample Template "+str(
            i), "body_html": body_html.read(), "body_design":  Json(jsonable_encoder(json.loads(design_json.read()))), "body_image": images[i-1]})


def initialize_email_db():
    validate_db_connection()
    try:
        db_cursor = get_cursor()
        db_cursor.execute(CREATE_SCHEMA_AND_TABLE)
        templates = db_cursor.fetchall()
        print(templates)
        if (len(templates) == 0):
            add_default_templates(db_cursor)
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'Database error'
        })


class ResponseStatus(BaseModel):
    status: str
    message: str
    service_response: Optional[dict]


@ router.get("/templates/{template_type}")
def view_email_templates(template_type: Optional[str]):
    return get_email_templates(template_type)


@ router.post("/templates")
def create_email_templates(email_template: EmailTemplate):
    template_id = create_email_template(email_template)

    return {
        "status": "success",
        "message": "New email template has been created",
        "template_id": template_id
    }


class EmailParameters(BaseModel):
    service_name: str
    recipient_addresses: list[EmailStr]
    subject: str
    body_html: Optional[str] = None


@ router.post("/send_email", response_model=ResponseStatus)
def send_email(email_parameters: EmailParameters, http_response: Response):
    service_selection = email_parameters.service_name
    if service_selection == 'ses':
        ses_email_parameters = ses.EmailParameters(
            recipient_addresses=email_parameters.recipient_addresses,
            subject=email_parameters.subject,
            body_html=email_parameters.body_html,
        )
        response = ses.send_email_ses(ses_email_parameters, http_response)

    elif service_selection == 'pinpoint':
        pinpoint_email_parameters = pinpoint.PinpointParameters(
            recipient_addresses=email_parameters.recipient_addresses,
            subject=email_parameters.subject,
            body_html=email_parameters.body_html,
        )
        response = pinpoint.send_email_pinpoint(
            pinpoint_email_parameters, http_response)

    elif service_selection == 'twilio_sendgrid':
        sendgrid_email_parameters = twilio_sendgrid.SgMailParams(
            receiver_mail=email_parameters.recipient_addresses,
            subject=email_parameters.subject,
            body_html=email_parameters.body_html,
        )
        response = twilio_sendgrid.send_email_sendgrid(
            sendgrid_email_parameters, http_response)

    return response


@ router.post("/send_pinpoint_email", response_model=ResponseStatus)
def send_pinpoint_email(email_parameters: pinpoint.PinpointParameters, http_response: Response):
    response = pinpoint.send_email_pinpoint(
        email_parameters, http_response)
    return response


@ router.post("/send_sg_email", response_model=ResponseStatus)
def send_sendgrid_email(email_parameters: twilio_sendgrid.SgMailParams, http_response: Response):
    response = twilio_sendgrid.send_email_sendgrid(
        email_parameters, http_response)
    return response


class TemplatedEmailConfig(BaseModel):
    template_id: int
    receipient_addresses: list[EmailStr]
    variables_data: Optional[dict] = {}


GET_TEMPLATE = """
    SELECT service_name,subject, body_html
    FROM tgf_catalog.email_templates
    WHERE id=%s;
"""


def send_templated_email(template_id: int, receipient_addresses: list[EmailStr], variables_data: dict, http_response: Response):
    db_cursor = get_cursor()
    db_cursor.execute(GET_TEMPLATE, (template_id,))
    template_data = db_cursor.fetchone()
    subject = template_data["subject"]
    body_html = template_data["body_html"]
    service_name = template_data["service_name"]
    # print("before loop","\n")
    try:
        for key, variable_info in variables_data["primary"].items():
            body_html = body_html.replace(
                "{{{{{}}}}}".format(key), str(variable_info["value"]))

        for key, variable_info in variables_data["derived"].items():
            body_html = body_html.replace(
                "{{{{{}}}}}".format(key), str(variable_info["value"]))

        for key, variable_info in variables_data["manual"].items():
            # print("key is :",key ,"value is :",variable_info,"\n")
            body_html = body_html.replace(
                "{{{{{}}}}}".format(key), str(variable_info))

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail={
            'status': 'failed',
            'message': 'variable/conditions error, check if the column name is present in trigger data and condition is a python boolean expression'
        })

    response = {}

    if (service_name == "ses"):
        for receipient in receipient_addresses:
            email_parameters = ses.EmailParameters(
                recipient_addresses=[receipient],
                subject=subject,
                body_html=body_html
            )
            response = ses.send_email_ses(email_parameters, http_response)

    elif (service_name == "pinpoint"):
        for receipient in receipient_addresses:
            pinpoint_email_parameters = pinpoint.PinpointParameters(
                recipient_addresses=[receipient],
                subject=subject,
                body_html=body_html
            )
            response = pinpoint.send_email_pinpoint(
                pinpoint_email_parameters, http_response)

    elif (service_name == "twilio_sendgrid"):
        for receipient in receipient_addresses:
            sendgrid_email_parameters = twilio_sendgrid.SgMailParams(
                receiver_mail=[receipient],
                subject=subject,
                body_html=body_html
            )
            response = twilio_sendgrid.send_email_sendgrid(
                sendgrid_email_parameters, http_response)

    return response


@router.post("/send_templated_email", response_model=ResponseStatus)
def send_templated_emails(template_config: TemplatedEmailConfig, http_response: Response):
    response = send_templated_email(template_config.template_id,
                                    template_config.receipient_addresses, template_config.variables_data, http_response)

    return response
