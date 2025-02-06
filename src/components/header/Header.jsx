import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { Divider, styled } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { paths } from "../../utils/paths";
import { useScrollDetection } from "../../hooks/useScrollDetection";
import Logo from "../logo/Logo";
import Menu from "../menu/Menu";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import { headerPaths } from "./headerPaths";
import { useMemo } from "react";

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
    },
    "& .menu": {
      display: "flex",
      alignItems: "center",
      gap: "1.25rem",
      "& a": {
        color: "#657795",
        borderBottom: "2px solid transparent",
        transition: "border-bottom 0.2s",
        "&:hover": {
          borderBottom: "2px solid rgb(128, 143, 170)",
        },
        "&.active": {
          color: theme.palette.secondary.main,
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
  theme.applyStyles("dark", {
    "& .menu a": {
      color: theme.palette.text.primary,
    },
  }),
]);
const BurgerMenuItem = styled("span")(({ theme }) => ({
  width: "100%",
  fontSize: "16px",
  "&.not-link": {
    color: theme.palette.text.primary,
  },
}));

function Header() {
  const isScrolled = useScrollDetection();
  const navigate = useNavigate();

  const burgerMenuOptions = useMemo(
    () => [
      ...headerPaths,
      { component: <Divider /> },
      {
        component: (
          <>
            Theme <ThemeToggle />
          </>
        ),
      },
    ],
    []
  );

  return (
    <HeaderContainer>
      <HeaderStyled className={clsx({ scrolled: isScrolled })}>
        <NavLink to={paths.home}>
          <Logo />
        </NavLink>
        <div className="menu">
          {headerPaths.map(({ to, label }) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
          <ThemeToggle />
        </div>
        <Menu
          className="burger-menu"
          options={burgerMenuOptions}
          renderOption={(option) => (
            <BurgerMenuItem>
              {option.component ?? (
                <NavLink to={option.to}>{option.label}</NavLink>
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
