from importlib import util
import inspect
import os

if util.find_spec("taipy") and util.find_spec("taipy.gui"):
    from taipy.gui import Gui

    taipy_path = f"{os.path.dirname(os.path.dirname(inspect.getfile(Gui)))}"
    potential_file_paths = [
        f"{taipy_path}{os.sep}gui{os.sep}viselements.json",
        f"{taipy_path}{os.sep}gui_core{os.sep}viselements.json",
    ]
    if potential_file_paths := [
        path for path in potential_file_paths if os.path.exists(path)
    ]:
        print(f"Path: {';;;'.join(potential_file_paths)}")
    else:
        print("Visual element descriptor files not found in taipy-gui package")
else:
    print("taipy-gui package is not installed within the selected python environment")
