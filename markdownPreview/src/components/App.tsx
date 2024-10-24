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
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ComponentType, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import JsxParser from "react-jsx-parser";
import { useDarkMode, useSessionStorage } from "usehooks-ts";

import Button from "./Taipy/Button";
import Chart from "./Taipy/Chart";
import DateSelector from "./Taipy/DateSelector";
import Expandable from "./Taipy/Expandable";
import Field from "./Taipy/Field";
import FileDownload from "./Taipy/FileDownload";
import FileSelector from "./Taipy/FileSelector";
import Image from "./Taipy/Image";
import Indicator from "./Taipy/Indicator";
import Input from "./Taipy/Input";
import Layout from "./Taipy/Layout";
import Menu from "./Taipy/Menu";
import MenuCtl from "./Taipy/MenuCtl";
import NavBar from "./Taipy/NavBar";
import Number from "./Taipy/Number";
import Pane from "./Taipy/Pane";
import Part from "./Taipy/Part";
import Selector from "./Taipy/Selector";
import Slider from "./Taipy/Slider";
import Table from "./Taipy/Table";
import Toggle from "./Taipy/Toggle";
import { renderError, unregisteredRender } from "./Taipy/Unregistered";
import ErrorFallback from "./Taipy/utils/ErrorBoundary";
import { getUserTheme } from "./themes";

interface AppProps {
    jsx: string;
    baseHref: string;
}

export const JSXSupportedComponent: Record<string, unknown> = {
    taipy_button: Button,
    taipy_chart: Chart,
    taipy_date: DateSelector,
    taipy_expandable: Expandable,
    taipy_file_download: FileDownload,
    taipy_file_selector: FileSelector,
    taipy_image: Image,
    taipy_indicator: Indicator,
    taipy_input: Input,
    taipy_layout: Layout,
    taipy_menu: MenuCtl,
    taipy_navbar: NavBar,
    taipy_number: Number,
    taipy_pane: Pane,
    taipy_part: Part,
    taipy_selector: Selector,
    taipy_slider: Slider,
    taipy_table: Table,
    taipy_toggle: Toggle,
    taipy_text: Field,
};

const mainSx = {
    flexGrow: 1,
    bgcolor: "background.default",
};
const containerSx = { display: "flex" };

const userTheme = {
    light: getUserTheme("light"),
    dark: getUserTheme("dark"),
};

const App = (props: AppProps) => {
    const { jsx } = props;
    const { isDarkMode, enable, disable } = useDarkMode();
    const [_, setBaseHref] = useSessionStorage("baseHref", "");
    const [menuProps, setMenuProps] = useSessionStorage("menu", JSON.stringify({}));
    useEffect(() => {
        document.body.classList.contains("vscode-dark") ? enable() : disable();
        setBaseHref(props.baseHref);
    }, []);
    useEffect(() => {
       if (!jsx.includes("<taipy_menu")) {
            setMenuProps(JSON.stringify({}));
       }
    }, [jsx]);
    const theme = isDarkMode ? "dark" : "light";
    const themeClass = `taipy-${theme}`;
    const MuiTheme = userTheme[theme];
    return (
        <>
            <GlobalStyles
                styles={{
                    body: {
                        backgroundColor: MuiTheme.palette.background.default,
                        color: MuiTheme.typography.body1.color,
                    },
                }}
            />
            <ThemeProvider theme={MuiTheme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box style={containerSx} className={themeClass}>
                        <CssBaseline />
                        {menuProps ? (
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <Menu {...JSON.parse(menuProps)} />
                            </ErrorBoundary>
                        ) : null}
                        <Box component="main" sx={mainSx}>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <JsxParser
                                    disableKeyGeneration={true}
                                    components={JSXSupportedComponent as Record<string, ComponentType>}
                                    jsx={jsx}
                                    renderUnrecognized={unregisteredRender}
                                    allowUnknownElements={false}
                                    renderError={renderError}
                                    blacklistedAttrs={[]}
                                    blacklistedTags={["svg"]}
                                    autoCloseVoidElements={true}
                                />
                            </ErrorBoundary>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </ThemeProvider>
        </>
    );
};

export default App;
