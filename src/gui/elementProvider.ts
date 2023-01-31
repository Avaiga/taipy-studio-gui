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
    getBlockElementList,
    getControlElementList,
    getElementFile,
    getElementFilePath,
    getElementList,
    getElementProperties,
    getOnFunctionList,
    getOnFunctionSignature,
} from "./utils";

export class ElementProvider {
    private static elementCache: Record<string, Record<string, any>> = {};

    public static getElementProperties(): Record<string, Record<string, ElementProperty>> {
        return this.resolve("elementProperties", defaultElementProperties, getElementProperties);
    }

    public static getElementList(): string[] {
        return this.resolve("elementList", defaultElementList, getElementList);
    }

    public static getControlElementList(): string[] {
        return this.resolve("controlElementList", defaultControlElementList, getControlElementList);
    }

    public static getBlockElementList(): string[] {
        return this.resolve("blockElementList", defaultBlockElementList, getBlockElementList);
    }

    public static getOnFunctionList(): string[] {
        const filePath = getElementFilePath();
        if (filePath === null) {
            return defaultOnFunctionList;
        }
        return getOnFunctionList(this.getElementProperties());
    }

    public static getOnFunctionSignature(): Record<string, [string, string][]> {
        const filePath = getElementFilePath();
        if (filePath === null) {
            return defaultOnFunctionSignature;
        }
        return getOnFunctionSignature(this.getElementProperties());
    }

    private static resolve(propertyName: string, defaultValue: any, elementsAnalyzer: (viselements: object) => any) {
        const filePath = getElementFilePath();
        if (filePath === null) {
            return defaultValue;
        }
        if (this.elementCache[filePath] === undefined) {
            this.elementCache[filePath] = {};
        }
        if (propertyName in this.elementCache[filePath]) {
            return this.elementCache[filePath][propertyName];
        }
        const visualElements = this.elementCache[filePath]["visualElements"] || getElementFile(filePath);
        if (!visualElements) {
            return defaultValue;
        }
        if (!(propertyName in this.elementCache[filePath])) {
            this.elementCache[filePath].visualElements = visualElements;
        }
        const result = elementsAnalyzer(visualElements);
        this.elementCache[filePath][propertyName] = result;
        return result;
    }
}
