import { styled, Typography } from "@mui/material";

const FooterStyled = styled("footer")({
  padding: "2rem 4rem",
  marginTop: "4rem",
  borderTop: "1px solid #e0e0e0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& .footer-text": {
    color: "#808080",
    fontSize: "14px",
  },
});

const currentDate = new Date().getFullYear();

function Footer() {
  return (
    <FooterStyled>
      <Typography className="footer-text">
        @ {currentDate} zkBugs - All Rights Reserved | This project was
        partially funded by the Ethereum Foundation
      </Typography>
    </FooterStyled>
  );
}

export default Footer;
