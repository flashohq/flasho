from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Response

from app.db import get_cursor, validate_db_connection
from . import sns
from . import twilio
from . import pinpoint_sms
from .templates import SMSTemplate, create_sms_template, get_sms_templates

router = APIRouter()

CREATE_SCHEMA_AND_TABLE = """
    CREATE SCHEMA IF NOT EXISTS tgf_catalog;
    CREATE TABLE IF NOT EXISTS tgf_catalog.sms_templates(
        id SERIAL PRIMARY KEY,
        title TEXT,
        service_name TEXT,
        contains_country_code BOOLEAN,
        country_code_column TEXT,
        phone_number_column TEXT,
        type TEXT NOT NULL DEFAULT 'Promotional',
        language TEXT,
        message_body TEXT,
        table_type TEXT
    );
"""


def initialize_sms_db():
    validate_db_connection()
    try:
        db_cursor = get_cursor()
        db_cursor.execute(CREATE_SCHEMA_AND_TABLE)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail={"status": "failed", "message": "Database error"}
        )


class ResponseStatus(BaseModel):
    status: str
    message: str
    service_response: Optional[dict]


@router.get("/templates")
def get_SMS_templates():
    return get_sms_templates()


@router.post("/templates")
def create_SMS_templates(sms_template: SMSTemplate):
    template_id = create_sms_template(sms_template)
    print(template_id)
    return {"status": "success", "message": "New SMS template has been created", "template_id": template_id}


class SMSParameters(BaseModel):
    service_name: str
    receipient_phone_number: str = "+91XXXXXXXXXX"
    message_body: str
    message_type: Optional[str] = "Promotional/Transactional"


@router.post("/send_sms", response_model=ResponseStatus)
def send_SMS(sms_parameters: SMSParameters, http_response: Response):
    service_selection = sms_parameters.service_name
    if service_selection == 'sns':
        sns_sms_parameters = sns.SMSParameters(
            receipient_phone_number=sms_parameters.receipient_phone_number,
            message_body=sms_parameters.message_body,
            message_type=sms_parameters.message_type,
        )
        response = sns.send_sms_sns(sns_sms_parameters, http_response)

    elif service_selection == 'pinpoint':
        pinpoint_sms_parameters = pinpoint_sms.PinpointSMSParameters(
            receipient_phone_number=sms_parameters.receipient_phone_number,
            message_body=sms_parameters.message_body,
            message_type=sms_parameters.message_type.upper(),
        )
        response = pinpoint_sms.send_sms_pinpoint(
            pinpoint_sms_parameters, http_response)

    elif service_selection == 'twilio':
        twilio_sms_parameters = twilio.TwilioSMSParameters(
            receipient_phone_number=sms_parameters.receipient_phone_number,
            body=sms_parameters.message_body
        )
        response = twilio.send_sms_twilio(twilio_sms_parameters, http_response)

    return response


@router.post("/send_sms_pinpoint", response_model=ResponseStatus)
def send_SMS_Pinpoint(sms_parameters: pinpoint_sms.PinpointSMSParameters, http_response: Response):
    response = pinpoint_sms.send_sms_pinpoint(sms_parameters, http_response)
    return response


@router.post("/send_sms_twilio")
def sms_twilio(sms_parameters: twilio.TwilioSMSParameters, http_response: Response):
    response = twilio.send_sms_twilio(sms_parameters, http_response)
    return response


GET_TEMPLATE = """
    SELECT service_name,type, message_body
    FROM tgf_catalog.sms_templates
    WHERE id=%s;
"""


def send_templated_sms(template_id: int, phone_numbers: list[str], variables_data: dict, http_response: Response):
    validate_db_connection()

    try:
        db_cursor = get_cursor()
        db_cursor.execute(GET_TEMPLATE, (template_id,))

        template_data = db_cursor.fetchone()
        message_type = template_data["type"]
        message_body = template_data["message_body"]
        service_name = template_data["service_name"]

    except Exception as e:
        print("ERROR: ", e)
        http_response.status_code = 400
        return {"status": "failed", "message": "Template id not found"}

    try:
        # print("in loop","\n")
        for key, variable_info in variables_data["primary"].items():
            message_body = message_body.replace(
                "{{{{{}}}}}".format(key), str(variable_info["value"]))

        for key, variable_info in variables_data["derived"].items():
            message_body = message_body.replace(
                "{{{{{}}}}}".format(key), str(variable_info["value"]))

        for key, variable_info in variables_data["manual"].items():
            # print("key is",key, "value is" , variable_info,"\n")
            message_body = message_body.replace(
                "{{{{{}}}}}".format(key), str(variable_info))

        # print("outof loop")
    except Exception as e:
        print("ERROR: ", e)
        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'Variable error, check if the column name is present in trigger data'
        }

    print(message_body)
    response = {}

    if (service_name == "sns"):
        for phone_number in phone_numbers:
            sms_parameters = sns.SMSParameters(
                receipient_phone_number=phone_number,
                message_body=message_body,
                message_type=message_type,
            )
            response = sns.send_sms_sns(sms_parameters, http_response)

    elif (service_name == "pinpoint"):
        for phone_number in phone_numbers:
            pinpoint_sms_parameters = pinpoint_sms.PinpointSMSParameters(
                receipient_phone_number=phone_number,
                message_body=message_body,
                message_type=message_type,
            )
            response = pinpoint_sms.send_sms_pinpoint(
                pinpoint_sms_parameters, http_response)

    elif (service_name == "twilio"):
        for phone_number in phone_numbers:
            twilio_sms_parameters = twilio.TwilioSMSParameters(
                receipient_phone_number=phone_number,
                body=message_body
            )
            response = twilio.send_sms_twilio(
                twilio_sms_parameters, http_response)

    return response


class TemplatedSmsConfig(BaseModel):
    template_id: int
    phone_numbers: list[str] = ["+9188XXXXXXXX"]
    variables_data: Optional[dict] = {}


@router.post("/send_templated_sms", response_model=ResponseStatus)
def send_templated_SMS(template_config: TemplatedSmsConfig, http_response: Response):
    response = send_templated_sms(template_config.template_id,
                                  template_config.phone_numbers, template_config.variables_data, http_response)

    return response
