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
import { parse as csvParse } from "csv-parse/sync";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { l10n, workspace } from "vscode";

import { getLog } from "../gui/logging";
import { CSV_DELIMITER, DATA_FILE_TYPES } from "./constant";

export const camelize = (text: string): string => {
    return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
        if (p2) {
            return p2.toUpperCase();
        }
        return p1.toLowerCase();
    });
};

export const parseMockData = (value: string): string => {
    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
        return value;
    }
    const basePath = workspace.workspaceFolders[0].uri.fsPath;
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
        if (!mockContent) {
            return value;
        }
        const mockData = mockContent as Record<string, any>;
        for (const [k, v] of Object.entries(mockData)) {
            const searchString = `{${k}}`;
            if (!value.includes(searchString)) {
                continue;
            }
            let replaceData: string = v;
            if (typeof v === "object") {
                replaceData = encodeURIComponent(JSON.stringify(v));
            } else if (typeof v === "string") {
                const potentialDataFile = path.join(basePath, v);
                if (existsSync(potentialDataFile) && DATA_FILE_TYPES.some((v) => potentialDataFile.endsWith(v))) {
                    const dataFileContent = readFileSync(potentialDataFile, {
                        encoding: "utf8",
                        flag: "r",
                    });
                    if (potentialDataFile.endsWith("json")) {
                        replaceData = encodeURIComponent(dataFileContent);
                    }
                    if (potentialDataFile.endsWith("csv")) {
                        try {
                            const csvParsedData = csvParse(dataFileContent, { delimiter: CSV_DELIMITER }) as any[];
                            replaceData = encodeURIComponent(JSON.stringify(parseCsvJson(csvParsedData)));
                        } catch (error) {}
                    }
                }
            }
            const escapedSearchString = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            value = value.replace(new RegExp(escapedSearchString, "g"), replaceData);
        }
    } catch (error: any) {
        getLog().error(l10n.t("Parse mock data file: "), error.message || error);
    }
    return value;
};

const parseCsvJson = (csvData: any[]) => {
    const header: string[] = csvData[0];
    const data = csvData.slice(1);
    return data.map((v) =>
        v.reduce((a: Record<string, any>, c: string, i: number) => {
            a[header[i]] = c;
            return a;
        }, {} as Record<string, any>),
    );
};
