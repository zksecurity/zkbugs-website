import PropTypes from "prop-types";
import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useMyThemeProvider } from "../../providers/useMyThemeProvider";

function ThemeIcon({ isDark }) {
  return isDark ? (
    <LightMode fontSize="small" color="error" />
  ) : (
    <DarkMode fontSize="small" />
  );
}

function ThemeToggle() {
  const { isDarkMode, setIsDarkMode } = useMyThemeProvider();

  return (
    <IconButton
      // sx={{ backgroundColor: isDarkMode  }}
      onClick={() => {
        console.log(isDarkMode);
        setIsDarkMode((prev) => !prev);
      }}
    >
      <ThemeIcon isDark={isDarkMode} />
    </IconButton>
  );
}

export default ThemeToggle;

ThemeIcon.propTypes = {
  isDark: PropTypes.bool,
};
