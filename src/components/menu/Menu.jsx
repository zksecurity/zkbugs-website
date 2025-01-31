import { useState } from "react";
import PropTypes from "prop-types";
import { MenuItem, Menu as MuiMenu } from "@mui/material";

function Menu({ children, options = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button className="btn-unstyled" onClick={handleClick}>
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
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={handleClose}
            style={{ fontSize: "14px" }}
          >
            {option}
          </MenuItem>
        ))}
      </MuiMenu>
    </>
  );
}

export default Menu;

Menu.propTypes = {
  children: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};
