from fastapi.testclient import TestClient

from sms_handler import get_phone_number , send_request , handle_sms , validate_phone_number


id = {"sms_template_id" : 47}

given_data = {
    "payload" : {"data" : {"old" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:17:01.185312+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":70,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}, "new" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:22:35.665256+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":65,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}}
}

data = {
    "configuration" : {"variables": {"primary": {"fname": {"column_name": "first_name", "data_type": "text", "state": "new"}, "lname": {"column_name": "last_name", "data_type": "text", "state": "new"}, "payment status": {"column_name": "payment_status", "data_type": "text", "state": "new"}}, "derived": {"name": {"variable1": "fname", "variable2": "lname", "operation": "+", "data_type": "text"}}}, "conditions": [[{"variable_name": "payment status", "comparator": "==", "condition_value": "success", "logical_operator": ""}]]}
}





my_data = {
    "id": 47,
    "title": "test123123123",
    "service_name": "sns",
    "schema_name": "",
    "table_name": "",
    "contains_country_code": False,
    "country_code_column": "country_code",
    "phone_number_column": "phone_number",
    "type": "Promotional",
    "language": "0",
    "message_body": "Hey {{name}}, how are you  great to see that your subscribers are increasing. From {{old_sub_count}} to {{new_sub_count}}. This is almost an increment of {{diff_sub_count}}. Great Work !!!",
    "foreign_key_column": ""
  }
'''  

def test_phone():
    assert get_phone_number(given_data["payload"]["data"]["old"] , my_data) 
'''
'''
id = {"sms_template_id" : 34}

given_data = {
    "payload" : {"op" : "UPDATE", "data" : {"old" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-06-18T07:43:01.21604+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":50,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}, "new" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-08-27T07:04:22.826893+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":60,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}}
}

data = {
    "configuration" : {"variables": {"primary": {"old": {"column_name": "subscriber_count", "data_type": "integer", "state": "new"}, "new": {"column_name": "subscriber_count", "data_type": "integer", "state": "new"}}, "derived": {"diff": {"variable1": "new", "variable2": "old", "operation": "-", "data_type": "integer"}}}, "conditions": [[{"variable_name": "diff", "comparator": ">=", "condition_value": "1", "logical_operator": ""}]]}
}
'''
def test_handle_sms():
    assert handle_sms(id["sms_template_id"] , given_data["payload"]["data"]["old"], data)

'''
def test_sendreq():
    assert send_request(id["sms_template_id"] , my_data , data)
'''    

