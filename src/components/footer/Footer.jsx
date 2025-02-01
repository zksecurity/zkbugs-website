import { NavLink } from "react-router";
import { styled, Typography } from "@mui/material";
import {
  GitHub as GithubIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import Container from "../layout/Container";
import { paths } from "../../utils/paths";

const FooterStyled = styled("footer")(({ theme }) => ({
  padding: "2rem",
  marginTop: "4rem",
  borderTop: "1px solid #e0e0e0",
  alignItems: "center",
  color: "#808080",
  "& *": {
    transition: "all 0.2s",
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
        color: "#808080",
        "&:hover": {
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
            color: "inherit",
          },
          "&:hover": {
            "& a": {
              color: "#9333ea",
            },
          },
        },
      },
    },
  },
  "& .footer-text": {
    textAlign: "center",
    color: "#808080",
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
                <NavLink to={paths.home}>Bugs</NavLink>
              </li>
              <li>
                <NavLink to={paths.descriptions}>Descriptions</NavLink>
              </li>
              <li>
                <NavLink to={paths.tools}>Security Tools</NavLink>
              </li>
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
        @ {currentDate} zkBugs - All Rights Reserved • This project was
        partially funded by the Ethereum Foundation
      </Typography>
    </FooterStyled>
  );
}

export default Footer;
