import os
import boto3
from typing import Optional
from pydantic import BaseModel
from operator import attrgetter
from fastapi import HTTPException, Response
from dotenv import load_dotenv

import app.routes.v1.modules.sms as sms_service
from app.utils import config


class PinpointParams(BaseModel):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str = "ap-south-1"
    pinpoint_application_id: str
    sender_phone_number: str = "+91XXXXXXXXXX"


def initialize_pinpoint_sms_service(pinpoint_parameters: PinpointParams):
    try:
        sts = boto3.client('sts',
                           aws_access_key_id=pinpoint_parameters.aws_access_key_id,
                           aws_secret_access_key=pinpoint_parameters.aws_secret_access_key,
                           region_name=pinpoint_parameters.aws_region)
        sts.get_caller_identity()
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            'status': 'Invalid credentials',
            'message': "Kindly recheck the aws account credentials"
        })

    sms_service.initialize_sms_db()

    config.set_env_variable('PINPOINT_SMS_ACCESS_KEY',
                            pinpoint_parameters.aws_access_key_id)
    config.set_env_variable(
        'PINPOINT_SMS_SECRET_KEY', pinpoint_parameters.aws_secret_access_key)
    config.set_env_variable('PINPOINT_SMS_REGION',
                            pinpoint_parameters.aws_region)
    config.set_env_variable('PINPOINT_SMS_APPLICATION_ID',
                            pinpoint_parameters.pinpoint_application_id)
    config.set_env_variable("PINPOINT_SMS_IS_ACTIVE", "yes")
    config.set_env_variable("PINPOINT_SENDER_NUMBER",
                            pinpoint_parameters.sender_phone_number)


class PinpointSMSParameters(BaseModel):
    receipient_phone_number: str = "+91XXXXXXXXXX"
    message_body: str
    message_type: Optional[str] = "PROMOTIONAL/TRANSACTIONAL"


def send_sms_pinpoint(sms_parameters: PinpointSMSParameters, http_response: Response):
    load_dotenv()
    if 'PINPOINT_SMS_ACCESS_KEY' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the pinpoint service before sending SMS'
        }

    elif os.environ["PINPOINT_SMS_IS_ACTIVE"] == "no":
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the pinpoint service first'
        }

    elif 'PINPOINT_SENDER_NUMBER' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the pinpoint service before sending SMS'
        }

    elif 'PINPOINT_SMS_APPLICATION_ID' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the Pinpoint service before sending emails'
        }

    app_id = os.environ['PINPOINT_SMS_APPLICATION_ID']

    origination_number = os.environ['PINPOINT_SENDER_NUMBER']

    destination_number, message_body, message_type = attrgetter(
        'receipient_phone_number', 'message_body', 'message_type')(sms_parameters)

    try:
        client = boto3.client(
            'pinpoint',
            aws_access_key_id=os.environ['PINPOINT_SMS_ACCESS_KEY'],
            aws_secret_access_key=os.environ['PINPOINT_SMS_SECRET_KEY'],
            region_name=os.environ['PINPOINT_SMS_REGION']
        )
        response = client.send_messages(
            ApplicationId=app_id,
            MessageRequest={
                'Addresses': {destination_number: {'ChannelType': 'SMS'}},
                'MessageConfiguration': {
                    'SMSMessage': {
                        'Body': message_body,
                        'MessageType': message_type.upper(),
                        'OriginationNumber': origination_number}}})

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
