from event_subscriber import db_listen

from fastapi.testclient import TestClient


def test_listen():
    assert db_listen()