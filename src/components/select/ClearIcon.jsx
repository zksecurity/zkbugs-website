import { useMemo } from "react";
import PropTypes from "prop-types";
import { Cancel } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";

const ClearInputUnstyled = ({ value, onClear, className }) => {
  const isShown = useMemo(() => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return Boolean(value);
  }, [value]);

  return (
    <IconButton
      onClick={onClear}
      size="small"
      sx={{
        height: "1rem",
        width: "1rem",
        padding: 0,
        visibility: isShown ? "visible" : "hidden",
      }}
      className={className}
    >
      <Cancel sx={{ width: "100%", height: "100%" }} />
    </IconButton>
  );
};

const ClearInput = styled(ClearInputUnstyled)();
export default ClearInput;

ClearInputUnstyled.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onClear: PropTypes.func,
  className: PropTypes.string,
};
