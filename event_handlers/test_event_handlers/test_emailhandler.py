from email_handler import send_request , get_email_address , handle_email
from .emailval import val
from fastapi.testclient import TestClient
import os
import sys
print(os.getcwd())

id = 65

add = "ashwni@humbee.app"

data = {
    "configuration" : {"variables": {"primary": {"fname": {"column_name": "first_name", "data_type": "text", "state": "new"}, "lname": {"column_name": "last_name", "data_type": "text", "state": "new"}, "payment status": {"column_name": "payment_status", "data_type": "text", "state": "new"}}, "derived": {"name": {"variable1": "fname", "variable2": "lname", "operation": "+", "data_type": "text"}}}, "conditions": [[{"variable_name": "payment status", "comparator": "==", "condition_value": "success", "logical_operator": ""}]]}
}

get_email_data = {
    "id": 52,
    "title": "party",
    "service_name": "ses",
    "schema_name": "",
    "table_name": "",
    "email_column": "email",
    "language": "0",
    "subject": "see the db",
    "user_created": True,
    "body_html": val,
    "body_design": {},
    "foreign_key_column": "id",
    "body_image": ""
  }

old_data = {
    "payload" : {"data" : {"old" : 
    {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-06-18T07:43:01.21604+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":50,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}}
}

new_data = {
    "payload" : {"data" : {"new" : 
    {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-08-27T07:04:22.826893+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":60,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}}
}


def test_sendreq():
    assert send_request(id , add , data)

def test_getemail_add():
    assert get_email_address(old_data["payload"]["data"]["old"] , get_email_data)


id = {"email_templated_id" : 49}

def test_handlemail():
    assert handle_email(id["email_templated_id"] , old_data["payload"]["data"]["old"] , data)