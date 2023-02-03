from importlib import util
import inspect
import os

if util.find_spec("taipy") and util.find_spec("taipy.gui"):
    from taipy.gui import Gui
    element_file_path = f"{os.path.dirname(inspect.getfile(Gui))}{os.sep}webapp{os.sep}viselements.json"
    if os.path.exists(element_file_path):
        print(f"Path: {element_file_path}")
    else:
        print("Visual element descriptors file not found in taipy-gui package")
else:
    print("taipy-gui package is not installed within the selected python environment")
