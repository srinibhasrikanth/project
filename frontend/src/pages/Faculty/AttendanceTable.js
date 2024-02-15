import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";

export default function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const courseId = window.location.pathname.split("/").pop();
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/attendance/get-attendance/${courseId}`
        );

        setDates(response.data.datesArray);
        setAttendanceData(response.data.attendance);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, [courseId]);

  console.log("Attendance Data:", attendanceData);
  console.log("Dates:", dates);

  // Check if attendanceData or dates are empty or undefined before mapping over them
  if (!attendanceData || !dates) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="attendance table">
          <TableHead>
            <TableRow>
              <TableCell>Roll Number</TableCell>
              {/* Display dates dynamically */}
              {dates.map((date, index) => (
                <TableCell key={index}>{date}</TableCell>
              ))}
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Iterate over attendance data */}
            {attendanceData.map((record, recordIndex) => (
              <TableRow key={recordIndex}>
                <TableCell>{record.rollNumber}</TableCell>
                {/* Iterate over details for each record */}
                {dates.map((date, dateIndex) => (
                  <TableCell key={dateIndex}>
                    {/* Find status for the current date */}
                    {record.details.find((detail) => detail.date === date)
                      ?.rollNumberStatus || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
