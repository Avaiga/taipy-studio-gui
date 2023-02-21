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

import { ComponentType } from "react";
import JsxParser from "react-jsx-parser";
import Input from "./Taipy/Input";
import { renderError, unregisteredRender } from "./Taipy/Unregistered";

interface AppProps {
    jxs: string;
}

export const JSXSupportedComponent: Record<string, unknown> = {
    taipyinput: Input,
};

const App = (props: AppProps) => {
    const { jxs } = props;
    return (
        <>
            <p>{jxs}</p>
            <JsxParser
                disableKeyGeneration={true}
                components={JSXSupportedComponent as Record<string, ComponentType>}
                jsx={jxs}
                renderUnrecognized={unregisteredRender}
                allowUnknownElements={false}
                renderError={renderError}
                blacklistedAttrs={[]}
            />
        </>
    );
};

export default App;
