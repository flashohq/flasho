import os
from pydantic import BaseModel
from fastapi import HTTPException, Response
from messagebird import Client
from dotenv import load_dotenv

import app.routes.v1.modules.sms as sms_service
from app.utils import config


class MessageBirdParams(BaseModel):
    message_bird_access_key: str
    source_phone_number: str = "+13XXXXXXXXX"


def initialize_message_bird_sms(message_bird_params: MessageBirdParams):
    try:
        client = Client(message_bird_params.message_bird_access_key)

        # message = client.message_create(
        #     message_bird_params.source_phone_number,
        #     ["+917905998978"],
        #     "TEST MESSAGE",
        #     {"reference": "TEST"}
        # )
    except Exception as e:
        for error in e.errors: print(error.__dict__)
        raise HTTPException(status_code=400, detail={
            'status': 'Invalid credentials',
            'message': 'Kindly recheck your MessageBird account credentials'
        })

    sms_service.initialize_sms_db()
    

    config.set_env_variable('MESSAGEBIRD_ACCESS_KEY', 
                            message_bird_params.message_bird_access_key)
    config.set_env_variable('MESSAGEBIRD_SENDER_PHONE_NUMBER',
                            message_bird_params.source_phone_number)
    config.set_env_variable("MESSAGEBIRD_IS_ACTIVE", "yes")

class MessageBirdSMSParameters(BaseModel):
    receipient_phone_number: str = "+91XXXXXXXXXX"
    body: str


def send_sms_message_bird(sms_parameters: MessageBirdSMSParameters, http_response: Response):
    load_dotenv()

    verify_env_variables = [x in os.environ for x in ['MESSAGEBIRD_ACCESS_KEY', 'MESSAGEBIRD_SENDER_PHONE_NUMBER']]
    if False in verify_env_variables:
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'kindly initialize the MessageBird service'
        }
    
    access_key = os.environ['MESSAGEBIRD_ACCESS_KEY']
    senders_phone_number = os.environ['MESSAGEBIRD_SENDER_PHONE_NUMBER']

    client = Client(access_key)
    print(client, "\n")

    try:
        message = client.message_create(
            originator=senders_phone_number,
            recipients=[sms_parameters.receipient_phone_number],
            body=sms_parameters.body,
        )

        print(message.id)
        response = {"message_id": message.id}

        return {
            'status': 'success',
            'message': 'The sms has been sent',
            'service_response': response
        }
    
    except Exception as e:
        print("ERROR: ", e)
        http_response.status_code = 500
        return {
            'status': 'failed',
            'message': str(e)
        }