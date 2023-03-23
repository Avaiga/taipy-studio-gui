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

import { RuleCore } from "markdown-it/lib/parser_core";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";
import { PLUGIN_NAME } from "./constant";
import MarkdownIt from "markdown-it";
import { buildEmptyTaipyElement, CLOSING_TAG_RE, CONTROL_RE, OPENING_TAG_RE, processElement } from "../gui/diagnostics";
import { parseMockData } from "./utils";

const REPLACE_CONTROL_RE = RegExp(CONTROL_RE, "g");
const REPLACE_OPENING_TAG_RE = RegExp(OPENING_TAG_RE, "g");
const REPLACE_CLOSING_TAG_RE = RegExp(CLOSING_TAG_RE, "g");
const parsedPropertyList = ["defaultValue", "lov", "value"];

const getTaipyReplace = (md: MarkdownIt) => {
    const arrayReplaceAt = md.utils.arrayReplaceAt;
    const taipyReplace: RuleCore = (state: StateCore) => {
        const tokens: Token[] = state.tokens;
        const tagQueue: string[] = [];
        for (let j = 0; j < tokens.length; j++) {
            if (tokens[j].type !== "inline") {
                if (
                    tagQueue.length > 0 &&
                    (tokens[j].type === "paragraph_open" || tokens[j].type === "paragraph_close")
                ) {
                    tokens.splice(j, 1);
                    j--;
                }
                continue;
            }
            const childTokens: Token[] = tokens[j].children || [];
            for (let i = 0; i < childTokens.length; i++) {
                const token: Token = childTokens[i];
                if (token.type === "text") {
                    const openingTagSearch = OPENING_TAG_RE.exec(token.content);
                    if (openingTagSearch) {
                        let element = buildEmptyTaipyElement();
                        element.type = "part";
                        const openingTagProperty = openingTagSearch[2];
                        if (openingTagProperty) {
                            const [_, e] = processElement(openingTagProperty);
                            element = e;
                        }
                        tokens[j].children = arrayReplaceAt(
                            childTokens,
                            i,
                            getOpeningToken(token.content, state.Token),
                        );
                        tagQueue.push(element.type);
                        continue;
                    }
                    if (CONTROL_RE.test(token.content)) {
                        tokens[j].children = arrayReplaceAt(
                            childTokens,
                            i,
                            getControlToken(token.content, state.Token),
                        );
                        continue;
                    }
                    if (CLOSING_TAG_RE.exec(token.content)) {
                        tokens[j].children = arrayReplaceAt(
                            childTokens,
                            i,
                            getClosingToken(token.content, tagQueue.pop() || "part", state.Token),
                        );
                    }
                }
            }
        }
    };
    return taipyReplace;
};

export const getTokenAttribute = (name: string, value: string): [string, string] => {
    if (parsedPropertyList.includes(name)) {
        return [name, parseMockData(value)];
    }
    return [name, value];
};

const getOpeningToken = (content: string, tokenClass: typeof Token): Token[] => {
    let tokenNodes: Token[] = [],
        lastPos = 0;
    content.replace(REPLACE_OPENING_TAG_RE, (match: string, offset: number): string => {
        const regexMatchResult = OPENING_TAG_RE.exec(match);
        if (offset > lastPos) {
            let token = new tokenClass("text", "", 0);
            token.content = content.slice(lastPos, offset);
            tokenNodes.push(token);
        }
        const [_, e] = processElement(regexMatchResult?.at(2) || match);
        let token = new tokenClass(PLUGIN_NAME, "", 1);
        token.block = true;
        token.markup = regexMatchResult?.at(2) || match;
        token.tag = e.type === "text" ? "part" : e.type;
        token.attrs = e.properties.map((v) => getTokenAttribute(v.name, v.value));
        token.attrPush(getTokenAttribute("defaultValue", e.value));
        tokenNodes.push(token);
        lastPos = offset + match.length;
        return match;
    });
    if (lastPos < content.length) {
        let token = new tokenClass("text", "", 0);
        token.content = content.slice(lastPos);
        tokenNodes.push(token);
    }
    return tokenNodes;
};

const getControlToken = (content: string, tokenClass: typeof Token): Token[] => {
    let tokenNodes: Token[] = [],
        lastPos = 0;
    content.replace(REPLACE_CONTROL_RE, (match: string, offset: number): string => {
        const regexMatchResult = CONTROL_RE.exec(match);
        if (offset > lastPos) {
            let token = new tokenClass("text", "", 0);
            token.content = content.slice(lastPos, offset);
            tokenNodes.push(token);
        }
        const [_, e] = processElement(regexMatchResult?.at(1) || match);
        let token = new tokenClass(PLUGIN_NAME, "", 0);
        token.markup = regexMatchResult?.at(1) || match;
        token.tag = e.type;
        token.nesting = 0;
        token.attrs = e.properties.map((v) => getTokenAttribute(v.name, v.value));
        token.attrPush(getTokenAttribute("defaultValue", e.value));
        tokenNodes.push(token);
        lastPos = offset + match.length;
        return match;
    });
    if (lastPos < content.length) {
        let token = new tokenClass("text", "", 0);
        token.content = content.slice(lastPos);
        tokenNodes.push(token);
    }
    return tokenNodes;
};

const getClosingToken = (content: string, tag: string, tokenClass: typeof Token): Token[] => {
    let tokenNodes: Token[] = [],
        lastPos = 0;
    content.replace(REPLACE_CLOSING_TAG_RE, (match: string, offset: number): string => {
        if (offset > lastPos) {
            let token = new tokenClass("text", "", 0);
            token.content = content.slice(lastPos, offset);
            tokenNodes.push(token);
        }
        let token = new tokenClass(PLUGIN_NAME, "", -1);
        token.markup = match;
        token.block = true;
        token.tag = tag;
        tokenNodes.push(token);
        lastPos = offset + match.length;
        return match;
    });
    if (lastPos < content.length) {
        let token = new tokenClass("text", "", 0);
        token.content = content.slice(lastPos);
        tokenNodes.push(token);
    }
    return tokenNodes;
};

export default getTaipyReplace;
