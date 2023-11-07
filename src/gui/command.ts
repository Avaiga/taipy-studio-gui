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
import { join } from "path";
import { ExtensionContext, ProgressLocation, WorkspaceEdit, commands, l10n, window, workspace } from "vscode";

import { ElementProvider } from "./elementProvider";
import { getLog } from "./logging";
import { countChar, execShell, parseProperty, updateFilePaths } from "./utils";

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
            commands.registerCommand("taipy.gui.md.generate", GenerateGuiCommand.handleGenerateElementCommand),
        );
    }

    private static async handleGenerateElementCommand() {
        const result = await window.showQuickPick(ElementProvider.getElementList(), {
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
        const elementProperties = ElementProvider.getElementProperties();
        const propertyObject = elementProperties[guiElement.elementName as keyof typeof elementProperties];
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
        window.showInformationMessage(l10n.t("Visual Element added"));
    }
}

export class FindElementsFileCommand {
    static register(vsContext: ExtensionContext): void {
        new FindElementsFileCommand(vsContext);
    }

    private constructor(readonly context: ExtensionContext) {
        context.subscriptions.push(
            commands.registerCommand("taipy.gui.md.findElementFile", FindElementsFileCommand.commandEntry),
        );
    }

    private static async commandEntry() {
        let pythonPath = "";
        try {
            pythonPath = await commands.executeCommand(
                "python.interpreterPath",
                workspace.workspaceFolders?.map(({ uri }) => uri.fsPath),
            );
        } catch (error: any) {
            getLog().info(l10n.t("Find element descriptor files: "), error.message || error);
        }
        pythonPath = pythonPath || workspace.getConfiguration("python").get("defaultInterpreterPath", "python");
        window.withProgress(
            {
                location: ProgressLocation.Notification,
                cancellable: false,
                title: l10n.t("Finding visual element descriptor files"),
            },
            async (_progress) => {
                try {
                    const execResult = await execShell(
                        `${pythonPath} ${join(__dirname, "assets", "find_element_file.py")}`,
                    );
                    if (execResult.startsWith("Path: ")) {
                        updateFilePaths(execResult.substring(6).split(";;;"));
                        window.showInformationMessage(
                            l10n.t("Visual element descriptor files was found and updated in workspace settings"),
                        );
                    } else if (execResult) {
                        window.showErrorMessage(execResult);
                    } else {
                        window.showErrorMessage(
                            l10n.t("Can't find visual element descriptor files with the selected environment"),
                        );
                    }
                } catch (error: any) {
                    getLog().error(l10n.t("Find element descriptor files: "), error.message || error);
                    window.showErrorMessage(
                        l10n.t("Can't find visual element descriptor files with the selected environment"),
                    );
                }
            },
        );
    }
}
