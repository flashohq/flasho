from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
import os
import requests
import json
from app.db import get_cursor, validate_db_connection


def send_email_request(template_id, receipient_address, variables_data):
    # print("in_send_req_funct",variables_data , "\n")
    endpoint = 'http://localhost:8000/api/v1/email/send_templated_email'

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
        # print("in_try_block","\n")
        res = requests.post(url=endpoint, data=req_body, headers=req_headers)
        print("my_res", res)
        return res.json()
    except Exception as e:
        print(e)


GET_EMAIL_COLUMN = """Select email_column from tgf_catalog.email_templates where id = '{email_id}';"""


def get_recipent_address(email_template_id, added_variables):
    db_cursor = get_cursor()
    db_cursor.execute(GET_EMAIL_COLUMN.format(email_id=email_template_id))
    email_data = db_cursor.fetchone()
    email_column_data = email_data["email_column"]
    recipent_address = added_variables["manual"][email_column_data]
    return recipent_address
