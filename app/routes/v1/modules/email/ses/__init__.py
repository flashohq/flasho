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


class SESParameters(BaseModel):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str = "ap-south-1"
    source_email_address: EmailStr


class EmailParameters(BaseModel):
    recipient_addresses: list[EmailStr]
    subject: str
    body_html: Optional[str] = None


def initialize_ses_service(ses_parameters: SESParameters):
    try:
        sts = boto3.client('sts',
                           aws_access_key_id=ses_parameters.aws_access_key_id,
                           aws_secret_access_key=ses_parameters.aws_secret_access_key,
                           region_name=ses_parameters.aws_region)
        sts.get_caller_identity()
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            'status': 'Invalid credentials',
            'message': "Kindly recheck the aws account credentials"
        })

    try:
        client = boto3.client(
            'ses',
            aws_access_key_id=ses_parameters.aws_access_key_id,
            aws_secret_access_key=ses_parameters.aws_secret_access_key,
            region_name=ses_parameters.aws_region
        )
        source_address = ses_parameters.source_email_address
        response = client.get_identity_verification_attributes(
            Identities=[
                source_address
            ]
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

    config.set_env_variable('SES_ACCESS_KEY', ses_parameters.aws_access_key_id)
    config.set_env_variable(
        'SES_SECRET_KEY', ses_parameters.aws_secret_access_key)

    config.set_env_variable('SES_REGION', ses_parameters.aws_region)
    config.set_env_variable('SES_SOURCE_ADDRESS',
                            ses_parameters.source_email_address)
    config.set_env_variable("SES_IS_ACTIVE", "yes")


def send_email_ses(email_parameters: EmailParameters, http_response: Response):
    load_dotenv()
    if 'SES_ACCESS_KEY' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the SES service before sending emails'
        }

    elif os.environ["SES_IS_ACTIVE"] == "no":
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the SES service first'
        }

    recipient_addresses, subject, body_html = attrgetter(
        'recipient_addresses', 'subject', 'body_html')(email_parameters)

    try:
        client = boto3.client(
            'ses',
            aws_access_key_id=os.environ['SES_ACCESS_KEY'],
            aws_secret_access_key=os.environ['SES_SECRET_KEY'],
            region_name=os.environ['SES_REGION']
        )
        response = client.send_email(
            Source=os.environ['SES_SOURCE_ADDRESS'],
            Destination={
                'ToAddresses': recipient_addresses,
            },
            Message={
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Html': {
                        'Data': body_html,
                        'Charset': 'UTF-8'
                    }
                }
            },
        )
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
