from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Any

from .tables import read_tables
from .schemas import read_schemas
from .columns import read_columns
from .events.create import create_trigger
from .events.get import get_email_triggers, get_sms_triggers
from .events.alter import enable_trigger, disable_trigger
from .events.delete import delete_trigger
from .events.get_trigger import get_trigger, get_trigger_by_name
from .events.alter import update_trigger
from .events.event_logs import get_logs_count, get_logs_data


class Tables(BaseModel):
    tables: list


class Schemas(BaseModel):
    schemas: list


class Column(BaseModel):
    name: str
    data_type: str


class Columns(BaseModel):
    columns: list


class TriggerConfiguration(BaseModel):
    variables: dict = {}
    conditions: list[list[dict]]


class TriggerPayload(BaseModel):
    trigger_name: Optional[str]
    name: Optional[str]
    schema_name: Optional[str]
    table_name: str
    primary_key_column: Optional[str]
    configuration: TriggerConfiguration
    event: Optional[str]
    title: Optional[str]
    sms_template_id: Optional[int] = None
    email_template_id: Optional[int] = None
    email_service: Optional[str]
    email_column: Optional[str]
    language: Optional[str]
    subject: Optional[str]
    body_html: Optional[str]
    body_design: Optional[dict]
    sms_service: Optional[str]
    contains_country_code: Optional[bool]
    country_code_column: Optional[str]
    phone_number_column: Optional[str]
    sms_type: Optional[str]
    message_body: Optional[str]
    foreign_key_column: Optional[str]


class EmailEventTrigger(BaseModel):
    name: str
    subject: str
    language: int
    active: bool


class SMSEventTrigger(BaseModel):
    name: str
    message_body: str
    language: int
    active: bool


class Triggers(BaseModel):
    triggers: Any


class UpdateTriggersParameter(BaseModel):
    operation: str
    trigger_name: Optional[str]
    trigger_id: int
    trigger_configuration: Optional[TriggerPayload]
    event: Optional[str]
    table_name: Optional[str]


class DeleteTriggersParameter(BaseModel):
    id: int


router = APIRouter()


@ router.get("/schemas", response_model=Schemas)
def get_schemas():
    schemas = read_schemas()

    return {"schemas": schemas}


@ router.get("/tables/{schema}", response_model=Tables)
def get_tables(schema):
    tables = read_tables(schema)

    return {"tables": tables}


@ router.get("/columns/{schema}/{table}", response_model=Columns)
def get_columns(schema, table):
    columns = read_columns(schema, table)

    return {"columns": columns}


@ router.get("/events/{type}", response_model=Triggers)
def get_triggers(type):
    triggers = {}
    if type == 'email':
        triggers = get_email_triggers()
    elif type == 'sms':
        triggers = get_sms_triggers()

    return {"triggers": triggers}


@router.post("/events")
def update_triggers(update_trigger_parameters: UpdateTriggersParameter):
    if (update_trigger_parameters.operation == "enable"):
        enable_trigger(update_trigger_parameters.trigger_name,
                       update_trigger_parameters.trigger_id,
                       update_trigger_parameters.event,
                       update_trigger_parameters.table_name)
    elif (update_trigger_parameters.operation == "disable"):
        disable_trigger(update_trigger_parameters.trigger_name,
                        update_trigger_parameters.trigger_id,
                        update_trigger_parameters.event,
                        update_trigger_parameters.table_name)
    else:
        return update_trigger(update_trigger_parameters.trigger_id,
                              update_trigger_parameters.trigger_configuration)


@router.delete("/events")
def delete_triggers(delete_trigger_parameters: DeleteTriggersParameter):
    delete_trigger(delete_trigger_parameters.id)


@router.post("/")
def triggers(trigger_parameters: TriggerPayload):
    return create_trigger(trigger_parameters)


@router.get("/{trigger_id}")
def get_triggers_and_template(trigger_id):
    return get_trigger(trigger_id)


@router.get("/")
def get_triggers_with_parameters(trigger_name: str):
    triggers = get_trigger_by_name(trigger_name)
    return triggers


@router.get("/event_logs/{trigger_type}")
def get_event_logs_data(trigger_type, limit: int = 10, offset: int = 0):
    return get_logs_data(trigger_type, limit, offset)


@router.get("/event_logs/count/{trigger_type}")
def get_event_logs_count(trigger_type):
    return get_logs_count(trigger_type)
