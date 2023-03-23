import { PaletteMode, createTheme } from "@mui/material";
import { merge } from "lodash";

import { stylekitModeThemes, stylekitTheme } from "./stylekit";

export const getUserTheme = (mode: PaletteMode) => {
    return createTheme(
        merge(stylekitTheme, stylekitModeThemes[mode], {
            palette: {
                mode: mode,
            },
            components: {
                MuiUseMediaQuery: {
                    defaultProps: {
                        noSsr: true,
                    },
                },
            },
        }),
    );
};
