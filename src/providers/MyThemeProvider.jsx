import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { MyThemeContext } from "./useMyThemeProvider";

function MyThemeProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  const value = useMemo(
    () => ({
      mode: isDarkMode ? "dark" : "light",
      setMode: (mode) => setIsDarkMode(mode === "dark"),
      isDarkMode,
      setIsDarkMode,
    }),
    [isDarkMode, setIsDarkMode]
  );

  return (
    <MyThemeContext.Provider value={value}>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MyThemeContext.Provider>
  );
}

export default MyThemeProvider;

MyThemeProvider.propTypes = {
  children: PropTypes.node,
};
