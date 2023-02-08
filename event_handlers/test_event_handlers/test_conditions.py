from fastapi.testclient import TestClient

from event_handlers import conditions_handler




def test_perform_operation():
    assert conditions_handler.perform_operation(10, 20 , '+') == 30


old_data = {
    "payload" : {"data" : {"old" : 
    {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-06-18T07:43:01.21604+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":50,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}}
}

new_data = {
    "payload" : {"data" : {"new" : 
    {"id":69,"created_at":"2022-06-18T07:43:01.21604+00:00","updated_at":"2022-08-27T07:04:22.826893+00:00","email":"shivam@humbee.app","phone_number":8529429299,"country_code":91,"username":"shivam","profile_pic":"./shaggy.jpg","role":"ui/ux","subscriber_count":60,"first_name":"Shivam","last_name":"Tiwari","phone_verification_status":"null"}}}
}

mydata = {
    "configuration" : {"variables": {"primary": {"phone_verification_status": {"column_name": "phone_verification_status", "data_type": "text", "state": "new"}, "first_name": {"column_name": "first_name", "data_type": "text", "state": "new"}, "last_name": {"column_name": "last_name", "data_type": "text", "state": "new"}}, "derived": {"full_name": {"variable1": "first_name", "variable2": "last_name", "operation": "+", "data_type": "text"}}}, "conditions": [[{"variable_name": "phone_verification_status", "comparator": "==", "condition_value": "success", "logical_operator": ""}]]}
}
test_data = mydata["configuration"]
given_data = test_data["variables"]

op_data = mydata["configuration"]["variables"]

#data = given_data["primary"].items()
#derived_data = given_data["derived"].items()
#print(data,"\n")
#print(derived_data)
#print(test_data["variables"])


def test_fill_variables():
    #print(old_data,"\n")
    #print(new_data,"\n")
    #print(op_data,"\n")
    #print(given_data , "\n")
    assert conditions_handler.fill_variables(old_data["payload"]["data"]["old"] , new_data["payload"]["data"]["new"] ,given_data) == op_data

def test_perform_comparision():
    assert conditions_handler.perform_comparison(10 , 20 , '<') 

test_second = conditions_handler.fill_variables(old_data["payload"]["data"]["old"] , new_data["payload"]["data"]["new"] ,given_data)

def test_check_conditions():
    assert conditions_handler.check_conditions(test_data["conditions"],test_second) == True