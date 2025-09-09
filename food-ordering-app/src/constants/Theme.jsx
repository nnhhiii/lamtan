import React, { createContext, useMemo, useState, useContext } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Tạo Context để lưu trạng thái chế độ
const ColorModeContext = createContext({
    setMode: () => { },
    mode: "system",
});

export const useColorMode = () => useContext(ColorModeContext);

const ThemeConfig = ({ children }) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const [mode, setMode] = useState("system");

    const effectiveMode = mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode;

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: effectiveMode,
                ...(effectiveMode === "dark"
                    ? {
                        primary: { main: "#fafafaff", light: "#311D1D", dark: "#343434ff" },
                        secondary: { main: "#0d0d0dff", light: "#ffffffff", dark: '#DA2032' },
                        third: { main: '#B12024' },
                        background: { default: "#121212", paper: "#1e1e1e" },
                        text: { primary: "#eaeaeaff", secondary: "#bdbdbd", third: '#ffffffff', fourth: "#88bffaff" },
                    }
                    : {
                        primary: { main: "#B12024", light: "#FFF8F7", dark: "#94171bff" },
                        secondary: { main: "#ffffffff", light: "#DA2032", dark: '#ffffffff' },
                        third: { main: '#c63237ff' },
                        background: { default: "#F5F5F5", paper: "#ffffff" },
                        text: { primary: "#303030", secondary: "#757575", third: "#58595B", fourth: "#2589F4" },
                    }),
            },
            typography: {
                fontFamily: "Inter"
            },
        }), [effectiveMode]);

    return (
        <ColorModeContext.Provider value={{ setMode, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ThemeConfig;
