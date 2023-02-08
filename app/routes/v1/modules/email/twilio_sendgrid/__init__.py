import sendgrid
import os
from sendgrid.helpers.mail import Mail, Email, To, Content, amp_html_content, html_content, plain_text_content
from pydantic import BaseModel, EmailStr
from typing import Optional
from fastapi import HTTPException, Response
from operator import attrgetter
from dotenv import load_dotenv

from app.utils import config
import app.routes.v1.modules.email as email_service


class SendgridParams(BaseModel):
    sendgrid_api_key: str
    source_email_address: EmailStr


def initialize_sendgrid(sendgrid_params: SendgridParams):
    try:
        sendgrid_api_key = sendgrid_params.sendgrid_api_key
        sg = sendgrid.SendGridAPIClient(sendgrid_api_key)

        from_email = Email(sendgrid_params.source_email_address)
        to_email = To('31@gmail.com')
        subject = "Sending with SendGrid is Fun"
        content = Content(
            "text/plain", "and easy to do anywhere, even with Python")
        Html_content = html_content.HtmlContent("<strong>Hello coder</strong>")
        mail = Mail(from_email, to_email, subject, content, Html_content)

        # Get a JSON-ready representation of the Mail object
        mail_json = mail.get()

        # Send an HTTP POST request to /mail/send
        response = sg.client.mail.send.post(request_body=mail_json)
        print(response.status_code)
        # print(response.headers)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail={
            'status': 'failed',
            'message': 'Check credentials'
        })

    email_service.initialize_email_db()

    config.set_env_variable('SENDGRID_API_KEY',
                            sendgrid_params.sendgrid_api_key)
    config.set_env_variable(
        'SENDGRID_SOURCE_EMAIL_ADDRESS', sendgrid_params.source_email_address)
    config.set_env_variable("TWILIO_SENDGRID_IS_ACTIVE", "yes")


class SgMailParams(BaseModel):
    receiver_mail: list[EmailStr]
    subject: str
    # body_text: str
    body_html: Optional[str] = None


def send_email_sendgrid(sendgrid_params: SgMailParams, http_response: Response):
    load_dotenv()

    if 'SENDGRID_API_KEY' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the SendGrid Email Service'
        }
    if 'SENDGRID_SOURCE_EMAIL_ADDRESS' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the SendGrid Email Service'
        }

    elif os.environ["TWILIO_SENDGRID_IS_ACTIVE"] == "no":
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the Sendgrid service first'
        }

    try:
        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        sendgrid_source_address = os.getenv('SENDGRID_SOURCE_EMAIL_ADDRESS')
        sendgrid_client = sendgrid.SendGridAPIClient(sendgrid_api_key)

        from_email = Email(sendgrid_source_address)
        to_email = To(sendgrid_params.receiver_mail)
        subject = sendgrid_params.subject
        # content = Content(content=sendgrid_params.body_text,
        #                   mime_type='text/plain')
        Html_content = html_content.HtmlContent(sendgrid_params.body_html)

        mail = Mail(from_email, to_email, subject, Html_content)
        # print(mail, "\n")

        # Get a JSON-ready representation of the Mail object
        mail_json = mail.get()

        # Send an HTTP POST request to /mail/send
        response = sendgrid_client.client.mail.send.post(
            request_body=mail_json)

        response = {"status_code": response.status_code,
                    "headers": response.headers}

        return {
            "status": "success",
            "message": "The email has been sent",
            "service_response": response
        }

    except Exception as e:
        print("ERROR: ", e)

        http_response.status_code = 500
        return {
            'status': 'failed',
            'message': str(e)
        }
