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

import { Box, createTheme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ComponentType } from "react";
import JsxParser from "react-jsx-parser";
import { getTextColor } from "../utils";
import Button from "./Taipy/Button";
import Chart from "./Taipy/Chart";
import DateSelector from "./Taipy/DateSelector";
import Expandable from "./Taipy/Expandable";
import Field from "./Taipy/Field";
import Input from "./Taipy/Input";
import Layout from "./Taipy/Layout";
import Number from "./Taipy/Number";
import Pane from "./Taipy/Pane";
import Part from "./Taipy/Part";
import Table from "./Taipy/Table";
import { renderError, unregisteredRender } from "./Taipy/Unregistered";

interface AppProps {
    jsx: string;
}

export const JSXSupportedComponent: Record<string, unknown> = {
    taipy_text: Field,
    taipy_button: Button,
    taipy_number: Number,
    taipy_input: Input,
    taipy_table: Table,
    taipy_chart: Chart,
    taipy_part: Part,
    taipy_expandable: Expandable,
    taipy_pane: Pane,
    taipy_layout: Layout,
    taipy_date: DateSelector,
};

const defaultTextColor = getTextColor(document.body.style.backgroundColor);

const mainSx = {
    flexGrow: 1,
    color: defaultTextColor,
    bgcolor: document.body.style.backgroundColor,
};
const containerSx = { display: "flex" };

const MuiTheme = createTheme({
    typography: {
        allVariants: {
            color: defaultTextColor,
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: defaultTextColor,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    ".MuiOutlinedInput-notchedOutline": {
                        borderColor: defaultTextColor,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: defaultTextColor,
                    },
                },
            },
        },
    },
});

const App = (props: AppProps) => {
    const { jsx } = props;
    return (
        <ThemeProvider theme={MuiTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box style={containerSx}>
                    <Box component="main" sx={mainSx}>
                        <JsxParser
                            disableKeyGeneration={true}
                            components={JSXSupportedComponent as Record<string, ComponentType>}
                            jsx={jsx}
                            renderUnrecognized={unregisteredRender}
                            allowUnknownElements={false}
                            renderError={renderError}
                            blacklistedAttrs={[]}
                            blacklistedTags={[]}
                        />
                    </Box>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default App;
