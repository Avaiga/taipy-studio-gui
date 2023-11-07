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

const init = () => {
    let allElements = Array.from(document.querySelectorAll("*"));
    // Checks if the markdown contains any taipy elements
    if (!allElements.some((el) => el.tagName.toLowerCase().startsWith("taipy"))) {
        return;
    }
    const mdbd = document.getElementsByClassName("markdown-body");
    const markdownBodyHTML = mdbd[mdbd.length - 1].outerHTML;
    mdbd[mdbd.length - 1].remove();
    const baseHref = (document.querySelector("base") || {}).href || "";
    let rootDiv = document.querySelector("#root");
    if (!rootDiv) {
        rootDiv = document.createElement("div", {});
        rootDiv.setAttribute("id", "root");
        document.body.appendChild(rootDiv);
    }
    rootDiv.innerHTML = "";
    const root = createRoot(rootDiv);
    root.render(<App jsx={formatHtmlBody(markdownBodyHTML)} baseHref={baseHref} />);
};

// Regular expression to find curly braces outside of HTML tags
const replaceCurlyBracesRegex = /(?:\{[^}]*\})(?![^<]*>)/g;
const replaceCurlyBraces = (match: string) => {
    return match.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
};
const formatHtmlBody = (html: string) => {
    return html.replace(replaceCurlyBracesRegex, replaceCurlyBraces);
};

window.addEventListener("vscode.markdown.updateContent", init);

init();
