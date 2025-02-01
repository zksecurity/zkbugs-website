import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { styled } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Container from "../layout/Container";
import { paths } from "../../utils/paths";
import { useScrollDetection } from "../../hooks/useScrollDetection";
import Logo from "../logo/Logo";
import Menu from "../menu/Menu";

const HeaderContainer = styled("div")({
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 10,
  borderBottom: "1px solid #e0e0e0",
});

const HeaderStyled = styled("div")(({ theme }) => ({
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
      "&.active": {
        // color: "#ae925c",
        color: "#9333ea",
        "&:hover": {
          borderBottom: "2px solid transparent",
        },
      },
    },
    [theme.breakpoints.down(900)]: {
      display: "none",
    },
  },
  "& .burger-menu": {
    display: "none",
    [theme.breakpoints.down(900)]: {
      display: "block",
    },
    "& .burger-link": {
      width: "100%",
    },
  },
}));

function Header() {
  const isScrolled = useScrollDetection();
  const navigate = useNavigate();

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
          <Menu
            className="burger-menu"
            options={[
              { to: paths.home, label: "Bugs" },
              { to: paths.descriptions, label: "Descriptions" },
              { to: paths.tools, label: "Security Tools" },
            ]}
            renderOption={(option) => (
              <NavLink to={option.to} className="burger-link">
                {option.label}
              </NavLink>
            )}
            onSelect={(option) => navigate(option.to)}
          >
            <MenuIcon />
          </Menu>
        </HeaderStyled>
      </Container>
    </HeaderContainer>
  );
}

export default Header;
