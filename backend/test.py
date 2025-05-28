import os
import pytest

"""
This script is used to run pytest when executing this script.
"""


def main():
    print("Hello, World!")

    # set env TEST=True
    os.environ["TEST"] = "True"
    pytest.main(["-v", ".", "--show-capture=all"])


if __name__ == "__main__":
    main()
