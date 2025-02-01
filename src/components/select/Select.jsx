import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import ClearInput from "./ClearIcon";

function Select({
  label,
  placeholder,
  id,
  className,
  value,
  options = [],
  onChange,
}) {
  const labelId = useMemo(
    () => (id ? `${id}-label` : `${Math.random()}-label`),
    [id]
  );

  const handleClear = useCallback(() => {
    onChange({ target: { value: "" } });
  }, [onChange]);

  return (
    <FormControl fullWidth className={className} size="small">
      <InputLabel id={labelId} sx={{ fontSize: "14px" }}>
        {label}
      </InputLabel>
      <MuiSelect
        labelId={labelId}
        id={id}
        label={label}
        value={value}
        placeholder={placeholder}
        variant="standard"
        endAdornment={
          <ClearInput
            value={value}
            sx={{ marginRight: "1.25rem" }}
            onClear={handleClear}
          />
        }
        sx={{
          fontSize: "14px",
          '& .MuiSelect-select[role="combobox"]': {
            paddingRight: 0,
          },
        }}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value} sx={{ fontSize: "14px" }}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

export default Select;

Select.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};
