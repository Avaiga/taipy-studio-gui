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
import { Theme, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { CSSProperties, MouseEvent, useCallback, useEffect, useMemo, useState } from "react";

import { LovProps } from "./utils";
import { parseBooleanProperty } from "./utils/booleanUtils";
import { LovImage, MultipleItem, SingleItem, getLov, showItem } from "./utils/lov";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const getMenuProps = (height?: string | number) => ({
    PaperProps: {
        style: {
            maxHeight: height || ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
});

const getStyles = (id: string, ids: readonly string[], theme: Theme) => ({
    fontWeight: ids.indexOf(id) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
});

const renderBoxSx = { display: "flex", flexWrap: "wrap", gap: 0.5 } as CSSProperties;
export interface SelTreeProps extends LovProps {
    filter?: string;
    multiple?: string;
    width?: string | number;
    dropdown?: string;
    defaultvalue?: string;
    height?: string | number;
    label?: string;
}

export const paperBaseSx = { width: "100%", mb: 2, display: "grid", gridTemplateRows: "auto 1fr" } as CSSProperties;

const Selector = (props: SelTreeProps) => {
    const {
        defaultvalue = "",
        filter = "false",
        multiple: multipleProps = "false",
        dropdown: dropdownProps = "false",
        lov = "",
        width = "100%",
        height,
    } = props;
    const multiple = parseBooleanProperty(multipleProps);
    const dropdown = parseBooleanProperty(dropdownProps);
    const [searchValue, setSearchValue] = useState("");
    const [selectedValue, setSelectedValue] = useState<string[]>([]);
    const theme = useTheme();

    const lovList = getLov(lov) || [];
    const listSx = useMemo(
        () => ({ bgcolor: "transparent", overflowY: "auto", width: "100%", maxWidth: width }),
        [width],
    );
    const paperSx = useMemo(() => {
        let sx = paperBaseSx;
        if (height !== undefined) {
            sx = { ...sx, maxHeight: height };
        }
        if (width !== undefined) {
            // sx = { ...sx, maxWidth: width };
        }
        return sx;
    }, [height, width]);
    const controlSx = useMemo(() => ({ my: 1, mx: 0, width: width, display: "flex" }), [width]);

    useEffect(() => {
        let parsedValue;
        try {
            parsedValue = JSON.parse(decodeURIComponent(defaultvalue));
        } catch (e) {
            parsedValue = defaultvalue;
        }
        setSelectedValue(Array.isArray(parsedValue) ? parsedValue : [parsedValue]);
    }, []);

    const clickHandler = useCallback(
        (evt: MouseEvent<HTMLElement>) => {
            const { id: key = "" } = evt.currentTarget.dataset;
            setSelectedValue((keys) => {
                if (multiple) {
                    const newKeys = [...keys];
                    const p = newKeys.indexOf(key);
                    if (p === -1) {
                        newKeys.push(key);
                    } else {
                        newKeys.splice(p, 1);
                    }
                    return newKeys;
                } else {
                    return [key];
                }
            });
        },
        [multiple],
    );

    const handleChange = useCallback((event: SelectChangeEvent<typeof selectedValue>) => {
        const {
            target: { value },
        } = event;
        setSelectedValue(Array.isArray(value) ? value : [value]);
    }, []);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value), []);

    const dropdownValue = (dropdown &&
        (multiple ? selectedValue : selectedValue.length > 0 ? selectedValue[0] : "")) as string[];

    return (
        <FormControl sx={controlSx}>
            {props.label ? <InputLabel>{props.label}</InputLabel> : null}
            {dropdown ? (
                <Select
                    multiple={multiple}
                    value={dropdownValue}
                    onChange={handleChange}
                    input={<OutlinedInput label={props.label} />}
                    renderValue={(selected) => (
                        <Box sx={renderBoxSx}>
                            {lovList
                                .filter((it) =>
                                    Array.isArray(selected) ? selected.includes(it.id) : selected === it.id,
                                )
                                .map((item, idx) => {
                                    if (multiple) {
                                        const chipProps = {} as Record<string, unknown>;
                                        if (item.img) {
                                            chipProps.label = item.label || "";
                                            chipProps.avatar = <Avatar src={item.img} />;
                                        } else {
                                            chipProps.label = item.label;
                                        }
                                        return <Chip key={item.id} {...chipProps} data-id={item.id} />;
                                    } else if (idx === 0) {
                                        return item.img ? (
                                            <LovImage item={{ path: item.img, text: item.label }} />
                                        ) : (
                                            item.label
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                        </Box>
                    )}
                    MenuProps={getMenuProps(height)}
                >
                    {lovList.map((item) => (
                        <MenuItem key={item.id} value={item.id} style={getStyles(item.id, selectedValue, theme)}>
                            {item.img ? <LovImage item={{ path: item.img, text: item.label }} /> : item.label}
                        </MenuItem>
                    ))}
                </Select>
            ) : (
                <Paper sx={paperSx}>
                    {parseBooleanProperty(filter) && (
                        <Box>
                            <OutlinedInput
                                margin="dense"
                                placeholder="Search field"
                                value={searchValue}
                                onChange={handleInput}
                            />
                        </Box>
                    )}
                    <List sx={listSx}>
                        {lovList
                            .filter((elt) => showItem(elt, searchValue))
                            .map((elt) =>
                                multiple ? (
                                    <MultipleItem
                                        key={elt.id}
                                        value={elt.id}
                                        item={elt}
                                        selectedValue={selectedValue}
                                        clickHandler={clickHandler}
                                        disabled={false}
                                    />
                                ) : (
                                    <SingleItem
                                        key={elt.id}
                                        value={elt.id}
                                        item={elt}
                                        selectedValue={selectedValue}
                                        clickHandler={clickHandler}
                                        disabled={false}
                                    />
                                ),
                            )}
                    </List>
                </Paper>
            )}
        </FormControl>
    );
};

export default Selector;
