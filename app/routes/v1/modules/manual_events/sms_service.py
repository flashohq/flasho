from fastapi import APIRouter , HTTPException , Response
from pydantic import BaseModel , EmailStr
from typing import List, Optional, Any
import os
import requests
import json
from app.db import get_cursor, validate_db_connection

GET_TEMPLATE_CONFIG = """
            SELECT phone_number_column, country_code_column, contains_country_code
            FROM tgf_catalog.sms_templates
            WHERE id=%s;
        """


def validate_phone_number(country_code, phone_number, contains_country_code):
    country_code = str(country_code) if country_code else ''
    phone_number = str(phone_number) if phone_number else ''
    # print("validating phone number",phone_number)
    if len(phone_number) == 0:
        return False
    elif contains_country_code:
        return '+' + phone_number if phone_number[0] != '+' else phone_number

    parsed_number = country_code + phone_number
    return '+' + parsed_number if parsed_number[0] != '+' else parsed_number



def get_phone_number(sms_config , added_variables):
    phone_number_column = ''
    country_code_column = ''
    if(sms_config['contains_country_code']):
        phone_number_column = sms_config['phone_number_column']
        country_code_column = sms_config['country_code_column']
    else:
        phone_number_column = sms_config['phone_number_column']
    phone_number_check = added_variables["manual"][phone_number_column]    
    contains_country_code = sms_config['contains_country_code']
    parsed_phone_number = validate_phone_number(country_code_column, phone_number_check , contains_country_code)
    return parsed_phone_number
    


def get_sms_data(sms_id):
    db_cursor = get_cursor()
    db_cursor.execute(GET_TEMPLATE_CONFIG , (sms_id,))
    sms_config = db_cursor.fetchone()
    # print(sms_config,"\n")
    return sms_config



def send_sms_request(template_id, phone_number, variables_data):
    # print(phone_number , "my_phone","\n")
    endpoint = 'http://localhost:8000/api/v1/sms/send_templated_sms'
    req_body = json.dumps({
        'template_id': template_id,
        'phone_numbers': [phone_number],
        'variables_data': variables_data
    })
    req_headers = {
        'x-admin-secret-key': 'hello@123'
    }
    print(req_body)
    res = requests.post(url=endpoint, data=req_body, headers=req_headers)
    return res.json()


