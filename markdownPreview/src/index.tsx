/*
 * Copyright 2023 Avaiga Private Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { createRoot } from "react-dom/client";
import App from "./components/App";

function init() {
    const newDiv = document.createElement("div", {});
    newDiv.setAttribute("id", "root");
    var innerHTML = document.body.innerHTML;
    document.body.innerHTML = "";
    document.body.appendChild(newDiv);
    const container = document.getElementById("root");
    if (container) {
        const root = createRoot(container);
        root.render(<App jsx={innerHTML} />);
    }
}

window.addEventListener("vscode.markdown.updateContent", init);

init();