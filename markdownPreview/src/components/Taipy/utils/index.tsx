/*
 * Copyright 2024 Avaiga Private Limited
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

export interface LovProps {
    lov?: string;
}
const RE_ONLY_NUMBERS = /^\d+(\.\d*)?$/;
export const getCssSize = (val: string | number) => {
    if (typeof val === "number") {
        return "" + val + "px";
    } else {
        val = val.trim();
        if (RE_ONLY_NUMBERS.test(val)) {
            return val + "px";
        }
    }
    return val;
};
