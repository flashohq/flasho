from ntpath import join
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from psycopg2.extras import Json
import os

from app.db import get_cursor
from .integrations import get_integrations, get_credentials, delete_integration, toggle_service_active
from ..email.ses import initialize_ses_service, SESParameters
from ..email.pinpoint import initialize_pinpoint_email_service, PinpointEMailParameters
from ..email.twilio_sendgrid import initialize_sendgrid, SendgridParams
from ..sms.sns import initialize_sns_service, SNSParameters
from ..sms.twilio import initialize_twilio_sms, TwilioParams
from ..sms.pinpoint_sms import initialize_pinpoint_sms_service, PinpointParams
from app.utils import config


class ConnectionParameters(BaseModel):
    parameter_type: str
    user: str
    password: str
    host: str
    port: int
    database: str
    connection_string: Optional[str]


class ResponseStatus(BaseModel):
    status: str
    message: str


class UserModel(BaseModel):
    table_name: str
    primary_key_colum: str


router = APIRouter()


@router.post("/set_connection_url", response_model=ResponseStatus)
def set_connection_url(connectionParameters: ConnectionParameters):
    print(connectionParameters)
    if (connectionParameters.parameter_type == 'credentials'):

        config.set_env_variable("PG_USER", connectionParameters.user)
        config.set_env_variable("PG_PASSWORD", connectionParameters.password)
        config.set_env_variable("PG_HOST", connectionParameters.host)
        config.set_env_variable("PG_PORT", str(connectionParameters.port))
        config.set_env_variable("PG_DATABASE", connectionParameters.database)

    cursor = get_cursor()

    cursor.execute("SELECT version();")

    record = cursor.fetchone()

    print("You are connected to - ", record, "\n")
    return {
        "status": "success",
        "message": "You are connected to the database"
    }


@router.post("/initialize_ses", response_model=ResponseStatus)
def initialize_email_service(ses_parameters: SESParameters):
    initialize_ses_service(ses_parameters)

    return {
        "status": "success",
        "message": "The Email service has been initialized"
    }


@router.post("/initialize_pinpoint_email", response_model=ResponseStatus)
def initialize_pinpoint_service(pinpoint_parameters: PinpointEMailParameters):
    initialize_pinpoint_email_service(pinpoint_parameters)

    return {
        "status": "success",
        "message": "The Pinpoint Email service has been initialized"
    }


@router.post("/initialize_sendgrid", response_model=ResponseStatus)
def initialize_sendgrid_service(sg_params: SendgridParams):
    initialize_sendgrid(sg_params)

    return {
        "status": "success",
        "message": "The Send Grid Email service has been initialized"
    }


@router.post("/initialize_sns", response_model=ResponseStatus)
def initialize_sms_service(sns_parameters: SNSParameters):
    initialize_sns_service(sns_parameters)

    return {"status": "success", "message": "The SMS service has been initialized"}


@router.post("/initialize_pinpoint_sms", response_model=ResponseStatus)
def initialize_pinpoint_service(pin_parameters: PinpointParams):
    initialize_pinpoint_sms_service(pin_parameters)

    return {"status": "success", "message": "The Pinpoint SMS service has been initialized"}


@router.post("/initialize_twilio", response_model=ResponseStatus)
def initialize_twilio_sms_service(twilio_params: TwilioParams):
    initialize_twilio_sms(twilio_params)

    return {"status": "success", "message": "The Twilio service has been initialized"}


@router.get("/get_integrations")
def get_services_integration():
    return get_integrations()


@router.get("/get_credentials/{service_name}")
def get_credentials_for_service(service_name):
    return get_credentials(service_name)


@router.post("/toggle_activation/{service_name}")
def toggle_activation_status(service_name):
    return toggle_service_active(service_name)


@router.delete("/delete_integration/{integration_name}")
def delete_connected_services(integration_name):
    return delete_integration(integration_name)


class UserTable(BaseModel):
    schema_name: Optional[str]
    table_name: Optional[str]
    primary_key_column: Optional[str]


class JoinParameters(BaseModel):
    user_table: str
    current_table: str
    primary_key_column: str
    foreign_key_column: str


CREATE_VARS_TABLE = """
    CREATE SCHEMA IF NOT EXISTS tgf_catalog;
    CREATE TABLE IF NOT EXISTS tgf_catalog.static_variables(
        name TEXT PRIMARY KEY,
        data JSON)
"""

INSERT_VARIABLE = """
    INSERT INTO tgf_catalog.static_variables(
        name, data)
    VALUES (%(name)s,%(data)s)
    ON CONFLICT (name) DO UPDATE 
    SET data = excluded.data
"""

GET_USER_TABLE = """
    SELECT data from tgf_catalog.static_variables 
    WHERE name='USER_TABLE'
"""

CHECK_IF_JOIN_POSSIBLE = """
    SELECT t1.{primary_key_column}, t2.{foreign_key_column}
    FROM {user_table} t1 JOIN {current_table} t2
    ON (t1.{primary_key_column} = t2.{foreign_key_column} )
"""


@router.post("/add_users_table")
def add_users_table(users_table_data: UserTable):
    try:
        db_cursor = get_cursor()
        db_cursor.execute(CREATE_VARS_TABLE)
        db_cursor.execute(INSERT_VARIABLE, {
            "name": "USER_TABLE",
            "data": Json(vars(users_table_data))
        })
        return {
            "status": "success",
            "message": "users table added"
        }

    except Exception as e:
        print("ERROR: ", e)
        raise HTTPException(status_code=400, detail={
            'status': 'failed',
            'message': "error in inserting variable"
        })


@router.get("/get_users_table")
def get_users_table():
    try:
        db_cursor = get_cursor()
        db_cursor.execute(GET_USER_TABLE)

        user_table = db_cursor.fetchone()

        if (user_table == None):
            return {"data": {}}

        return user_table

    except Exception as e:
        print(e)

        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'error in getting variable'
        })


@router.post("/check_join_possible")
def check_join_possible(join_parameters: JoinParameters):
    try:
        db_cursor = get_cursor()
        db_cursor.execute(CHECK_IF_JOIN_POSSIBLE.format(user_table=join_parameters.user_table,
                                                        current_table=join_parameters.current_table,
                                                        primary_key_column=join_parameters.primary_key_column,
                                                        foreign_key_column=join_parameters.foreign_key_column))
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            'status': 'failed',
            'message': 'join not possible '
        })
