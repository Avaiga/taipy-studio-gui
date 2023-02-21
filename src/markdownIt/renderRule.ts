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

import { RenderRule } from "markdown-it/lib/renderer";
import Token from "markdown-it/lib/token";

const renderRule: RenderRule = (tokens: Token[], idx: number): string => {
    const token = tokens[idx];
    const htmlString = `<Taipy.${token.tag} ${token.attrs?.map((v) => v[0] + "='" + v[1] + "'").join(" ")}/>`;
    console.log(token);
    console.log(htmlString);
    return htmlString;
};

export default renderRule;
