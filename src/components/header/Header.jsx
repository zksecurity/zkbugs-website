import { NavLink } from "react-router";
import { styled } from "@mui/material";
import Container from "../layout/Container";
import { paths } from "../../utils/paths";
import Logo from "../logo/Logo";
import { useScrollDetection } from "../../hooks/useScrollDetection";
import clsx from "clsx";

const HeaderContainer = styled("div")({
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 10,
  borderBottom: "1px solid #e0e0e0",
});

const HeaderStyled = styled("div")({
  padding: "1.75rem 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "padding 0.2s",
  "&.scrolled": {
    padding: 0,
  },
  "& .menu": {
    display: "flex",
    gap: "1.25rem",
    "& a": {
      color: "#657795",
      borderBottom: "2px solid transparent",
      transition: "border-bottom 0.2s",
      "&:hover": {
        borderBottom: "2px solid rgb(128, 143, 170)",
      },
    },
  },
});

function Header() {
  const isScrolled = useScrollDetection();

  return (
    <HeaderContainer>
      <Container>
        <HeaderStyled className={clsx({ scrolled: isScrolled })}>
          <NavLink to={paths.home}>
            <Logo />
          </NavLink>
          <div className="menu">
            <NavLink to={paths.home}>Bugs</NavLink>
            <NavLink to={paths.descriptions}>Descriptions</NavLink>
            <NavLink to={paths.tools}>Security Tools</NavLink>
          </div>
        </HeaderStyled>
      </Container>
    </HeaderContainer>
  );
}

export default Header;
