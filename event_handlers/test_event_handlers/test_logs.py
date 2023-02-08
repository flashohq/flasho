from event_logs import update_status , update_response

from fastapi.testclient import TestClient

up_id = {"id" : 147}

up_status =  {"status" : "PROCESSING"}

def test_status():
    assert update_status(147 , "ERROR") is None

def test_resp():
    assert update_response(147 , {} ) is None