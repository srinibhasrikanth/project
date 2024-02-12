import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import FacultyNavbar from "../../components/FacultyNavbar";

const FacultyReport = ({ courseId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [resourcePerson, setResourcePerson] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const courseId = window.location.pathname.split("/").pop(); // Assuming the course ID is the last part of the URL

        const response = await axios.get(
          `http://localhost:8000/api/v1/registration/get-register/${courseId}`
        );
        setRegistrations(response.data.registrations);
        setCourseName(response.data.courseName);
        setResourcePerson(response.data.resourcePerson);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, [courseId]);

  const downloadExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.table_to_sheet(
        document.getElementById("report-table")
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(blob, `${courseName}.xlsx`);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text(`Course Name: ${courseName}`, 14, 15);
    doc.text(`Resource Person: ${resourcePerson}`, 14, 25);

    doc.autoTable({
      startY: 35,
      head: [["S.No", "Roll No.", "Std. Name", "Year", "Branch", "Section"]],
      body: registrations.map((reg, index) => [
        index + 1,
        reg.rollNumber,
        reg.name,
        reg.year,
        reg.branch,
        reg.section,
      ]),
    });
    doc.save(`${courseName}.pdf`);
  };

  return (
    <>
      <FacultyNavbar />
      <div>
        <TableContainer
          component={Paper}
          sx={{ margin: "auto", maxWidth: "90%", marginTop: "20px" }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", justifyContent: "center", marginTop: "4px" }}
          >
            COURSE NAME: {courseName}
          </Typography>
          <Typography
            variant="h5"
            sx={{ display: "flex", justifyContent: "center", marginTop: "4px" }}
          >
            RESOURCE PERSON: {resourcePerson}
          </Typography>

          <div className="flex justify-end space-x-2 mr-2">
            <Button
              variant="contained"
              sx={{
                marginTop: "20px",
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
              onClick={downloadExcel}
            >
              Download Excel
            </Button>

            <Button
              variant="contained"
              sx={{
                marginTop: "20px",
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
              onClick={downloadPdf}
            >
              Download PDF
            </Button>
          </div>
          <Table aria-label="basic table" id="report-table">
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
              {registrations.map((registration, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{registration.rollNumber}</TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell>{registration.year}</TableCell>
                  <TableCell>{registration.branch}</TableCell>
                  <TableCell>{registration.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default FacultyReport;
