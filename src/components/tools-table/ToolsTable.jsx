import { useEffect, useState } from "react";
import {
  Link,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  tableRowClasses,
} from "@mui/material";
import { api } from "../../api/api";

const TableHeadStyled = styled(TableHead)({
  [`& .${[tableRowClasses.root]}`]: {
    [`& .${[tableCellClasses.root]}`]: {
      fontWeight: 600,
    },
  },
});

function ToolsTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.fetchSecurityTools().then((tools) => {
      setRows(tools);
    });
  }, []);

  return (
    <Table>
      <TableHeadStyled>
        <TableRow>
          <TableCell>Tool</TableCell>
          <TableCell>URL</TableCell>
          <TableCell>DSL</TableCell>
          <TableCell>Analysis</TableCell>
        </TableRow>
      </TableHeadStyled>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.tool}</TableCell>
            <TableCell>
              <Link href={row.url} target="_blank">
                {row.url}
              </Link>
            </TableCell>
            <TableCell>{row.dsl}</TableCell>
            <TableCell>{row.analysis}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ToolsTable;
