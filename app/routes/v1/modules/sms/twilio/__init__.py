import os
from pydantic import BaseModel
from fastapi import HTTPException, Response
from operator import attrgetter
from twilio.rest import Client
from dotenv import load_dotenv

import app.routes.v1.modules.sms as sms_service
from app.utils import config


class TwilioParams(BaseModel):
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_phone_number: str = "+13XXXXXXXXX"


def initialize_twilio_sms(twilio_params: TwilioParams):
    try:
        account_sid = twilio_params.twilio_account_sid
        auth_token = twilio_params.twilio_auth_token
        client = Client(account_sid, auth_token)

        message = client.messages.create(
            body="hello auth_token",
            from_=twilio_params.twilio_phone_number,
            to="+917905998978"
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail={
            'status': 'Invalid credentials',
            'message': "Kindly recheck the twilio account credentials"
        })

    sms_service.initialize_sms_db()

    config.set_env_variable('TWILIO_ACC_SID', twilio_params.twilio_account_sid)
    config.set_env_variable(
        'TWILIO_AUTH_TOKEN', twilio_params.twilio_auth_token)
    config.set_env_variable('TWILIO_SENDER_PHONE_NUMBER',
                            twilio_params.twilio_phone_number)
    config.set_env_variable("TWILIO_IS_ACTIVE", "yes")


class TwilioSMSParameters(BaseModel):
    receipient_phone_number: str = "+91XXXXXXXXXX"
    body: str


def send_sms_twilio(sms_parameters: TwilioSMSParameters, http_response: Response):
    load_dotenv()
    if 'TWILIO_ACC_SID' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the Twilio service'
        }

    elif 'TWILIO_AUTH_TOKEN' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the Twilio service'
        }

    elif 'TWILIO_SENDER_PHONE_NUMBER' not in os.environ:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the Twilio service'
        }

    elif os.environ["TWILIO_IS_ACTIVE"] == "no":
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly reactivate the Twilio service first'
        }

    account_sid = os.environ['TWILIO_ACC_SID']
    auth_token = os.environ['TWILIO_AUTH_TOKEN']
    senders_phone_number = os.environ['TWILIO_SENDER_PHONE_NUMBER']

    client = Client(account_sid, auth_token)
    print(client, "\n")
    try:
        message = client.messages.create(
            body=sms_parameters.body,
            from_=senders_phone_number,
            to=sms_parameters.receipient_phone_number
        )
        # print(type(message), "\n", "this is")
        print(message.sid)
        response = {"message_sid": message.sid}

        return {
            "status": "success",
            "message": "The sms has been sent",
            "service_response": response
        }

    except Exception as e:
        print("ERROR: ", e)
        http_response.status_code = 500
        return {
            'status': 'failed',
            'message': str(e)
        }
