import PropTypes from "prop-types";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function ThemeIcon({ isDark }) {
  return isDark ? <LightMode /> : <DarkMode />;
}

ThemeIcon.propTypes = {
  isDark: PropTypes.bool,
};
