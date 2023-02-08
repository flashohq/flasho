import os
import boto3
from typing import Optional
from pydantic import BaseModel
from operator import attrgetter
from fastapi import HTTPException, Response
from dotenv import load_dotenv

import app.routes.v1.modules.sms as sms_service
from app.utils import config


class SNSParameters(BaseModel):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str = "ap-south-1"


def initialize_sns_service(sns_parameters: SNSParameters):
    try:
        sts = boto3.client('sts',
                           aws_access_key_id=sns_parameters.aws_access_key_id,
                           aws_secret_access_key=sns_parameters.aws_secret_access_key,
                           region_name=sns_parameters.aws_region)
        sts.get_caller_identity()
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            'status': 'Invalid credentials',
            'message': "Kindly recheck the aws account credentials"
        })

    sms_service.initialize_sms_db()

    config.set_env_variable('SNS_ACCESS_KEY', sns_parameters.aws_access_key_id)
    config.set_env_variable(
        'SNS_SECRET_KEY', sns_parameters.aws_secret_access_key)
    config.set_env_variable('SNS_REGION', sns_parameters.aws_region)
    config.set_env_variable("SNS_IS_ACTIVE", "yes")


class SMSParameters(BaseModel):
    receipient_phone_number: str = "+91XXXXXXXXXX"
    message_body: str
    message_type: Optional[str] = "Promotional/Transactional"


def send_sms_sns(sms_parameters: SMSParameters, http_response: Response):
    load_dotenv()
    if 'SNS_ACCESS_KEY' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the SNS service before sending SMS'
        }

    elif os.environ["SNS_IS_ACTIVE"] == "no":
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the SNS service first'
        }
    phone_number, message_body, message_type = attrgetter(
        'receipient_phone_number', 'message_body', 'message_type')(sms_parameters)

    try:
        client = boto3.client(
            'sns',
            aws_access_key_id=os.environ['SNS_ACCESS_KEY'],
            aws_secret_access_key=os.environ['SNS_SECRET_KEY'],
            region_name=os.environ['SNS_REGION']
        )
        response = client.publish(
            PhoneNumber=phone_number,
            Message=message_body,
            MessageAttributes={
                'AWS.SNS.SMS.SMSType': {
                    'DataType': 'String',
                    'StringValue': message_type
                }
            }
        )
        return {
            "status": "success",
            "message": "The SMS has been sent",
            "service_response": response
        }
    except Exception as e:
        print("ERROR: ", e)
        http_response.status_code = 500
        return {
            'status': 'failed',
            'message': str(e)
        }
