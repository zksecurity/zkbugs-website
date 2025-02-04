import { useState } from "react";
import PropTypes from "prop-types";
import { MenuItem, Menu as MuiMenu } from "@mui/material";
import clsx from "clsx";

function Menu({ className, children, options = [], onSelect, renderOption }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => () => {
    if (option.component) {
      return;
    }

    if (typeof onSelect === "function") {
      onSelect(option);
    }
    handleClose();
  };

  return (
    <>
      <button className={clsx("btn-unstyled", className)} onClick={handleClick}>
        {children}
      </button>
      <MuiMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={handleSelect(option)}
            sx={{ fontSize: "14px", width: "100%" }}
          >
            {renderOption ? renderOption(option) : option}
          </MenuItem>
        ))}
      </MuiMenu>
    </>
  );
}

export default Menu;

Menu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      component: PropTypes.node,
    })
  ),
  onSelect: PropTypes.func,
  renderOption: PropTypes.func,
};
