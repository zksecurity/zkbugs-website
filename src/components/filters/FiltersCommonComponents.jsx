import { FilterAltOutlined } from "@mui/icons-material";
import { Badge, styled } from "@mui/material";

export const ContainerStyled = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  overflowX: "auto",
  "& .filters-inputs-container": {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    overflowX: "auto",
  },
  "& .filter-input": {
    minWidth: "180px",
  },
});

export const FilterBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: "1.25rem",
    height: "1.25rem",
    [theme.breakpoints.down("sm")]: {
      width: "1rem",
      height: "1rem",
    },
  },
}));

export const FiltersIcon = styled(FilterAltOutlined)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "2rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));
