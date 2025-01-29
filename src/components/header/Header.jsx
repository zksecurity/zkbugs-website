import { styled } from "@mui/material";
import Container from "../layout/Container";

const HeaderStyled = styled("div")({
  padding: "1.75rem 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

function Header() {
  return (
    <Container>
      <HeaderStyled>Header</HeaderStyled>
    </Container>
  );
}

export default Header;
