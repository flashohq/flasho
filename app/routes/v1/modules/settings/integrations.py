import os
from dotenv import load_dotenv
from app.utils import config

from app.utils import config


def get_integrations():
    load_dotenv()
    response = {"db": {"postgres": {}},
                "email": {"ses": {}, "pinpoint": {}, "twilio_sendgrid": {}}, "sms": {"sns": {}, "twilio": {}, "pinpoint": {}}}
    response["db"]["postgres"]["is_connected"] = True if 'PG_USER' in os.environ else False
    response["email"]["ses"]["is_connected"] = True if 'SES_ACCESS_KEY' in os.environ else False
    response["email"]["ses"]["is_active"] = os.environ["SES_IS_ACTIVE"] == "yes" if 'SES_IS_ACTIVE' in os.environ else False
    response["email"]["pinpoint"]["is_connected"] = True if 'PINPOINT_SENDER_EMAIL' in os.environ else False
    response["email"]["pinpoint"]["is_active"] = os.environ["PINPOINT_EMAIL_IS_ACTIVE"] == "yes" if 'PINPOINT_EMAIL_IS_ACTIVE' in os.environ else False
    response["email"]["twilio_sendgrid"]["is_connected"] = True if 'SENDGRID_API_KEY' in os.environ else False
    response["email"]["twilio_sendgrid"]["is_active"] = os.environ["TWILIO_SENDGRID_IS_ACTIVE"] == "yes" if 'TWILIO_SENDGRID_IS_ACTIVE' in os.environ else False
    response["sms"]["sns"]["is_connected"] = True if 'SNS_ACCESS_KEY' in os.environ else False
    response["sms"]["sns"]["is_active"] = os.environ["SNS_IS_ACTIVE"] == "yes" if 'SNS_IS_ACTIVE' in os.environ else False
    response["sms"]["twilio"]["is_connected"] = True if 'TWILIO_ACC_SID' in os.environ else False
    response["sms"]["twilio"]["is_active"] = os.environ["TWILIO_IS_ACTIVE"] == "yes" if 'TWILIO_IS_ACTIVE' in os.environ else False
    response["sms"]["pinpoint"]["is_connected"] = True if 'PINPOINT_SENDER_NUMBER' in os.environ else False
    response["sms"]["pinpoint"]["is_active"] = os.environ["PINPOINT_SMS_IS_ACTIVE"] == "yes" if 'PINPOINT_SMS_IS_ACTIVE' in os.environ else False
    return response


def get_credentials(service_name):
    load_dotenv()
    if service_name == 'postgres':
        return {
            "parameter_type": 'credentials',
            "host": os.environ["PG_HOST"],
            "database": os.environ["PG_DATABASE"],
            "port": os.environ["PG_PORT"],
            "user": os.environ["PG_USER"],
            "password": os.environ["PG_PASSWORD"]
        }
    elif service_name == "ses":
        return {
            "aws_access_key_id": os.environ['SES_ACCESS_KEY'],
            "aws_secret_access_key": os.environ['SES_SECRET_KEY'],
            "aws_region": os.environ['SES_REGION'],
            "source_email_address": os.environ['SES_SOURCE_ADDRESS']
        }

    elif service_name == "pinpoint_email":
        return {
            "aws_access_key_id": os.environ['PINPOINT_ACCESS_KEY'],
            "aws_secret_access_key": os.environ['PINPOINT_SECRET_KEY'],
            "aws_region": os.environ['PINPOINT_REGION'],
            "pinpoint_application_id": os.environ['PINPOINT_APPLICATION_ID'],
            "source_email_address": os.environ['PINPOINT_SENDER_EMAIL']
        }

    elif service_name == "twilio_sendgrid":
        return {
            "sendgrid_api_key": os.environ['SENDGRID_API_KEY'],
            "source_email_address": os.environ['SENDGRID_SOURCE_EMAIL_ADDRESS']
        }

    elif service_name == "sns":
        return {
            "aws_access_key_id": os.environ['SNS_ACCESS_KEY'],
            "aws_secret_access_key": os.environ['SNS_SECRET_KEY'],
            "aws_region": os.environ['SNS_REGION']
        }

    elif service_name == "pinpoint_sms":
        return {
            "aws_access_key_id": os.environ['PINPOINT_SMS_ACCESS_KEY'],
            "aws_secret_access_key": os.environ['PINPOINT_SMS_SECRET_KEY'],
            "aws_region": os.environ['PINPOINT_SMS_REGION'],
            "pinpoint_application_id": os.environ['PINPOINT_SMS_APPLICATION_ID'],
            "sender_phone_number": os.environ['PINPOINT_SENDER_NUMBER']
        }

    elif service_name == "twilio":
        return {
            "twilio_account_sid": os.environ['TWILIO_ACC_SID'],
            "twilio_auth_token": os.environ['TWILIO_AUTH_TOKEN'],
            "twilio_phone_number": os.environ['TWILIO_SENDER_PHONE_NUMBER']
        }

    else:
        return "Service not found"


