import { styled } from "@mui/material";
import Container from "../layout/Container";
import { NavLink } from "react-router";
import { paths } from "../../utils/paths";
import Logo from "../logo/Logo";

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
  "& .menu": {
    display: "flex",
    gap: "1rem",
  },
});

function Header() {
  return (
    <HeaderContainer>
      <Container>
        <HeaderStyled>
          <NavLink to={paths.home}>
            <Logo />
          </NavLink>
          <div className="menu">
            <NavLink to={paths.descriptions}>Descriptions</NavLink>
            <NavLink to={paths.tools}>Security Tools</NavLink>
          </div>
        </HeaderStyled>
      </Container>
    </HeaderContainer>
  );
}

export default Header;
