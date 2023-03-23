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
import { CSSProperties, useMemo } from "react";

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
    selectedValue: string[] | string;
    item: LovItem;
    disabled: boolean;
    withAvatar?: boolean;
    titleTypographyProps?: TypographyProps;
}

export const SingleItem = ({
    value,
    selectedValue,
    item,
    disabled,
    withAvatar = false,
    titleTypographyProps,
}: ItemProps) => (
    <ListItemButton
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

export const MultipleItem = ({ value, selectedValue, item, disabled }: ItemProps) => (
    <ListItemButton data-id={value} dense disabled={disabled}>
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
