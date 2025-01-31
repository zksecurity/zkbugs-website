import { styled } from "@mui/material";

const Container = styled("div")(({ theme }) => ({
  margin: "0 auto",
  maxWidth: `calc(${theme.breakpoints.values.xl}px - 6rem)`,
  [theme.breakpoints.down("xl")]: {
    maxWidth: `calc(${theme.breakpoints.values.lg}px - 5rem)`,
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: `calc(${theme.breakpoints.values.md}px - 4rem)`,
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
}));

export default Container;
