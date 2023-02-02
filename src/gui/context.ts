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

import { ExtensionContext } from "vscode";
import { MarkdownActionProvider } from "./codeAction";
import { GenerateGuiCommand, FindElementsFileCommand } from "./command";
import { GuiCompletionItemProvider } from "./completion";
import { registerDiagnostics } from "./diagnostics";

export class GuiContext {
    static register(vsContext: ExtensionContext): void {
        new GuiContext(vsContext);
    }

    private constructor(readonly context: ExtensionContext) {
        registerDiagnostics(context);
        GuiCompletionItemProvider.register(context);
        GenerateGuiCommand.register(context);
        FindElementsFileCommand.register(context);
        MarkdownActionProvider.register(context);
    }
}
