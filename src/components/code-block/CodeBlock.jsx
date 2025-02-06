import PropTypes from "prop-types";
import { styled } from "@mui/material";

const CodeStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
  padding: "8px",
  overflowX: "auto",
  textAlign: "left",
  lineHeight: "1.2",
  color: theme.palette.text.secondary,
  "& p": {
    fontFamily: "Roboto Mono, monospace !important",
  },
}));

function CodeBlock({ className, children }) {
  return (
    <CodeStyled className={className}>
      <p>{children}</p>
    </CodeStyled>
  );
}

export default CodeBlock;

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
