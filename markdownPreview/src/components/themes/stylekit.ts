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

const stylekitConfig = {
    borderRadius: 8,
    colorBackgroundDark: "#051924",
    colorBackgroundLight: "#f1f1f1",
    colorError: "#FF595E",
    colorPaperDark: "#072636",
    colorPaperLight: "#ffffff",
    colorPrimary: "#ff462b",
    colorSecondary: "#283282",
    colorSuccess: "#96E6B3",
    colorWarning: "#FAA916",
    fontFamily: "Lato, Arial, sans-serif",
    inputButtonHeight: "48px",
    textLight: "rgba(0, 0, 0, 0.87)",
    textDark: "#ffffff",
};

export const stylekitTheme = {
    palette: {
        // Primary and secondary colors
        primary: {
            main: stylekitConfig.colorPrimary,
        },
        secondary: {
            main: stylekitConfig.colorSecondary,
        },
        error: {
            main: stylekitConfig.colorError,
        },
        warning: {
            main: stylekitConfig.colorWarning,
        },
        success: {
            main: stylekitConfig.colorSuccess,
        },
    },
    typography: {
        // Custom font
        fontFamily: stylekitConfig.fontFamily,
        h6: {
            fontSize: "1rem",
        },
    },
    shape: {
        borderRadius: stylekitConfig.borderRadius,
    },
    // Components normalization
    components: {
        // Form control
        MuiFormControl: {
            styleOverrides: {
                root: {
                    // Fill the available width
                    display: "flex",

                    // Removing vertical margins if placed in a layout to avoid y-alignment issues
                    ".taipy-layout > .taipy-part > .md-para > &": {
                        "&:first-child": {
                            mt: 0,
                        },
                        "&:last-child": {
                            mb: 0,
                        },
                    },
                },
            },
        },
        // Form label
        MuiInputLabel: {
            styleOverrides: {
                outlined: {
                    zIndex: "0",
                    transition: "all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                    // Properly position floating label on Y axis (second translate value) as the input height changes
                    "&:not(.MuiInputLabel-shrink)": {
                        top: "50%",
                        transform: "translate(14px, -50%) scale(1)",
                    },
                },
            },
        },
        // Form input
        MuiInputBase: {
            styleOverrides: {
                root: {
                    // Fill the available width
                    display: "flex",
                },
                input: {
                    height: stylekitConfig.inputButtonHeight,
                    boxSizing: "border-box",

                    ".MuiInputBase-root &": {
                        py: 4,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    display: "flex",
                    alignItems: "center",
                    height: stylekitConfig.inputButtonHeight,
                    lineHeight: stylekitConfig.inputButtonHeight,
                    boxSizing: "border-box",

                    "&.MuiInputBase-input": {
                        py: 0,
                    },
                },
            },
        },
        // Button
        MuiButton: {
            styleOverrides: {
                root: {
                    height: "auto",
                    minHeight: stylekitConfig.inputButtonHeight,
                    marginBottom: 4,
                },
            },
        },
        // Mui slider
        MuiSlider: {
            styleOverrides: {
                rail: {
                    ".taipy-indicator &": {
                        // Use success and error color for heat gradient
                        background:
                            "linear-gradient(90deg, " +
                            stylekitConfig.colorError +
                            " 0%, " +
                            stylekitConfig.colorSuccess +
                            " 100%)",
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    minHeight: "unset",
                },
            },
        },
        // Mui table
        MuiTable: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-root": {
                        textAlign: "left",
                    },
                },
            },
        },
    },
};

export const stylekitModeThemes = {
    light: {
        typography: {
            allVariants: {
                color: stylekitConfig.textLight,
            },
        },
        palette: {
            background: {
                // Main background
                default: stylekitConfig.colorBackgroundLight,
                // Cards background
                paper: stylekitConfig.colorPaperLight,
            },
        },
        components: {
            // Give MuiSlider disabled thumb a fill color matching the theme
            MuiSlider: {
                styleOverrides: {
                    thumb: {
                        ".Mui-disabled &::before": {
                            backgroundColor: stylekitConfig.colorPaperLight,
                        },
                    },
                },
            },
        },
    },
    dark: {
        typography: {
            allVariants: {
                color: stylekitConfig.textDark,
            },
        },
        palette: {
            background: {
                // Main background
                default: stylekitConfig.colorBackgroundDark,
                // Cards background
                paper: stylekitConfig.colorPaperDark,
            },
        },
        components: {
            // Give MuiSlider disabled thumb a fill color matching the theme
            MuiSlider: {
                styleOverrides: {
                    thumb: {
                        ".Mui-disabled &::before": {
                            backgroundColor: stylekitConfig.colorPaperDark,
                        },
                    },
                },
            },
        },
    },
};
