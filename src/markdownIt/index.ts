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
import { PluginSimple } from "markdown-it";

import { PLUGIN_NAME } from "./constant";
import renderRule from "./renderRule";
import ruleCoreGenerator from "./ruleCore";

const markdownItPlugin: PluginSimple = (md) => {
    // parse inline data to Taipy Gui tokens
    md.core.ruler.after("linkify", PLUGIN_NAME, ruleCoreGenerator(md));
    // rules to be executed when Taipy Gui token is found
    md.renderer.rules[PLUGIN_NAME] = renderRule;
};

export default markdownItPlugin;
