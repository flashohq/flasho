import dotenv
import os
from dotenv import load_dotenv


def set_env_variable(key, value):
    dotenv_file = dotenv.find_dotenv()
    dotenv.load_dotenv(dotenv_file)
    dotenv.set_key(dotenv_file, key, value)
    load_dotenv(override=True)


def delete_env_variable(key):
    # print(key, "\n")
    os.environ.pop(key)
    dotenv_file = dotenv.find_dotenv()
    with open(dotenv_file, "r") as fp:
        lines = fp.readlines()
        # print(lines, "\n")
    with open(dotenv_file, "w") as fp:
        for line in lines:
            if not line.strip("\n").startswith(key):
                fp.write(line)
                # print(line)
