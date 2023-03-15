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

import { useState } from "react";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BaseDateTimePickerSlotsComponentsProps } from "@mui/x-date-pickers/DateTimePicker/shared";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./utils/ErrorBoundary";

import { isDate } from "./utils/date";
import { Typography } from "@mui/material";
import { parseBooleanProperty } from "./utils/booleanUtils";

interface DateSelectorProps {
    withtime?: string;
    defaultvalue?: string;
    editable?: string;
}

const boxSx = { display: "inline-block" };
const textFieldProps = { textField: { margin: "dense" } } as BaseDateTimePickerSlotsComponentsProps<Date>;

const DateSelector = (props: DateSelectorProps) => {
    const { withtime = "false", editable = "true", defaultvalue = "" } = props;
    const [value, setValue] = useState(isDate(defaultvalue) ? new Date(defaultvalue) : new Date());

    const handleChange = (v: Date | null) => {
        v && setValue(v);
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Box sx={boxSx}>
                {parseBooleanProperty(editable) ? (
                    parseBooleanProperty(withtime) ? (
                        <DateTimePicker
                            value={value || new Date()}
                            onChange={handleChange}
                            slotProps={textFieldProps}
                        />
                    ) : (
                        <DatePicker value={value || new Date()} onChange={handleChange} slotProps={textFieldProps} />
                    )
                ) : (
                    <Typography component="span" sx={{ fontWeight: "unset" }}>
                        {parseBooleanProperty(withtime) ? value.toLocaleString() : value.toLocaleDateString()}
                    </Typography>
                )}
            </Box>
        </ErrorBoundary>
    );
};

export default DateSelector;
