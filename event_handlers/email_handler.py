from psycopg2 import sql
import requests
import json
from db import get_cursor


def send_request(template_id, receipient_address, variables_data):
    endpoint = 'http://localhost:5000/api/v1/email/send_templated_email'

    req_body = json.dumps({
        'template_id': template_id,
        'receipient_addresses': [receipient_address],
        "variables_data": variables_data
    })

    req_headers = {
        'x-admin-secret-key': 'hello@123'
    }

    print(req_body)

    try:
        res = requests.post(url=endpoint, data=req_body, headers=req_headers)
        return res.json()
    except Exception as e:
        print(e)


GET_TEMPLATE_CONFIG = """
    SELECT email_column, foreign_key_column
    FROM tgf_catalog.email_templates
    WHERE id=%s;
 """

GET_USER_TABLE = """
    SELECT data from tgf_catalog.static_variables 
    WHERE name='USER_TABLE'
"""

GET_EMAIL_ADDRESS = """
    SELECT {email_column} from {user_table}
    WHERE {primary_key_column} = {foreign_key_value}
"""


def get_email_address(trigger_data, email_column, foreign_key_column):
    db_cursor = get_cursor()

    db_cursor.execute(GET_USER_TABLE)

    data = db_cursor.fetchone()

    user_table = data['data']

    db_cursor.execute(GET_EMAIL_ADDRESS.format(email_column=email_column, user_table=user_table['table_name'],
                      primary_key_column=user_table['primary_key_column'], foreign_key_value=trigger_data[foreign_key_column]))

    email_data = db_cursor.fetchone()

    print(email_data)

    return email_data[email_column]


def handle_email(trigger_info, trigger_data, variables_data):
    db_cursor = get_cursor()
    email_template_id = trigger_info["email_template_id"]

    print(email_template_id, "\n")
    db_cursor.execute(GET_TEMPLATE_CONFIG, (email_template_id,))

    email_config = db_cursor.fetchone()
    print(email_config, "\n")
    email_address = ''

    email_column = email_config["email_column"]
    foreign_key_column = trigger_info["foreign_key_column"]
    table_type = trigger_info["table_type"]

    try:
        if (table_type == 'trigger_table'):
            email_address = trigger_data[email_column]
        else:
            email_address = get_email_address(
                trigger_data, email_config['email_column'], foreign_key_column)
    except Exception as e:
        print(e)

    print(email_address)
    return send_request(email_template_id, email_address, variables_data)
