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
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { MouseEvent, useState } from "react";

import ThemeToggle from "./ThemeToggle";
import { parseBooleanProperty } from "./utils/booleanUtils";
import { IconAvatar } from "./utils/icon";
import { LovProps } from "./utils/lov";
import { LovItem, getLov } from "./utils/lov";

const groupSx = { verticalAlign: "middle" };

interface ToggleProps extends LovProps {
    label?: string;
    theme?: string;
    defaultvalue?: string;
}

const Toggle = (props: ToggleProps) => {
    const { label = "", lov = "", defaultvalue = "", theme = "false" } = props;
    const [value, setValue] = useState(defaultvalue);

    const lovList = getLov(lov) || [
        { id: "Item 1", label: "Item 1" },
        { id: "Item 2", label: "Item 2" },
    ];

    return parseBooleanProperty(theme) ? (
        <ThemeToggle {...props} />
    ) : (
        <Box>
            {label ? <Typography>{label}</Typography> : null}
            <ToggleButtonGroup
                value={value}
                exclusive
                sx={groupSx}
                onChange={(_: MouseEvent, val: any) => val !== null && setValue(val)}
            >
                {lovList &&
                    lovList.map((v: LovItem) => (
                        <ToggleButton value={v.id} key={v.id}>
                            {v.img ? (
                                <IconAvatar img={{ path: v.img, text: v.label }} />
                            ) : (
                                <Typography>{v.label}</Typography>
                            )}
                        </ToggleButton>
                    ))}
            </ToggleButtonGroup>
        </Box>
    );
};

export default Toggle;
