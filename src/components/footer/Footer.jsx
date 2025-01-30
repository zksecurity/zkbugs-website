import { styled } from "@mui/material";
import Container from "../layout/Container";

const FooterStyled = styled("footer")({
  // backgroundColor: "#111821",
  width: "100%",
  paddingTop: "2rem",
  paddingBottom: "2rem",
  marginTop: "4rem",
  "& .copyright-disclaimer": {
    color: "#a3a3a3",
    backgroundColor: "##111111",
  },
});

function Footer() {
  return (
    <FooterStyled>
      <Container></Container>
    </FooterStyled>
  );
}

export default Footer;