def toggle_service_active(service_name):
    load_dotenv()
    try:
        if service_name == "ses":
            config.set_env_variable(
                "SES_IS_ACTIVE", "yes" if os.environ["SES_IS_ACTIVE"] == "no" else "no")
            return {"new_status": os.environ["SES_IS_ACTIVE"]}

        elif service_name == "pinpoint_email":
            config.set_env_variable(
                "PINPOINT_EMAIL_IS_ACTIVE", "yes" if os.environ["PINPOINT_EMAIL_IS_ACTIVE"] == "no" else "no")
            return {"new_status": os.environ["PINPOINT_EMAIL_IS_ACTIVE"]}

        elif service_name == "twilio_sendgrid":
            config.set_env_variable(
                "TWILIO_SENDGRID_IS_ACTIVE", "yes" if os.environ["TWILIO_SENDGRID_IS_ACTIVE"] == "no" else "no")
            return {"new_status": os.environ["TWILIO_SENDGRID_IS_ACTIVE"]}

        elif service_name == 'sns':
            config.set_env_variable(
                "SNS_IS_ACTIVE", "yes" if os.environ["SNS_IS_ACTIVE"] == "no" else "no")
            return {"new_status": os.environ["SNS_IS_ACTIVE"]}

        elif service_name == 'pinpoint_sms':
            config.set_env_variable(
                "PINPOINT_SMS_IS_ACTIVE", "yes" if os.environ["PINPOINT_SMS_IS_ACTIVE"] == "no" else "no")
            return {"new_status": os.environ["PINPOINT_SMS_IS_ACTIVE"]}

        elif service_name == 'twilio':
            config.set_env_variable(
                "TWILIO_IS_ACTIVE", "yes" if os.environ["TWILIO_IS_ACTIVE"] == "no" else "no")
            return {"new_status": os.environ["TWILIO_IS_ACTIVE"]}

    except:
        return {
            "status": "failed",
            "message": "service not found"
        }


def delete_integration(integration_name):
    load_dotenv()
    try:
        if integration_name == 'postgres':
            required_key = ['PG_USER', 'PG_PASSWORD',
                            'PG_HOST', 'PG_PORT', 'PG_DATABASE']
            for key in required_key:
                config.delete_env_variable(key)

        elif integration_name == "ses":
            required_key = ['SES_ACCESS_KEY', 'SES_SECRET_KEY',
                            'SES_REGION', 'SES_SOURCE_ADDRESS', 'SES_IS_ACTIVE']
            for key in required_key:
                config.delete_env_variable(key)

        elif integration_name == "pinpoint_email":
            required_key = ['PINPOINT_ACCESS_KEY', 'PINPOINT_SECRET_KEY',
                            'PINPOINT_REGION', 'PINPOINT_APPLICATION_ID', 'PINPOINT_SENDER_EMAIL', 'PINPOINT_EMAIL_IS_ACTIVE']
            for key in required_key:
                config.delete_env_variable(key)
        elif integration_name == 'twilio_sendgrid':
            required_key = ['SENDGRID_API_KEY',
                            'SENDGRID_SOURCE_EMAIL_ADDRESS', 'TWILIO_SENDGRID_IS_ACTIVE']
            for key in required_key:
                config.delete_env_variable(key)
        elif integration_name == 'sns':
            required_key = ['SNS_ACCESS_KEY', 'SNS_SECRET_KEY',
                            'SNS_REGION', 'SNS_IS_ACTIVE']
            for key in required_key:
                config.delete_env_variable(key)
        elif integration_name == "pinpoint_sms":
            required_key = ['PINPOINT_SMS_ACCESS_KEY', 'PINPOINT_SMS_SECRET_KEY',
                            'PINPOINT_SMS_REGION', 'PINPOINT_SMS_APPLICATION_ID', 'PINPOINT_SENDER_NUMBER', 'PINPOINT_SMS_IS_ACTIVE']
            for key in required_key:
                config.delete_env_variable(key)
        elif integration_name == 'twilio':
            required_key = ['TWILIO_ACC_SID',
                            'TWILIO_AUTH_TOKEN', 'TWILIO_SENDER_PHONE_NUMBER', 'TWILIO_IS_ACTIVE']
            for key in required_key:
                config.delete_env_variable(key)
        return {
            "status": "success",
            "message": "service deleted"
        }
    except:
        return {
            "status": "failed",
            "message": "service not found"
        }
