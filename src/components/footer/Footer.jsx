import { styled } from "@mui/material";
import Container from "../layout/Container";

const FooterStyled = styled("footer")({
  backgroundColor: "#111821",
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  "& .footer-wrapper": {
    paddingTop: "4.5rem",
    paddingBottom: "4.5rem",
  },
  "& .copyright-disclaimer": {
    color: "#a3a3a3",
    backgroundColor: "##111111",
    padding: "2.5rem 1.25rem",
  },
});

function Footer() {
  return (
    <Container>
      <FooterStyled></FooterStyled>
    </Container>
  );
}

export default Footer;
