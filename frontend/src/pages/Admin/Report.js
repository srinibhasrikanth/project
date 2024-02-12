import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const rows = [
  {
    sno: 1,
    rollNo: "A001",
    stdName: "John Doe",
    year: "1st",
    branch: "Computer Science",
    section: "A",
  },
  {
    sno: 2,
    rollNo: "A002",
    stdName: "Jane Doe",
    year: "2nd",
    branch: "Electrical Engineering",
    section: "B",
  },
  {
    sno: 3,
    rollNo: "A003",
    stdName: "Alice Smith",
    year: "3rd",
    branch: "Mechanical Engineering",
    section: "C",
  },
  // ... add more entries as needed
];

const ReportTable = () => {
  return (
    <TableContainer
      component={Paper}
      sx={{ margin: "auto", maxWidth: "80%", marginTop: "20px" }}
    >
      <Table aria-label="basic table">
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Roll No.</TableCell>
            <TableCell>Std. Name</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Section</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.sno}>
              <TableCell>{row.sno}</TableCell>
              <TableCell>{row.rollNo}</TableCell>
              <TableCell>{row.stdName}</TableCell>
              <TableCell>{row.year}</TableCell>
              <TableCell>{row.branch}</TableCell>
              <TableCell>{row.section}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
