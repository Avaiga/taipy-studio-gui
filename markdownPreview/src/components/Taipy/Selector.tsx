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
import { Theme, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";

import { LovProps } from "./utils";
import { Icon } from "./utils/icon";
import { ItemProps, LovImage, SingleItem, getLov, paperBaseSx, showItem } from "./utils/lov";

const MultipleItem = ({ value, clickHandler, selectedValue, item, disabled }: ItemProps) => (
    <ListItemButton onClick={clickHandler} data-id={value} dense disabled={disabled}>
        <ListItemIcon>
            <Checkbox
                disabled={disabled}
                edge="start"
                checked={selectedValue.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
            />
        </ListItemIcon>
        {typeof item === "string" ? (
            <ListItemText primary={item} />
        ) : (
            <ListItemAvatar>
                <LovImage item={item} />
            </ListItemAvatar>
        )}
    </ListItemButton>
);

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
    filter?: boolean;
    multiple?: boolean;
    width?: string | number;
    dropdown?: boolean;
    defaultvalue?: string;
    height?: string | number;
    label?: string;
}

const Selector = (props: SelTreeProps) => {
    const {
        defaultvalue = "",
        filter = false,
        multiple = false,
        dropdown = false,
        lov = "",
        width = "100%",
        height,
    } = props;
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
        if (value !== undefined && value !== null) {
            setSelectedValue(Array.isArray(value) ? value.map((v) => "" + v) : ["" + value]);
        } else if (defaultValue) {
            let parsedValue;
            try {
                parsedValue = JSON.parse(defaultValue);
            } catch (e) {
                parsedValue = defaultValue;
            }
            setSelectedValue(Array.isArray(parsedValue) ? parsedValue : [parsedValue]);
        }
    }, [defaultValue, value]);

    const handleChange = useCallback(
        (event: SelectChangeEvent<typeof selectedValue>) => {
            const {
                target: { value },
            } = event;
            setSelectedValue(Array.isArray(value) ? value : [value]);
        },
        [, updateVarName, propagate, updateVars, valueById, props.onChange],
    );

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
                                        if (typeof item.item === "string") {
                                            chipProps.label = item.item;
                                        } else {
                                            chipProps.label = item.item.text || "";
                                            chipProps.avatar = <Avatar src={item.item.path} />;
                                        }
                                        return <Chip key={item.id} {...chipProps} data-id={item.id} />;
                                    } else if (idx === 0) {
                                        return typeof item.item === "string" ? (
                                            item.item
                                        ) : (
                                            <LovImage item={item.item} />
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
                            {typeof item.item === "string" ? item.item : <LovImage item={item.item as Icon} />}
                        </MenuItem>
                    ))}
                </Select>
            ) : (
                <Paper sx={paperSx}>
                    {filter && (
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
                            .filter((elt: any) => showItem(elt, searchValue))
                            .map((elt: any) =>
                                multiple ? (
                                    <MultipleItem
                                        key={elt.id}
                                        value={elt.id}
                                        item={elt.item}
                                        selectedValue={selectedValue}
                                    />
                                ) : (
                                    <SingleItem
                                        key={elt.id}
                                        value={elt.id}
                                        item={elt.item}
                                        selectedValue={selectedValue}
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
