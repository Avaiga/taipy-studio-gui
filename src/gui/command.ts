/*
 * Copyright 2022 Avaiga Private Limited
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

import { commands, ExtensionContext, l10n, window, workspace, WorkspaceEdit } from "vscode";
import { defaultElementList, defaultElementProperties } from "./constant";
import { countChar, parseProperty } from "./utils";

interface GuiElement {
    elementName: string;
    elementValue: string;
    propertyList: string[];
}

export class GenerateGuiCommand {
    static register(vsContext: ExtensionContext): void {
        new GenerateGuiCommand(vsContext);
    }

    private constructor(readonly context: ExtensionContext) {
        context.subscriptions.push(
            commands.registerCommand("taipy.gui.md.generate", GenerateGuiCommand.handleGenerateElementCommand)
        );
    }

    private static async handleGenerateElementCommand() {
        const result = await window.showQuickPick(defaultElementList, {
            placeHolder: l10n.t("Select an element type"),
        });
        if (result === undefined) {
            return;
        }
        let guiElement: GuiElement = { elementName: result || "", elementValue: "", propertyList: [] };
        await GenerateGuiCommand.handleElementNameSelection(guiElement);
    }

    private static async handleElementNameSelection(guiElement: GuiElement) {
        const result = await window.showInputBox({
            placeHolder: l10n.t("Enter element value"),
            validateInput: (text) => {
                if (countChar(text, "{") !== countChar(text, "}")) {
                    return l10n.t("Unmatched number of curly braces for expression");
                }
                return null;
            },
        });
        if (result === undefined) {
            return;
        }
        guiElement.elementValue = result || "";
        await GenerateGuiCommand.handleElementPropertySelection(guiElement);
    }

    private static async handleElementPropertySelection(guiElement: GuiElement) {
        const quickPick = window.createQuickPick();
        const propertyObject = defaultElementProperties[guiElement.elementName as keyof typeof defaultElementProperties];
        if (Object.keys(propertyObject).length === 0) {
            GenerateGuiCommand.addGuiElement(guiElement);
            return;
        }
        quickPick.items = Object.keys(propertyObject).map((label) => ({
            label,
            detail: parseProperty(propertyObject[label as keyof typeof propertyObject]),
        }));
        quickPick.canSelectMany = true;
        quickPick.title = l10n.t("Select properties for element '{0}'", guiElement.elementName);
        quickPick.onDidAccept(() => {
            guiElement.propertyList = quickPick.selectedItems.map((v) => v.label);
            quickPick.dispose();
            GenerateGuiCommand.addGuiElement(guiElement);
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }

    private static addGuiElement(guiElement: GuiElement) {
        let propertyList: string[] = [];
        guiElement.elementValue && propertyList.push(guiElement.elementValue);
        propertyList = [...propertyList, guiElement.elementName, ...guiElement.propertyList];
        const elementString = `<|${propertyList.join("|")}|>`;
        const edit = new WorkspaceEdit();
        let activeEditor = window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        edit.insert(activeEditor?.document.uri, activeEditor?.selection.active, elementString);
        workspace.applyEdit(edit);
        window.showInformationMessage(l10n.t("Element added"));
    }
}
