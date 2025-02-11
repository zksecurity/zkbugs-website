import { NavLink } from "react-router";
import { styled, Typography } from "@mui/material";
import {
  NorthEast as OutsideLinkIcon,
  GitHub as GithubIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import Container from "../layout/Container";
import { pathsLabeled } from "../../utils/paths";

const FooterStyled = styled("footer")(({ theme }) => ({
  padding: "2rem",
  marginTop: "8rem",
  borderTop: "1px solid #e0e0e0",
  alignItems: "center",
  // color: "#808080",
  color: theme.palette.text.secondary,
  "& *": {
    // transition: "color 0.2s",
  },
  "& .main-content": {
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0,1fr))",
    gap: "1.5rem",
    [theme.breakpoints.up(768)]: {
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    },
    "& .title": {
      fontSize: "18px",
      fontWeight: 700,
      marginBottom: "1rem",
    },
    "& .text-sm": {
      fontSize: "14px",
      lineHeight: "1.625rem",
    },
    "& .socials": {
      marginTop: "1rem",
      display: "flex",
      gap: "1rem",
      [theme.breakpoints.up(768)]: {
        justifyContent: "flex-start",
      },
      "& .social-icon": {
        color: theme.palette.text.secondary,
        "&:hover": {
          transition: "color 0.2s",
          color: "#9333ea",
        },
      },
    },
    "& .quick-links": {
      "& ul": {
        listStyle: "none",
        paddingLeft: 0,
        "& li": {
          marginBottom: "0.5rem",
          "& a": {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "inherit",
            "&:hover": {
              transition: "color 0.2s",
              color: "#9333ea",
            },
          },
        },
      },
    },
  },
  "& .footer-text": {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "2rem",
  },
}));

const currentDate = new Date().getFullYear();

function Footer() {
  return (
    <FooterStyled>
      <Container>
        <div className="main-content">
          <div>
            <Typography variant="h5" className="title">
              About zkSecurity
            </Typography>
            <Typography className="text-sm">
              zkSecurity specializes in advanced cryptographic solutions,
              including ZKP, MPC, and FHE. We are committed to making your
              systems secure and future-proof.
            </Typography>
          </div>
          <div className="quick-links ">
            <Typography variant="h5" className="title">
              Quick Links
            </Typography>
            <ul>
              <li>
                <a href="https://github.com/zksecurity/zkbugs" target="_blank">
                  Repo
                  <OutsideLinkIcon sx={{ width: "16px", height: "16px" }} />
                </a>
              </li>
              <li>
                <a href="https://www.zksecurity.xyz/" target="_blank">
                  zkSecurity
                  <OutsideLinkIcon sx={{ width: "16px", height: "16px" }} />
                </a>
              </li>
              {pathsLabeled.map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Typography variant="h5" className="title">
              Contact Us
            </Typography>
            <Typography className="text-sm">hello@zksecurity.xyz</Typography>
            <div className="socials">
              <a
                href="https://twitter.com/zksecurityXYZ"
                className="hover:text-white"
                aria-label="Twitter"
              >
                <TwitterIcon className="social-icon" />
              </a>
              <a
                href="https://github.com/zksecurity"
                className="hover:text-white"
                aria-label="GitHub"
              >
                <GithubIcon className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </Container>
      <Typography className="footer-text">
        @ {currentDate} zkSecurity - All Rights Reserved • This project was
        partially funded by the Ethereum Foundation
      </Typography>
    </FooterStyled>
  );
}

export default Footer;
