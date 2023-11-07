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
import {
    defaultBlockElementList,
    defaultControlElementList,
    defaultElementList,
    defaultElementProperties,
    defaultOnFunctionList,
    defaultOnFunctionSignature,
} from "./constant";
import {
    ElementProperty,
    VisualElements,
    getBlockElementList,
    getControlElementList,
    getElementFilePaths,
    getElementList,
    getElementProperties,
    getElementsFromFiles,
    getOnFunctionList,
    getOnFunctionSignature,
} from "./utils";

export class ElementProvider {
    private static elementCache: Record<string, any> = {};

    public static getElementProperties(): Record<string, Record<string, ElementProperty>> {
        return ElementProvider.resolve("elementProperties", defaultElementProperties, getElementProperties);
    }

    public static getElementList(): string[] {
        return ElementProvider.resolve("elementList", defaultElementList, getElementList);
    }

    public static getControlElementList(): string[] {
        return ElementProvider.resolve("controlElementList", defaultControlElementList, getControlElementList);
    }

    public static getBlockElementList(): string[] {
        return ElementProvider.resolve("blockElementList", defaultBlockElementList, getBlockElementList);
    }

    public static getOnFunctionList(): string[] {
        const filePaths = getElementFilePaths();
        if (filePaths.length === 0) {
            return defaultOnFunctionList;
        }
        return getOnFunctionList(ElementProvider.getElementProperties());
    }

    public static getOnFunctionSignature(): Record<string, [string, string][]> {
        const filePaths = getElementFilePaths();
        if (filePaths.length === 0) {
            return defaultOnFunctionSignature;
        }
        return getOnFunctionSignature(ElementProvider.getElementProperties());
    }

    public static invalidateCache() {
        ElementProvider.elementCache = {};
    }

    private static resolve(
        propertyName: string,
        defaultValue: any,
        elementsAnalyzer: (visualElements: VisualElements) => any,
    ) {
        const filePaths = getElementFilePaths();
        if (filePaths.length === 0) {
            return defaultValue;
        }
        if (propertyName in ElementProvider.elementCache) {
            return ElementProvider.elementCache[propertyName];
        }
        const visualElements = ElementProvider.elementCache["visualElements"] || getElementsFromFiles(filePaths);
        if (!visualElements) {
            return defaultValue;
        }
        if (!(propertyName in ElementProvider.elementCache)) {
            ElementProvider.elementCache.visualElements = visualElements;
        }
        const result = elementsAnalyzer(visualElements);
        ElementProvider.elementCache[propertyName] = result;
        return result;
    }
}
