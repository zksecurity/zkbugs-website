import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { MyThemeContext } from "./useMyThemeProvider";
import { darkPalette } from "../../themes/darkTheme";
import { lightPalette } from "../../themes/lightTheme";

function MyThemeProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(() => {
    const palette = isDarkMode ? darkPalette : lightPalette;

    return createTheme({
      colorSchemes: {
        dark: isDarkMode,
      },
      palette,
    });
  }, [isDarkMode]);

  // console.log(theme);

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MyThemeContext.Provider>
  );
}

export default MyThemeProvider;

MyThemeProvider.propTypes = {
  children: PropTypes.node,
};
