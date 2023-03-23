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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { ReactNode, useCallback, useMemo, useState } from "react";

type AnchorType = "left" | "bottom" | "right" | "top" | undefined;

interface PaneProps {
    children?: ReactNode;
    defaultvalue?: boolean | string;
    anchor?: AnchorType;
    persistent?: boolean;
    height?: string | number;
    width?: string | number;
}

const getHeaderSx = (anchor: AnchorType) => {
    switch (anchor) {
        case "right":
        case "top":
        case "bottom":
            return { display: "flex", alignItems: "center" };
        default:
            return { display: "flex", alignItems: "center", justifyContent: "flex-end" };
    }
};

const getDrawerSx = (horizontal: boolean, width: string | number, height: string | number) => ({
    width: horizontal ? width : undefined,
    height: horizontal ? undefined : height,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: horizontal ? width : undefined,
        height: horizontal ? undefined : height,
        boxSizing: "border-box",
    },
});

const Pane = (props: PaneProps) => {
    const { anchor = "left", persistent = false, height = "30vh", width = "30vw", defaultvalue = true } = props;
    const [open, setOpen] = useState(defaultvalue === "true" || defaultvalue === true);

    const drawerSx = useMemo(
        () => getDrawerSx(anchor === "left" || anchor === "right", width, height),
        [width, height, anchor],
    );
    const headerSx = useMemo(() => getHeaderSx(anchor), [anchor]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return !persistent || (persistent && open) ? (
        <Drawer
            sx={drawerSx}
            variant={persistent ? "permanent" : undefined}
            anchor={anchor}
            open={open}
            onClose={handleClose}
        >
            {persistent ? (
                <>
                    <Box sx={headerSx}>
                        <IconButton onClick={handleClose}>
                            {anchor === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </Box>
                    <Divider />
                </>
            ) : null}
            {props.children}
        </Drawer>
    ) : null;
};

export default Pane;
