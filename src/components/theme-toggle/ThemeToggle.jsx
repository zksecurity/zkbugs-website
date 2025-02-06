import PropTypes from "prop-types";
import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import { useMyThemeProvider } from "../../providers/theme/useMyThemeProvider";

function ThemeIcon({ isDark }) {
  const theme = useTheme();
  return isDark ? (
    <LightMode sx={{ color: theme.palette.grey[700] }} />
  ) : (
    <DarkMode
      sx={{
        "&:hover": {
          color: theme.palette.primary.main,
        },
      }}
    />
  );
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
