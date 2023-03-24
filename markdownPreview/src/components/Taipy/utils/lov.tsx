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

import {
    Avatar,
    CardHeader,
    Checkbox,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SxProps,
    Tooltip,
    TypographyProps,
} from "@mui/material";
import { CSSProperties, MouseEvent, useMemo } from "react";

import { Icon, IconAvatar, avatarSx } from "./icon";

export interface LovProps {
    lov?: string;
}
export interface LovItem {
    id: string;
    label: string;
    img?: string;
    children?: LovItem[];
}

const cardSx = { p: 0 } as CSSProperties;

export const LovImage = ({
    item,
    disableTypo,
    height,
    titleTypographyProps,
}: {
    item: Icon;
    disableTypo?: boolean;
    height?: string;
    titleTypographyProps?: TypographyProps;
}) => {
    const sx = useMemo(
        () => (height ? { height: height, "& .MuiAvatar-img": { objectFit: "contain" } } : undefined) as SxProps,
        [height],
    );
    return (
        <CardHeader
            sx={cardSx}
            avatar={
                <Tooltip title={item.text}>
                    <IconAvatar img={item} sx={sx} />
                </Tooltip>
            }
            title={item.text}
            disableTypography={disableTypo}
            titleTypographyProps={titleTypographyProps}
        />
    );
};

export const getLov = (s: string): LovItem[] | null => {
    const decoded = decodeURIComponent(s);
    // in case data is a string
    if (decoded === s) {
        return s
            ? s.split(";").map((v) => {
                  return { id: v, label: v };
              })
            : null;
    }
    // data should be json
    let data: LovItem[] | null = null;
    try {
        data = JSON.parse(decoded) as LovItem[];
    } catch (e) {}
    return data;
};

export const showItem = (elt: LovItem, searchValue: string) => {
    return !searchValue || elt.label.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
};

export interface ItemProps {
    value: string;
    clickHandler: (evt: MouseEvent<HTMLElement>) => void;
    selectedValue: string[] | string;
    item: LovItem;
    disabled: boolean;
    withAvatar?: boolean;
    titleTypographyProps?: TypographyProps;
}

export const SingleItem = ({
    value,
    clickHandler,
    selectedValue,
    item,
    disabled,
    withAvatar = false,
    titleTypographyProps,
}: ItemProps) => (
    <ListItemButton
        onClick={clickHandler}
        data-id={value}
        selected={Array.isArray(selectedValue) ? selectedValue.indexOf(value) !== -1 : selectedValue === value}
        disabled={disabled}
    >
        {!item.img ? (
            withAvatar ? (
                <ListItemAvatar>
                    <CardHeader
                        sx={cardSx}
                        avatar={
                            <Tooltip title={item.label}>
                                <Avatar sx={avatarSx}>{getInitials(item.label)}</Avatar>
                            </Tooltip>
                        }
                        title={item.label}
                        titleTypographyProps={titleTypographyProps}
                    />
                </ListItemAvatar>
            ) : (
                <ListItemText primary={item.label} />
            )
        ) : (
            <ListItemAvatar>
                <LovImage item={{ path: item.img, text: item.label }} titleTypographyProps={titleTypographyProps} />
            </ListItemAvatar>
        )}
    </ListItemButton>
);

export const MultipleItem = ({ value, clickHandler, selectedValue, item, disabled }: ItemProps) => (
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
        {!item.img ? (
            <ListItemText primary={item.label} />
        ) : (
            <ListItemAvatar>
                <LovImage item={{ path: item.img, text: item.label }} />
            </ListItemAvatar>
        )}
    </ListItemButton>
);

const getInitials = (value: string, max = 2): string =>
    (value || "")
        .split(" ", max)
        .map((word) => (word.length ? word.charAt(0) : ""))
        .join("")
        .toUpperCase();
