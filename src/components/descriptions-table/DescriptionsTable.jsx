import PropTypes from "prop-types";
import {
  styled,
  Table,
  TableBody,
  tableBodyClasses,
  TableCell,
  tableCellClasses,
  TableHead,
  tableHeadClasses,
  TableRow,
  tableRowClasses,
  Typography,
} from "@mui/material";

const SectionStyled = styled("div")({
  marginTop: "4rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  "& .title": {
    fontWeight: 600,
  },
});

const TableStyled = styled(Table)({
  [`& .${tableCellClasses.root}`]: {
    border: "1px solid #e0e0e0",
  },
  [`& .${tableBodyClasses.root}`]: {
    [`& .${tableRowClasses.root}`]: {
      "&:nth-of-type(odd)": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
  },
  [`& .${tableHeadClasses.root}`]: {
    [`& .${tableCellClasses.root}`]: {
      fontWeight: 600,
    },
  },
});

const HEADERS = ["Title", "Description"];

function DescriptionsTable({ title, data = [] }) {
  return (
    <SectionStyled>
      <Typography variant="h5" className="title">
        {title}
      </Typography>
      <TableStyled>
        <TableHead>
          <TableRow>
            {HEADERS.map((name, index) => (
              <TableCell
                key={name}
                align="center"
                width={index === 0 ? "200px" : undefined}
              >
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.title}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableStyled>
    </SectionStyled>
  );
}

export default DescriptionsTable;

DescriptionsTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};
