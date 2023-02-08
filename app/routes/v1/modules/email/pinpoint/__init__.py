from json import load
import os
import boto3
from typing import Optional
from pydantic import BaseModel, EmailStr
from operator import attrgetter
from fastapi import HTTPException, Response

import app.routes.v1.modules.email as email_service
from app.utils import config
from dotenv import load_dotenv


class PinpointEMailParameters(BaseModel):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str = "ap-south-1"
    pinpoint_application_id: str
    source_email_address: EmailStr


def initialize_pinpoint_email_service(pinpoint_email_params: PinpointEMailParameters):
    try:
        sts = boto3.client('sts',
                           aws_access_key_id=pinpoint_email_params.aws_access_key_id,
                           aws_secret_access_key=pinpoint_email_params.aws_secret_access_key,
                           region_name=pinpoint_email_params.aws_region)
        sts.get_caller_identity()
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            'status': 'Invalid credentials',
            'message': "Kindly recheck the aws account credentials"
        })

    try:
        client = boto3.client(
            'pinpoint-email',
            aws_access_key_id=pinpoint_email_params.aws_access_key_id,
            aws_secret_access_key=pinpoint_email_params.aws_secret_access_key,
            region_name=pinpoint_email_params.aws_region
        )
        source_address = pinpoint_email_params.source_email_address
        response = client.get_email_identity(
            EmailIdentity=source_address
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail={
            'status': 'failed',
            'message': 'aws credentials are incorrect'
        })

    # if source_address not in response['VerificationAttributes'] or response['VerificationAttributes'][source_address]['VerificationStatus'] != 'Success':
    #     raise HTTPException(status_code=400, detail={
    #         'status': 'failed',
    #         'message': 'Source email address is not verified, kindly verify it from AWS SES console'
    #     })

    email_service.initialize_email_db()

    config.set_env_variable('PINPOINT_ACCESS_KEY',
                            pinpoint_email_params.aws_access_key_id)
    config.set_env_variable(
        'PINPOINT_SECRET_KEY', pinpoint_email_params.aws_secret_access_key)
    config.set_env_variable(
        'PINPOINT_REGION', pinpoint_email_params.aws_region)
    config.set_env_variable('PINPOINT_APPLICATION_ID',
                            pinpoint_email_params.pinpoint_application_id)
    config.set_env_variable("PINPOINT_EMAIL_IS_ACTIVE", "yes")
    config.set_env_variable("PINPOINT_SENDER_EMAIL",
                            pinpoint_email_params.source_email_address)


class PinpointParameters(BaseModel):
    recipient_addresses: list[EmailStr]
    subject: str
    body_html: Optional[str] = None


def send_email_pinpoint(email_parameters: PinpointParameters, http_response: Response):
    load_dotenv()
    if 'PINPOINT_ACCESS_KEY' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the Pinpoint service before sending emails'
        }

    elif os.environ["PINPOINT_EMAIL_IS_ACTIVE"] == "no":
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the Pinpoint service first'
        }

    elif 'PINPOINT_SENDER_EMAIL' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the Pinpoint service before sending emails'
        }

    elif 'PINPOINT_APPLICATION_ID' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the Pinpoint service before sending emails'
        }

    sender = os.environ['PINPOINT_SENDER_EMAIL']

    to_addresses, subject, html_message = attrgetter(
        'recipient_addresses', 'subject', 'body_html')(email_parameters)

    try:
        client = boto3.client(
            'pinpoint',
            aws_access_key_id=os.environ['PINPOINT_ACCESS_KEY'],
            aws_secret_access_key=os.environ['PINPOINT_SECRET_KEY'],
            region_name=os.environ['PINPOINT_REGION']
        )
        response = client.send_messages(
            ApplicationId=os.environ['PINPOINT_APPLICATION_ID'],
            MessageRequest={
                'Addresses': {
                    to_address: {'ChannelType': 'EMAIL'} for to_address in to_addresses
                },
                'MessageConfiguration': {
                    'EmailMessage': {
                        'FromAddress': sender,
                        'SimpleEmail': {
                            'Subject': {'Charset': 'UTF-8', 'Data': subject},
                            'HtmlPart': {'Charset': 'UTF-8', 'Data': html_message}}}}})
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
