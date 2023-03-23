import { CardHeader, SxProps, Tooltip, TypographyProps } from "@mui/material";
import { CSSProperties, useMemo } from "react";
import { Icon, IconAvatar } from "./icon";

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
