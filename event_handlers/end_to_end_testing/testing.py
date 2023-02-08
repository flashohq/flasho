from ast import Delete
import os

import sys
print(sys.path)
sys.path.append('/home/ashwani/flasho/')

print(os.getcwd())

from fastapi.testclient import TestClient

from trigger_handler import handle_trigger , handle_service , handle_sms , handle_email

from tests.test_api.test_routes import test_triggers
'''
data = {
    "id": 159,
    "trigger_name": "Hy_everyone",
    "schema_name": "public",
    "table_name": "users",
    "payload": {"op" : "UPDATE", "data" : {"old" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:17:01.185312+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":70,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}, "new" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:22:35.665256+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":65,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}},
    "response": {"detail": "Not Found"},
    "status" : "ERROR",
    "created_at" : "2022-09-06 07:22:35.665256+00",
    "updated_at" : "2022-09-07 07:29:53.696429+00"
}

def test_service():
    assert handle_trigger(data) is None

'''
'''
test_triggers.test_trigger()
test_triggers.test_events()
test_triggers.test_tigger_id()

'''
sms_data = {
    "id": 160,
    "trigger_name": "Mytest",
    "schema_name": "public",
    "table_name": "users",
    "payload": {"op" : "UPDATE", "data" : {"old" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:17:01.185312+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":70,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}, "new" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:22:35.665256+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":65,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}},
    "response": {},
    "status" : "ERROR",
    "created_at" : "2022-09-06 07:22:35.665256+00",
    "updated_at" : "2022-09-12 04:59:08.562332+00"
}

def test_newservice():
    assert handle_trigger(sms_data)

'''
up_data = {
    "id": 168,
    "trigger_name": "test123123123",
    "schema_name": "public",
    "table_name": "users",
    "payload": {"op" : "UPDATE", "data" : {"old" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:22:35.665256+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":65,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}, "new" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-08T05:20:23.583812+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":75,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}},
    "response": {},
    "status" : "PENDING",
    "created_at" : "2022-09-08 05:20:23.583812+00",
    "updated_at" : "2022-09-08 05:20:23.583812+00"
}

def test_new():
    assert handle_trigger(up_data) is None
'''

'''
print(test_triggers.my_val)

create_data = {
    "id": test_triggers.my_val,
    "trigger_name": "tired",
    "schema_name": "public",
    "table_name": "subscriber",
    "payload": {"op" : "INSERT", "data" : {"old" : "null", "new" : {"id":1,"user_id":7,"text":"null"}}},
    "response": {"status": "failed", "message": "trigger data did not pass the conditions"},
    "status" : "ERROR",
    "created_at" : "2022-08-11 17:26:14.399266+00",
    "updated_at" : "2022-08-11 17:26:22.449422+00"
}

def test_create():
    print(test_triggers.my_val)
    assert handle_trigger(create_data) is None
'''
new_data = {
    "id": 185,
    "trigger_name": "congrats_sms",
    "schema_name": "public",
    "table_name": "orders",
    "payload": {"op" : "INSERT", "data" : {"old" : "null", "new" : {"id":23,"first_name":"Vishesh","last_name":"Nautiyal","email":"vishnau31@gmail.com","phone_number":"7455894096","payment_status":"done","created_at":"null","updated_at":"null","user_id":69}}},
    "response": {},
    "status" : "PENDING",
    "created_at" : "2022-09-14 06:57:26.624168+00",
    "updated_at" : "2022-09-14 06:57:26.624168+00"
}
def test_create():
    assert handle_trigger(new_data)


del_data = {
    "id": 158,
    "trigger_name": "hy",
    "schema_name": "public",
    "table_name": "users",
    "payload": {"op" : "DELETE", "data" : {"old" : {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-09-06T07:17:01.185312+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":70,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}, "new" : {"null"}}},
    "response": {},
    "status" : "ERROR",
    "created_at" : "2022-09-06 07:22:35.665256+00",
    "updated_at" : "2022-09-06 07:22:59.94131+00"
}

def test_del():
    assert handle_trigger(del_data)


