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

import { CSSProperties, MouseEvent, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PaletteMode } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import WbSunny from "@mui/icons-material/WbSunny";
import Brightness3 from "@mui/icons-material/Brightness3";
import { useDarkMode } from "usehooks-ts";

interface ThemeToggleProps {
    label?: string;
}

const boxSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    top: "1rem",
    right: "1rem",
    "& > *": {
        m: 1,
    },
} as CSSProperties;

const groupSx = { verticalAlign: "middle" };

const ThemeToggle = (props: ThemeToggleProps) => {
    const { label = "Mode" } = props;

    const { isDarkMode, toggle } = useDarkMode();

    const [value, setValue] = useState(isDarkMode ? "dark" : "light");

    const changeMode = (_: MouseEvent, mode: PaletteMode) => {
        if (mode === null) {
            return;
        }
        toggle();
        setValue(mode);
    };

    return (
        <Box sx={boxSx}>
            <Typography>{label}</Typography>
            <ToggleButtonGroup value={value} exclusive onChange={changeMode} aria-label="Theme mode" sx={groupSx}>
                <ToggleButton value="light" aria-label="light" title="Light">
                    <WbSunny />
                </ToggleButton>
                <ToggleButton value="dark" aria-label="dark" title="Dark">
                    <Brightness3 />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default ThemeToggle;