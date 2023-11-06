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
import { exec } from "child_process";
import { existsSync, readFileSync } from "fs";
import { DocumentFilter, l10n, workspace } from "vscode";

import { CONFIG_NAME } from "./constant";
import { ElementProvider } from "./elementProvider";
import { getLog } from "./logging";

export const countChar = (str: string, char: string): number => {
    return str.split(char).length - 1;
};

export interface VisualElements {
    blocks?: [string, ElementDetail][];
    controls?: [string, ElementDetail][];
    undocumented?: [string, ElementDetail][];
}

interface ElementDetail {
    properties?: ElementProperty[];
    inherits?: string[];
}

export interface ElementProperty {
    name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    default_property?: any;
    type: string;
    doc: string;
    signature?: [string, string][];
}

// visual elements parser
export const getElementProperties = (
    visualElements: VisualElements,
): Record<string, Record<string, ElementProperty>> => {
    const blocks: Record<string, ElementDetail> = (visualElements["blocks"] || []).reduce(
        (obj: Record<string, ElementDetail>, v: any) => {
            obj[v[0]] = v[1];
            return obj;
        },
        {} as Record<string, ElementDetail>,
    );
    const controls: Record<string, ElementDetail> = (visualElements["controls"] || []).reduce(
        (obj: Record<string, ElementDetail>, v: any) => {
            obj[v[0]] = v[1];
            return obj;
        },
        {} as Record<string, ElementDetail>,
    );
    const undocumented: Record<string, ElementDetail> = (visualElements["undocumented"] || []).reduce(
        (obj: Record<string, ElementDetail>, v: any) => {
            obj[v[0]] = v[1];
            return obj;
        },
        {} as Record<string, ElementDetail>,
    );
    const blocksProperties: Record<string, Record<string, ElementProperty>> = {};
    const controlsProperties: Record<string, Record<string, ElementProperty>> = {};
    // handle all blocks object
    Object.keys(blocks).forEach((v: string) => {
        let elementDetail: ElementDetail = blocks[v];
        blocksProperties[v] = getElementDetailProperties(elementDetail, blocks, controls, undocumented);
    });
    Object.keys(controls).forEach((v: string) => {
        let elementDetail: ElementDetail = controls[v];
        controlsProperties[v] = getElementDetailProperties(elementDetail, blocks, controls, undocumented);
    });
    return { ...blocksProperties, ...controlsProperties };
};

export const getBlockElementList = (visualElements: VisualElements): string[] => {
    return (visualElements["blocks"] || []).map((v: any) => v[0] as string);
};

export const getControlElementList = (visualElements: VisualElements): string[] => {
    return (visualElements["controls"] || []).map((v: any) => v[0] as string);
};

export const getElementList = (visualElements: VisualElements): string[] => {
    return [...getControlElementList(visualElements), ...getBlockElementList(visualElements)];
};

export const parseProperty = (property: ElementProperty): string => {
    return `[${property.type}]${property.default_property ? "(" + property.default_property.toString() + ")" : ""}: ${
        property.doc
    }`;
};

const parsePropertyList = (propertyList: ElementProperty[] | undefined): Record<string, ElementProperty> => {
    if (!propertyList) {
        return {};
    }
    return propertyList.reduce((obj: Record<string, ElementProperty>, v: ElementProperty) => {
        obj[v.name] = v;
        return obj;
    }, {} as Record<string, ElementProperty>);
};

const handleElementDetailInherits = (
    inherits: string[] | undefined,
    blocks: Record<string, ElementDetail>,
    controls: Record<string, ElementDetail>,
    undocumented: Record<string, ElementDetail>,
): Record<string, ElementProperty> => {
    let properties: Record<string, ElementProperty> = {};
    if (!inherits) {
        return properties;
    }
    inherits.forEach((v) => {
        let elementDetail: ElementDetail;
        if (v in undocumented) {
            elementDetail = undocumented[v];
        } else if (v in controls) {
            elementDetail = controls[v];
        } else {
            elementDetail = blocks[v];
        }
        properties = { ...properties, ...getElementDetailProperties(elementDetail, blocks, controls, undocumented) };
    });
    return properties;
};

