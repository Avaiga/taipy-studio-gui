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

import { l10n, window, workspace } from "vscode";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { getLog } from "../gui/logging";

// export const camelize = (text: string): string => {
//     const a = text.toLowerCase().replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
//     return a.substring(0, 1).toLowerCase() + a.substring(1);
// };

export const camelize = (text: string): string => {
    return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
        if (p2) {
            return p2.toUpperCase();
        }
        return p1.toLowerCase();
    });
};

export const parseMockData = (value: string): string => {
    if (
        !window.activeTextEditor?.document &&
        (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0)
    ) {
        return value;
    }
    const basePath = window.activeTextEditor?.document
        ? path.dirname(window.activeTextEditor.document.uri.fsPath)
        : workspace.workspaceFolders
        ? workspace.workspaceFolders[0].uri.fsPath
        : null;
    if (!basePath) {
        return value;
    }
    // const potentialMockFile = path.join(basePath, path.parse(document.fileName).name + ".mock.json");
    const potentialMockFile = path.join(basePath, "taipy.mock.json");
    if (!existsSync(potentialMockFile)) {
        return value;
    }
    try {
        const content = readFileSync(potentialMockFile, {
            encoding: "utf8",
            flag: "r",
        });
        const mockContent = JSON.parse(content);
        if (!mockContent?.data) {
            return value;
        }
        const mockData = mockContent as Record<string, string>;
        for (const [k, v] of Object.entries(mockData)) {
            const searchString = `{${k}}`;
            if (value.includes(searchString)) {
                let replaceString = v;
                const potentialDataFile = path.join(basePath, v);
                if (existsSync(potentialDataFile)) {
                    const dataFileContent = readFileSync(potentialDataFile, {
                        encoding: "utf8",
                        flag: "r",
                    });
                    replaceString = encodeURIComponent(dataFileContent);
                }
                value = value.replace(new RegExp(searchString, "g"), replaceString);
            }
        }
    } catch (error: any) {
        getLog().error(l10n.t("Parse mock data file: "), error.message || error);
    }
    return value;
};
