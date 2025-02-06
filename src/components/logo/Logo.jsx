import { styled } from "@mui/material";
import { useMyThemeProvider } from "../../providers/theme/useMyThemeProvider";

const ImageStyled = styled("img")(({ theme }) => ({
  height: "50px",
  [theme.breakpoints.down("sm")]: {
    height: "40px",
  },
}));

function Logo() {
  const { isDarkMode } = useMyThemeProvider();

  const logoPath = isDarkMode ? "/logo-inverted.svg" : "/logo.svg";
  return <ImageStyled src={logoPath} alt="logo" />;
}

export default Logo;