const getElementDetailProperties = (
    elementDetail: ElementDetail,
    blocks: Record<string, ElementDetail>,
    controls: Record<string, ElementDetail>,
    undocumented: Record<string, ElementDetail>,
): Record<string, ElementProperty> => {
    return {
        ...parsePropertyList(elementDetail.properties),
        ...handleElementDetailInherits(elementDetail.inherits, blocks, controls, undocumented),
    };
};

export const getOnFunctionList = (elementProperties: Record<string, Record<string, ElementProperty>>): string[] => {
    const onFunctionList = new Set<string>();
    for (const key in elementProperties) {
        const elementProperty = elementProperties[key];
        for (const k in elementProperty) {
            if (k.startsWith("on_")) {
                onFunctionList.add(k);
            }
        }
    }
    return [...onFunctionList];
};

export const getOnFunctionSignature = (
    elementProperties: Record<string, Record<string, ElementProperty>>,
): Record<string, [string, string][]> => {
    const onFunctionRecord: Record<string, [string, string][]> = {};
    for (const key in elementProperties) {
        const elementProperty = elementProperties[key];
        for (const k in elementProperty) {
            if (k.startsWith("on_")) {
                const elements = elementProperty[k];
                onFunctionRecord[k] = elements["signature"] || [["state", "State"]];
            }
        }
    }
    return onFunctionRecord;
};

export const generateOnFunction = (signature: [string, string][], functionName: string): string => {
    return `def ${functionName}(${signature.map((v) => v[0]).join(", ")}):\n    pass\n`;
};

export const markdownDocumentFilter: DocumentFilter = { language: "markdown" };
export const pythonDocumentFilter: DocumentFilter = { language: "python" };

export const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        exec(cmd, (err, out) => {
            if (err) {
                getLog().error(l10n.t("Find element descriptor files: "), err.message || err);
                return reject(err);
            }
            return resolve(out);
        });
    });

export const getElementFilePaths = (): string[] => {
    const config = workspace.getConfiguration(CONFIG_NAME);
    if (config.has("elementsFilePaths") && config.get("elementsFilePaths")) {
        let filePaths = config.get("elementsFilePaths") as string[];
        filePaths = filePaths.filter((v) => existsSync(v));
        updateFilePaths(filePaths);
        return filePaths;
    }
    return [];
};

export const updateFilePaths = (paths: string[]) => {
    const config = workspace.getConfiguration(CONFIG_NAME);
    config.update("elementsFilePaths", paths);
    ElementProvider.invalidateCache();
};

export const getElementsFromFile = (path: string): VisualElements | undefined => {
    try {
        const content = readFileSync(path, { encoding: "utf8", flag: "r" });
        const elements = JSON.parse(content);
        return elements as VisualElements;
    } catch (error: any) {
        getLog().error(l10n.t("Parse element descriptor files: "), error.message || error);
        return undefined;
    }
};

export const getElementsFromFiles = (paths: string[]): VisualElements | undefined => {
    let visualElements = getEmptyVisualElements();
    if (paths.length === 0) {
        return undefined;
    }
    let registeredPathCount = 0;
    for (const path of paths) {
        const elements = getElementsFromFile(path);
        if (elements) {
            registeredPathCount++;
            // Merge all elements with visual elements, checking for duplicates on the first item of each element
            visualElements = mergeElements(visualElements, elements, "blocks");
            visualElements = mergeElements(visualElements, elements, "controls");
            visualElements = mergeElements(visualElements, elements, "undocumented");
        }
    }
    if (registeredPathCount === 0) {
        return undefined;
    }
    return visualElements;
};

const mergeElements = (
    basedVisualElements: VisualElements,
    newVisualElements: VisualElements,
    section: keyof VisualElements,
): VisualElements => {
    const basedElements = basedVisualElements[section] || [];
    const newElements = newVisualElements[section] || [];
    const mergedElements = newElements.filter((v) => !basedElements.map((v) => v[0]).includes(v[0]));
    return { ...basedVisualElements, [section]: [...basedElements, ...mergedElements] };
};

export const getEmptyVisualElements = (): VisualElements => {
    return { blocks: [], controls: [], undocumented: [] };
};
