import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeModeContext = createContext({
    toggleTheme: () => {},
    mode: "light",
});

export function CustomThemeProvider({ children }) {
    // Recupera a preferência do localStorage ou usa 'light'
    const [mode, setMode] = useState(() => {
        return localStorage.getItem("coworking_theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("coworking_theme", mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    // Gera o tema do Material UI dinamicamente
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "dark"
                        ? {
                              primary: { main: "#90caf9" },
                              background: { default: "#121212", paper: "#1e1e1e" },
                          }
                        : {
                              primary: { main: "#1976d2" },
                          }),
                },
            }),
        [mode]
    );

    return (
        <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
}

export const useThemeMode = () => useContext(ThemeModeContext);