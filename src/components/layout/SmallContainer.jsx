import { styled } from "@mui/material";

const SmallContainer = styled("div")(({ theme }) => ({
  margin: "0 auto",
  maxWidth: `calc(${theme.breakpoints.values.xl}px - 8rem)`,
  [theme.breakpoints.down("xl")]: {
    maxWidth: `calc(${theme.breakpoints.values.lg}px - 6rem)`,
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: `calc(${theme.breakpoints.values.md}px - 6rem)`,
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: "4rem",
    paddingRight: "4rem",
  },
}));

export default SmallContainer;
