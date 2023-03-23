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
import Avatar from "@mui/material/Avatar";
import { SxProps, Theme } from "@mui/system";
import { useMemo } from "react";

export interface Icon {
    path: string;
    text: string;
}

interface IconProps {
    img: Icon;
    sx?: SxProps;
}

export const avatarSx = { bgcolor: (theme: Theme) => theme.palette.text.primary };

export const IconAvatar = ({ img, sx }: IconProps) => {
    const avtSx = useMemo(() => (sx ? { ...avatarSx, ...sx } : avatarSx), [sx]);

    return <Avatar alt={img.text} src={img.path} sx={avtSx} />;
};
