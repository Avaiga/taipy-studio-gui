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

import {
    getBlockElementList,
    getControlElementList,
    getElementFile,
    getElementList,
    getElementProperties,
    getOnFunctionList,
    getOnFunctionSignature,
} from "./utils";

const visualElements = getElementFile(join(__dirname, "assets", "viselements.json")) || {};

// object of all elements each with all of its properties
export const defaultElementProperties = getElementProperties(visualElements);

// Include control and block elements
export const defaultElementList = getElementList(visualElements);

export const defaultControlElementList = getControlElementList(visualElements);

export const defaultBlockElementList = getBlockElementList(visualElements);

export const defaultOnFunctionList = getOnFunctionList(defaultElementProperties);

export const defaultOnFunctionSignature = getOnFunctionSignature(defaultElementProperties);

export enum LanguageId {
    py = "python",
    md = "markdown",
}

export const CONFIG_NAME = "taipyStudio.gUI";
