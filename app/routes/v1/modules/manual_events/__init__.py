from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from app.db import get_cursor
from .sms_service import get_sms_data, get_phone_number, send_sms_request
from .email_service import send_email_request, get_recipent_address


class Manual(BaseModel):
    variables: dict


router = APIRouter()


GET_TRIGGER_INFO = """Select * from tgf_catalog.event_triggers where name = '{trigger_name}';"""

GET_EMAIL_COLUMN = """Select email_column from tgf_catalog.email_templates where id = '{email_id}';"""


@router.post("/{trigger_name}")
def manual_trigger_data(trigger_name: str, configuration: Manual, http_response: Response):
    try:
        db_cursor = get_cursor()

        db_cursor.execute(GET_TRIGGER_INFO.format(trigger_name=trigger_name))
        data = db_cursor.fetchone()

        if (data["active"] == True):
            trigger_variables = data["configuration"]["variables"]

            variables = {"primary": {}, "derived": {}, "manual": {}}
            for key in trigger_variables["manual"]:
                try:
                    variables["manual"][key] = configuration.variables[key]

                except Exception as e:
                    raise HTTPException(status_code=400, detail={
                        'status': 'failed',
                        'message': 'Provide Correct Configuration Variables'})

            recipent_address = ''

            sms_template_id = data["sms_template_id"]

            email_template_id = data["email_template_id"]

            response = {}

            if sms_template_id != None:
                sms_config = get_sms_data(sms_template_id)
                parsed_phone_number = get_phone_number(sms_config, variables)

                response = send_sms_request(
                    sms_template_id, parsed_phone_number, variables)

            if email_template_id != None:
                recipent_address = get_recipent_address(
                    email_template_id, variables)

                response = send_email_request(
                    email_template_id, recipent_address, variables)

            print(response, "\n")
            return response

        else:
            http_response.status_code = 400
            return {
                'status': 'failed',
                'message': 'Enable the Manual Trigger'
            }

    except Exception as e:
        print("ERROR: ", e)

        http_response.status_code = 400
        return {
            'status': 'failed',
            'message': 'Provide required variables'
        }
