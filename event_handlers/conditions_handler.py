from db import get_cursor

GET_USER_TABLE = """
    SELECT data from tgf_catalog.static_variables
    WHERE name='USER_TABLE'
"""

GET_USER_VARIABLES = """
    SELECT {columns} from {schema_name}.{user_table}
    WHERE {primary_key_column} = {foreign_key_value}
"""


def perform_operation(operand1, operand2, operation):
    if operation == '+':
        return operand1 + operand2
    elif operation == '-':
        return operand1 - operand2
    elif operation == '*':
        return operand1 * operand2
    else:
        return operand1 / operand2


def fill_variables(old_data, new_data, trigger_info):
    trigger_configuration = trigger_info["configuration"]
    variables = trigger_configuration["variables"]

    trigger_type = trigger_info["type"]

    primary_variables = variables["primary"]
    derived_variables = variables["derived"]

    user_variables_columns = []
    user_variables_names = []

    # primary variables
    for variable_name, variable_config in primary_variables.items():
        if variable_config["table_type"] == 'trigger_table':
            if variable_config["state"] == "new":
                primary_variables[variable_name]["value"] = new_data[variable_config["column_name"]]
            else:
                primary_variables[variable_name]["value"] = old_data[variable_config["column_name"]]
        elif variable_config["table_type"] == 'user_table':
            user_variables_columns.append(variable_config["column_name"])
            user_variables_names.append(variable_name)

    foreign_key_column = trigger_info["foreign_key_column"]

    # user table primary variables
    if (foreign_key_column != '' and foreign_key_column is not None):
        db_cursor = get_cursor()
        db_cursor.execute(GET_USER_TABLE)
        data = db_cursor.fetchone()
        user_table = data['data']

        db_cursor.execute(GET_USER_VARIABLES.format(columns=','.join(user_variables_columns), schema_name=user_table["schema_name"],
                                                    user_table=user_table["table_name"], primary_key_column=user_table["primary_key_column"], foreign_key_value=old_data[foreign_key_column] if trigger_type == 'DELETE' else new_data[foreign_key_column]))
        user_table_variables = db_cursor.fetchall()

        user_table_variables = [{k: v for k, v in record.items()}
                                for record in user_table_variables][0]

        for i in range(len(user_variables_columns)):
            primary_variables[user_variables_names[i]
                              ]["value"] = user_table_variables[user_variables_columns[i]]

    # derived variables
    for variable_name, variable_config in derived_variables.items():
        derived_variables[variable_name]["value"] = perform_operation(
            primary_variables[variable_config["variable1"]]["value"], primary_variables[variable_config["variable2"]]["value"], variable_config["operation"])

    variables["primary"] = primary_variables
    variables["derived"] = derived_variables

    return variables


def perform_comparison(operand1, operand2, comparator):
    if isinstance(operand1, int):
        operand2 = int(operand2)

    if comparator == '>':
        return operand1 > operand2
    elif comparator == '<':
        return operand1 < operand2
    if comparator == '>=':
        return operand1 >= operand2
    elif comparator == '<=':
        return operand1 <= operand2
    elif comparator == '==':
        return operand1 == operand2
    else:
        return operand1 != operand2


def check_conditions(conditions, variables):
    outerExp = True
    for conditionSet in conditions:
        innerExp = []

        for condition in conditionSet:
            operand1 = variables["primary"][condition["variable_name"]
                                            ]["value"] if condition["variable_name"] in variables["primary"] else variables["derived"][condition["variable_name"]]["value"]
            operand2 = condition["condition_value"]
            comparator = condition["comparator"]

            compRes = perform_comparison(operand1, operand2, comparator)
            innerExp.append(str(compRes))

            if condition["logical_operator"] != "":
                innerExp.append(condition["logical_operator"])

        innerExp = " ".join(innerExp)

        outerExp = outerExp or eval(innerExp)
    return outerExp
