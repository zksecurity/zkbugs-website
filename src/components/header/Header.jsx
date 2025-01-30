import { styled } from "@mui/material";
import Container from "../layout/Container";
import { NavLink } from "react-router";
import { paths } from "../../utils/paths";

const HeaderContainer = styled(Container)({
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 10,
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
      <HeaderStyled>
        <NavLink to={paths.home}>Logo</NavLink>
        <div className="menu">
          <NavLink to={paths.descriptions}>Descriptions</NavLink>
          <NavLink to={paths.tools}>Security Tools</NavLink>
        </div>
      </HeaderStyled>
    </HeaderContainer>
  );
}

export default Header;
