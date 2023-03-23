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
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import MuiSlider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SyntheticEvent } from "react";

import { getCssSize } from "./utils";
import { parseBooleanProperty } from "./utils/booleanUtils";
import { LovImage, LovProps, getLov } from "./utils/lov";

interface SliderProps extends LovProps {
    width?: string;
    height?: string;
    min?: string;
    max?: string;
    textanchor?: string;
    labels?: string;
    orientation?: string;
    defaultvalue?: string;
}

const Slider = (props: SliderProps) => {
    const {
        defaultvalue = "0",
        lov = "",
        textanchor = "bottom",
        width = "300px",
        labels = "false",
        min: propsMin = "0",
        max: propsMax = "100",
    } = props;
    const [value, setValue] = useState(0);

    const lovList = getLov(lov) || [];

    const min = lovList.length ? 0 : parseInt(propsMin);
    const max = lovList.length ? lovList.length - 1 : parseInt(propsMax);
    const horizontalOrientation = props.orientation ? props.orientation.charAt(0).toLowerCase() !== "v" : true;

    const handleRange = useCallback(
        (_: Event, val: number | number[]) => {
            setValue(val as number);
        },
        [lovList],
    );

    const handleRangeCommitted = useCallback(
        (_: Event | SyntheticEvent, val: number | number[]) => {
            setValue(val as number);
        },
        [lovList],
    );

    const getLabel = useCallback(
        (value: number) =>
            lovList.length && lovList.length > value ? (
                lovList[value].img !== undefined ? (
                    <LovImage item={{ path: lovList[value].img as string, text: lovList[value].label }} />
                ) : (
                    <Typography>{lovList[value].label}</Typography>
                )
            ) : (
                <>{value}</>
            ),
        [lovList],
    );

    const getText = useCallback(
        (value: number, before: boolean) => {
            if (lovList.length) {
                if (before && (textanchor === "top" || textanchor === "left")) {
                    return getLabel(value);
                }
                if (!before && (textanchor === "bottom" || textanchor === "right")) {
                    return getLabel(value);
                }
            }
            return null;
        },
        [lovList, textanchor, getLabel],
    );

    const marks = useMemo(() => {
        if (parseBooleanProperty(labels)) {
            if (lovList.length) {
                return lovList.map((_: any, idx: any) => ({ value: idx, label: getLabel(idx) }));
            }
        }
        return lovList.length > 0;
    }, [labels, lovList, getLabel]);

    const textanchorSx = useMemo(() => {
        const sx = horizontalOrientation ? { width: getCssSize(width) } : { height: getCssSize(props.height || width) };
        if (lovList.length) {
            if (textanchor === "top" || textanchor === "bottom") {
                return { ...sx, display: "inline-grid", gap: "0.5em", textAlign: "center" } as SxProps;
            }
            if (textanchor === "left" || textanchor === "right") {
                return {
                    ...sx,
                    display: "inline-grid",
                    gap: "1em",
                    gridTemplateColumns: textanchor === "left" ? "auto 1fr" : "1fr auto",
                    alignItems: "center",
                } as SxProps;
            }
        }
        return { ...sx, display: "inline-block" };
    }, [lovList, horizontalOrientation, textanchor, width, props.height]);

    useEffect(() => {
        const v = parseInt(defaultvalue);
        if (v) {
            setValue(v);
            return;
        }
        if (lovList.length) {
            const val = lovList.findIndex((item) => item.id === props.defaultvalue);
            setValue(val === -1 ? 0 : val);
        }
    }, []);

    return (
        <Box sx={textanchorSx}>
            {getText(value, true)}
            <MuiSlider
                value={value as number}
                onChange={handleRange}
                onChangeCommitted={handleRangeCommitted}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                step={1}
                marks={marks}
                valueLabelFormat={getLabel}
                orientation={horizontalOrientation ? undefined : "vertical"}
            />
            {getText(value, false)}
        </Box>
    );
};

export default Slider;
