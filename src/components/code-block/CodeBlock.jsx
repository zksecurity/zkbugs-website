import PropTypes from "prop-types";
import { styled } from "@mui/material";

const CodeStyled = styled("div")({
  backgroundColor: "#f4f4f4",
  border: "1px solid #ddd",
  borderRadius: "0.5rem",
  padding: "8px",
  overflowX: "auto",
  textAlign: "left",
  lineHeight: "1.2",
  color: "#5b6f82",
  "& p": {
    fontFamily: "Roboto Mono, monospace !important",
  },
});

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
