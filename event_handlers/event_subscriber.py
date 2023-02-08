from trigger_handler import handle_trigger
import logging

from db import get_connection
import json


def db_listen():
    while True:
        try:
            connection = get_connection()

            db_cursor = connection.cursor()

            db_cursor.execute("LISTEN insert_event;")

            while True:
                connection.poll()  # get the message
                while connection.notifies:
                    print('here')
                    notification = connection.notifies.pop()  # pop notification from list
                    # now do anything needed!
                    data = json.loads(notification.payload)
                    print(data)
                    handle_trigger(data)
        except Exception as e:
            a = 1


if __name__ == "__main__":
    db_listen()
