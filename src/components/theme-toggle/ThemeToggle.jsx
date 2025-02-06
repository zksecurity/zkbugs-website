import PropTypes from "prop-types";
import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useMyThemeProvider } from "../../providers/theme/useMyThemeProvider";

function ThemeIcon({ isDark }) {
  return isDark ? <LightMode /> : <DarkMode />;
}

function ThemeToggle() {
  const { isDarkMode, setIsDarkMode } = useMyThemeProvider();

  return (
    <IconButton
      onClick={() => {
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
