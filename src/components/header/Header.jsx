import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router";
import { Divider, styled } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import clsx from "clsx";
import { paths } from "../../utils/paths";
import { useScrollDetection } from "../../hooks/useScrollDetection";
import Logo from "../logo/Logo";
import Menu from "../menu/Menu";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import { headerPaths } from "./headerPaths";
import ThemeIcon from "../theme-icon/ThemeIcon";
import { useMyThemeProvider } from "../../providers/theme/useMyThemeProvider";

const HeaderContainer = styled("div")(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: "1px solid #e0e0e0",
  paddingLeft: "4rem",
  paddingRight: "4rem",
  [theme.breakpoints.down(900)]: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
}));

const HeaderStyled = styled("div")(({ theme }) => [
  {
    padding: "1.75rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "padding 0.2s",
    "&.scrolled": {
      padding: 0,
      transitionDelay: "300ms",
    },
    "& .menu": {
      display: "flex",
      alignItems: "center",
      gap: "1.25rem",
      "& a": {
        borderBottom: "2px solid transparent",
        transition: "border-bottom 0.2s",
        "&:hover": {
          borderBottom: "2px solid rgb(128, 143, 170)",
        },
        "&.active": {
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
    },
  },
]);
const BurgerMenuItem = styled("span")(({ theme }) => [
  {
    width: "100%",
    fontSize: "16px",
    "&.not-link": {
      color: theme.palette.text.primary,
    },
  },
]);
const NavLinkStyled = styled(NavLink)(({ theme }) => [
  {
    color: "#657795",
    "&.active": {
      color: theme.palette.secondary.dark,
    },
  },
  theme.applyStyles("dark", {
    color: theme.palette.text.primary,
    "&.active": {
      color: theme.palette.secondary.main,
    },
  }),
]);

const ToggleThemeItem = styled("span")(({ theme }) => [
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#657795",
  },
  theme.applyStyles("dark", {
    color: theme.palette.text.primary,
  }),
]);

function Header() {
  const isScrolled = useScrollDetection();
  const navigate = useNavigate();

  const { setIsDarkMode } = useMyThemeProvider();

  const burgerMenuOptions = useMemo(
    () => [
      ...headerPaths,
      { component: <Divider /> },
      {
        component: (
          <ToggleThemeItem onClick={() => setIsDarkMode((prev) => !prev)}>
            Theme <ThemeIcon />
          </ToggleThemeItem>
        ),
      },
    ],
    [setIsDarkMode]
  );

  return (
    <HeaderContainer>
      <HeaderStyled className={clsx({ scrolled: isScrolled })}>
        <NavLink to={paths.home}>
          <Logo />
        </NavLink>
        <div className="menu">
          {headerPaths.map(({ to, label }) => (
            <NavLinkStyled key={to} to={to}>
              {label}
            </NavLinkStyled>
          ))}
          <ThemeToggle />
        </div>
        <Menu
          className="burger-menu"
          options={burgerMenuOptions}
          renderOption={(option) => (
            <BurgerMenuItem>
              {option.component ?? (
                <NavLinkStyled to={option.to}>{option.label}</NavLinkStyled>
              )}
            </BurgerMenuItem>
          )}
          onSelect={(option) => navigate(option.to)}
        >
          <MenuIcon fontSize="large" />
        </Menu>
      </HeaderStyled>
    </HeaderContainer>
  );
}

export default Header;
