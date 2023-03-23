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
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

interface InputProps {
    defaultvalue: string;
    label: string;
}
const Number = (props: InputProps) => {
    const [value, setValue] = useState(parseInt(props.defaultvalue) || 0);
    return (
        <Tooltip title={"Input"}>
            <TextField
                margin="dense"
                hiddenLabel
                value={value}
                label={props.label}
                type={"number"}
                onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                // multiline={multiline}
                // minRows={linesShown}
            />
        </Tooltip>
    );
};

export default Number;
