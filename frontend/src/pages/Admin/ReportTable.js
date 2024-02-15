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

const ReportTable = ({ courseId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [resourcePerson, setResourcePerson] = useState("");
  const [header, setHeader] = useState("");
  const [startDate, setStartDate] = useState("");
  const [timing, setTiming] = useState("");
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const courseId = window.location.pathname.split("/").pop();
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
  const token = JSON.parse(localStorage.getItem("auth")).token;
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseId = window.location.pathname.split("/").pop();
        const response = await axios.get(
          `http://localhost:8000/api/v1/courses/get-course/${courseId}`
        );
        console.log(response);
        setStartDate(response.data.course.startDate);
        setTiming(response.data.course.timing);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCourses();
  }, [token]);

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
  const fetchHeader = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/profile");
      setHeader(response.data.header);
    } catch (error) {
      console.error("Error fetching header:", error);
    }
  };

  useEffect(() => {
    fetchHeader(); // Fetch the header when the component mounts
  }, []);

  // const downloadPdf = () => {
  //   const doc = new jsPDF();
  //   doc.text(`${header}`, 32, 10);
  //   doc.text(`Course Name: ${courseName}`, 14, 20);
  //   doc.text(`Resource Person: ${resourcePerson}`, 14, 30);
  //   doc.text(`Start Date: ${startDate}`, 14, 40);
  //   doc.text(`Timing: ${timing}`, 14, 50);

  //   doc.autoTable({
  //     startY: 60,
  //     head: [["S.No", "Roll No.", "Std. Name", "Year", "Branch", "Section"]],
  //     body: registrations.map((reg, index) => [
  //       index + 1,
  //       reg.rollNumber,
  //       reg.name,
  //       reg.year,
  //       reg.branch,
  //       reg.section,
  //     ]),
  //   });
  //   doc.save(`${courseName}.pdf`);
  // };
  const downloadPdf = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Calculate text width of the college name
    const collegeName = header; // Assuming header contains the college name
    const textWidth =
      (doc.getStringUnitWidth(collegeName) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;

    // Add course details
    doc.text(`Course Name: ${courseName}`, 14, 30);
    doc.text(`Resource Person: ${resourcePerson}`, 14, 40);
    doc.text(`Start Date: ${startDate}`, 14, 50);
    doc.text(`Timing: ${timing}`, 14, 60);
    // Calculate starting Y position for the table based on college name length
    const startY =
      20 +
      (textWidth > doc.internal.pageSize.getWidth()
        ? 20
        : doc.getTextDimensions(collegeName).h);

    // Add college name at the top center
    doc.text(
      collegeName,
      (doc.internal.pageSize.getWidth() - textWidth) / 2,
      10
    );

    // Add table to PDF document
    doc.autoTable({
      startY: 70 + doc.getTextDimensions(header).h, // Start table below the header
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

    // Save the PDF
    doc.save(`${courseName}.pdf`);
  };

  return (
    <>
      <AdminNavbar />
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
                <TableCell style={{ textAlign: "center" }}>S.No</TableCell>
                <TableCell style={{ textAlign: "center" }}>Roll No.</TableCell>
                <TableCell style={{ fontWeight: "bold", width: "40%" }}>
                  Student Name
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Year</TableCell>
                <TableCell style={{ textAlign: "center" }}>Branch</TableCell>
                <TableCell style={{ textAlign: "center" }}>Section</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "center" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {registration.rollNumber}
                  </TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {registration.year}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {registration.branch}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {registration.section}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default ReportTable;
