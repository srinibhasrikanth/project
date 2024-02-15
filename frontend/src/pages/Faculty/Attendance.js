import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FacultyNavbar from "../../components/FacultyNavbar";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TextField from "@mui/material/TextField";

import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export default function Attendance() {
  const [selectAll, setSelectAll] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [attendanceObject, setAttendanceObject] = useState({});

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const courseId = window.location.pathname.split("/").pop();

        const response = await axios.get(
          `http://localhost:8000/api/v1/registration/get-register/${courseId}`
        );
        setRegistrations(response.data.registrations);
        setCourseName(response.data.courseName);
        setPhoneNumber(response.data.userDetails);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleCheckboxChange = (index) => {
    const newRegistrations = [...registrations];
    newRegistrations[index].attendance = !newRegistrations[index].attendance;
    setRegistrations(newRegistrations);

    // Update attendance object
    const newAttendanceObject = { ...attendanceObject };
    newAttendanceObject[newRegistrations[index].rollNumber] = newRegistrations[
      index
    ].attendance
      ? "Present"
      : "Absent";
    setAttendanceObject(newAttendanceObject);
  };

  const handleSelectAll = () => {
    const newRegistrations = registrations.map((registration) => ({
      ...registration,
      attendance: !selectAll,
    }));
    setRegistrations(newRegistrations);
    setSelectAll(!selectAll);

    // Update attendance object
    const newAttendanceObject = {};
    newRegistrations.forEach((registration) => {
      newAttendanceObject[registration.rollNumber] = !selectAll
        ? "Present"
        : "Absent";
    });
    setAttendanceObject(newAttendanceObject);
  };
  // const handleSave = async () => {
  //   try {
  //     const courseId = window.location.pathname.split("/").pop();

  //     // Send the updated attendance data to the backend
  //     const response = await axios.post(
  //       `http://localhost:8000/api/v1/attendance/save-attendance/${courseId}`,
  //       {
  //         date: attendanceDate,
  //         rollNumberStatus: attendanceObject,
  //       }
  //     );

  //     // Handle the response as needed
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error saving attendance data:", error);
  //   }
  // };
  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

  const handleSave = async () => {
    try {
      const courseId = window.location.pathname.split("/").pop();

      // Create an object to store attendance data
      const attendanceObject = {
        date: attendanceDate,
        rollNumberStatus: {},
      };

      // Loop through registrations to construct rollNumberStatus
      registrations.forEach((registration) => {
        // Add roll number and attendance status to rollNumberStatus object
        attendanceObject.rollNumberStatus[registration.rollNumber] =
          registration.attendance ? "present" : "absent";
      });

      // Log the attendance object in the console
      console.log(attendanceObject);

      // Send the attendance object to the backend for further processing if needed
      const response = await axios.post(
        `http://localhost:8000/api/v1/attendance/save-attendance/${courseId}`,
        attendanceObject
      );
      toast.success("Attendance submitted successfully");
      // Handle the response as needed
      // console.log(response.data);
    } catch (error) {
      console.error("Error saving attendance data:", error);
    }
  };
  const handleExportToPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Add course name and attendance date to the PDF
    doc.text(`Course Name: ${courseName}`, 14, 10);
    doc.text(`Attendance Date: ${attendanceDate}`, 14, 20);

    // Define columns for the table
    const columns = [
      "Serial No",
      "Roll No",
      "Name",
      "Branch",
      "Section",
      "Phone No",
      "Attendance",
    ];

    // Define rows for the table
    const rows = registrations.map((registration, index) => [
      index + 1,
      registration.rollNumber,
      registration.name,
      registration.branch,
      registration.section,
      phoneNumber[index],
      registration.attendance ? "Present" : "Absent",
    ]);

    // Add table to PDF document
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30, // Adjust the starting Y position as needed
    });

    // Save the PDF
    doc.save("attendance.pdf");
  };

  return (
    <>
      <FacultyNavbar />

      <div
        style={{ padding: "20px", textAlign: "center", position: "relative" }}
      >
        <Typography variant="h4">{courseName}</Typography>
        <TextField
          type="date"
          value={attendanceDate}
          onChange={handleDateChange}
          sx={{ marginTop: "10px" }}
        />
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
          onClick={handleExportToPDF}
        >
          Download Attendance
        </Button>
        <div className="flex justify-end space-x-2 mr-2">
          <Button
            onClick={handleSave}
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
          >
            Save
          </Button>
        </div>

        <TableContainer
          component={Paper}
          sx={{ width: "80%", margin: "auto", marginTop: "60px" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="attendance table">
            <TableHead>
              <TableRow>
                <TableCell>Serial No</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Phone No</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{registration.rollNumber}</TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell>{registration.branch}</TableCell>
                  <TableCell>{registration.section}</TableCell>
                  <TableCell>{phoneNumber[index]}</TableCell>

                  <TableCell>
                    <Checkbox
                      checked={registration.attendance}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
