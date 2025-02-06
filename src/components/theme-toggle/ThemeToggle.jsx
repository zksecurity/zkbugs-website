import { IconButton } from "@mui/material";
import { useMyThemeProvider } from "../../providers/theme/useMyThemeProvider";
import ThemeIcon from "../theme-icon/ThemeIcon";

export default function ThemeToggle() {
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
