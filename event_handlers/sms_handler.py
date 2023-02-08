from psycopg2 import sql
import requests
import json
from db import get_cursor


GET_USER_TABLE = """
    SELECT data from tgf_catalog.static_variables
    WHERE name='USER_TABLE'
"""

GET_PHONE_NUMBER = """
    SELECT {phone_number_column} from {user_table}
    WHERE {primary_key_column} = {foreign_key_value}
"""
GET_PHONE_NUMBER_WITH_COUNTRY_CODE = """
    SELECT {phone_number_column}, {country_code_column} from {user_table}
    WHERE {primary_key_column} = {foreign_key_value}
"""


def get_phone_number(trigger_data, sms_config, foreign_key_column):
    db_cursor = get_cursor()

    db_cursor.execute(GET_USER_TABLE)

    data = db_cursor.fetchone()
    print(data, "\n")
    user_table = data['data']
    print(user_table, "\n")
    if (sms_config['contains_country_code']):
        db_cursor.execute(GET_PHONE_NUMBER_WITH_COUNTRY_CODE.format(phone_number_column=sms_config['phone_number_column'], country_code_column=sms_config['country_code_column'], user_table=user_table['table_nam'],
                                                                    primary_key_column=user_table['primary_key_column'], foreign_key_value=trigger_data[foreign_key_column]))
        phone_number_data = db_cursor.fetchone()

        return phone_number_data

    else:
        db_cursor.execute(GET_PHONE_NUMBER.format(phone_number_column=sms_config['phone_number_column'], user_table=user_table['table_name'],
                                                  primary_key_column=user_table['primary_key_column'], foreign_key_value=trigger_data[foreign_key_column]))
        phone_number_data = db_cursor.fetchone()

        return phone_number_data


def validate_phone_number(country_code, phone_number, contains_country_code):
    country_code = str(country_code) if country_code else ''
    phone_number = str(phone_number) if phone_number else ''

    if len(phone_number) == 0:
        return False
    elif contains_country_code:
        return '+' + phone_number if phone_number[0] != '+' else phone_number

    parsed_number = country_code + phone_number
    return '+' + parsed_number if parsed_number[0] != '+' else parsed_number


def send_request(template_id, phone_number, variables_data):
    endpoint = 'http://localhost:5000/api/v1/sms/send_templated_sms'
    req_body = json.dumps({
        'template_id': template_id,
        'phone_numbers': [phone_number],
        'variables_data': variables_data
    })
    req_headers = {
        'x-admin-secret-key': 'hello@123'
    }
    res = requests.post(url=endpoint, data=req_body, headers=req_headers)
    return res.json()


GET_TEMPLATE_CONFIG = """
            SELECT phone_number_column, country_code_column, contains_country_code, foreign_key_column
            FROM tgf_catalog.sms_templates
            WHERE id=%s;
        """


def handle_sms(trigger_info, trigger_data, variables_data):

    sms_template_id = trigger_info["sms_template_id"]
    print(sms_template_id, "\n")

    db_cursor = get_cursor()
    db_cursor.execute(GET_TEMPLATE_CONFIG, (sms_template_id,))
    sms_config = db_cursor.fetchone()

    phone_number = ''
    country_code = ''

    table_type = trigger_info["table_type"]
    foreign_key_column = trigger_info["foreign_key_column"]

    if (table_type == 'trigger_table'):
        phone_number = trigger_data[sms_config['phone_number_column']]
        country_code = trigger_data[sms_config['country_code_column']]
    else:
        phone_number_data = get_phone_number(
            trigger_data, sms_config, foreign_key_column)
        if (sms_config['contains_country_code']):
            phone_number = phone_number_data[sms_config['phone_number_column']]
            country_code = phone_number_data[sms_config['country_code_column']]
        else:
            phone_number = phone_number_data[sms_config['phone_number_column']]

    contains_country_code = sms_config['contains_country_code']

    parsed_phone_number = validate_phone_number(
        country_code, phone_number, contains_country_code)

    if parsed_phone_number:
        return send_request(sms_template_id,
                            parsed_phone_number, variables_data)
    else:
        return {
            "status": "failed",
            "message": "phone number should be in E.164 format"
        }
