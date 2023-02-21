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
import { processElement } from "../gui/diagnostics";
import { parseMockData } from "./utils";

const CONTROL_RE = /<\|(.*?)\|>/;
const REPLACE_CONTROL_RE = RegExp(CONTROL_RE, "g");

const getTaipyReplace = (md: MarkdownIt) => {
    const arrayReplaceAt = md.utils.arrayReplaceAt;
    const taipyReplace: RuleCore = (state: StateCore) => {
        const tokens: Token[] = state.tokens;
        for (let j = 0; j < tokens.length; j++) {
            if (tokens[j].type !== "inline") {
                continue;
            }
            const childTokens: Token[] = tokens[j].children || [];
            if (childTokens.length === 0) {
                continue;
            }
            for (let i = 0; i < childTokens.length; i++) {
                const token: Token = childTokens[i];
                if (token.type === "text" && CONTROL_RE.test(token.content)) {
                    // replace current token (inline) with Taipy Gui tokens
                    tokens[j].children = arrayReplaceAt(childTokens, i, getTaipyToken(token.content, state.Token));
                }
            }
        }
    };
    return taipyReplace;
};

const getTaipyToken = (content: string, tokenClass: typeof Token): Token[] => {
    let tokenNodes: Token[] = [],
        lastPos = 0;
    content.replace(REPLACE_CONTROL_RE, (match: string, offset: number): string => {
        const regexMatchResult = CONTROL_RE.exec(match);
        if (offset > lastPos) {
            let token = new tokenClass("text", "", 0);
            token.content = content.slice(lastPos, offset);
            tokenNodes.push(token);
        }
        const [d, e] = processElement(regexMatchResult?.at(1) || match);
        let token = new tokenClass(PLUGIN_NAME, "", 0);
        token.markup = regexMatchResult?.at(1) || match;
        token.tag = e.type;
        token.attrs = e.properties.map((v) => [v.name, v.value]);
        token.attrPush(["defaultValue", parseMockData(e.value)]);
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
