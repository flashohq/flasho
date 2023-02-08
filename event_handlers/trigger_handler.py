from db import get_cursor
from email_handler import handle_email
from event_logs import update_response, update_status
from sms_handler import handle_sms
from conditions_handler import check_conditions, fill_variables
import os
import sys


def handle_service(trigger_info, trigger_data, variables_data):
    service_response = {}

    if trigger_info['email_template_id'] != None:
        service_response = handle_email(trigger_info,
                                        trigger_data, variables_data)
    if trigger_info['sms_template_id'] != None:
        service_response = handle_sms(trigger_info,
                                      trigger_data, variables_data)

    return service_response


def handle_trigger(data):
    try:
        update_status(data["id"], "PROCESSING")
        old_data = data['payload']['data']['old']
        new_data = data['payload']['data']['new']
        trigger_name = data['trigger_name']
        trigger_op = data['payload']['op']

        GET_COLUMNS = """
                SELECT * FROM tgf_catalog.event_triggers
                WHERE name = %s AND type = %s;
            """

        db_cursor = get_cursor()
        db_cursor.execute(GET_COLUMNS, (trigger_name, trigger_op))

        trigger_info = db_cursor.fetchone()

        print('trigger_info')
        print(trigger_info)

        trigger_config = trigger_info["configuration"]
        # primary_key_value = new_data[trigger_config['primary_key_column']
        #                              ] if trigger_op != 'DELETE' else old_data[trigger_config['primary_key_column']]

        filled_variables = fill_variables(
            old_data, new_data, trigger_info)

        if not check_conditions(trigger_config['conditions'], filled_variables):
            update_response(data["id"], {
                            "status": "failed", "message": "trigger data did not pass the conditions"})
            print("trigger conditions not passed")
            update_status(data["id"], "PROCESSED")
            return False

        response = {}

        if trigger_op == 'INSERT':
            response = handle_service(trigger_info, new_data, filled_variables)
        elif trigger_op == 'DELETE':
            response = handle_service(trigger_info, old_data, filled_variables)
        else:
            response = handle_service(trigger_info, new_data, filled_variables)

        print("final response: ", response)
        update_response(data["id"], response)
        if response["status"] == "failed":
            update_status(data["id"], "ERROR")
        else:
            update_status(data["id"], "PROCESSED")
        return True

    except Exception as e:
        update_status(data["id"], "ERROR")
        print(e)
        # exc_type, exc_obj, exc_tb = sys.exc_info()
        # fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        # print(exc_type, fname, exc_tb.tb_lineno)
