import { styled } from "@mui/material";

const ImageStyled = styled("img")(({ theme }) => ({
  height: "50px",
  [theme.breakpoints.down("sm")]: {
    height: "40px",
  },
}));

function Logo() {
  return <ImageStyled src="/logo.png" alt="logo" />;
}

export default Logo;
