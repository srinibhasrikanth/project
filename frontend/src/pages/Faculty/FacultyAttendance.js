import React, { useState } from "react";
import FacultyNavbar from "../../components/FacultyNavbar";
import { TextField, Typography, Button, Select, MenuItem } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";

const FacultyAttendance = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSessionDate, setSelectedSessionDate] = useState("");
  const [sessionDates, setSessionDates] = useState([]);
  const [numberOfSessions, setNumberOfSessions] = useState(0);

  const calculateSessionDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const sessionDates = [];

      let currentDate = new Date(start);
      while (currentDate <= end) {
        sessionDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setSessionDates(sessionDates);
      setSelectedSessionDate(sessionDates[0]);
    }
  };

  const calculateNumberOfSessions = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate the difference in milliseconds between start and end dates
      const differenceInMilliseconds = end - start;

      // Calculate the number of sessions (each 2 hours long)
      const numberOfSessions =
        Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)) * 2;
      setNumberOfSessions(numberOfSessions);
    }
  };

  return (
    <>
      <FacultyNavbar />
      <div className="m-2">
        <div className="flex flex-row justify-between items-center">
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Attendance for the course:{" C++ "}
          </Typography>
          <div>
            <CiMenuKebab className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <TextField
            id="start-date"
            label="Start Date"
            variant="standard"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            id="end-date"
            label="End Date"
            variant="standard"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button variant="contained" onClick={calculateSessionDates}>
            Generate Session Dates
          </Button>
        </div>
        {sessionDates.length > 0 && (
          <div className="flex justify-center mt-4">
            <Select
              id="session-date"
              value={selectedSessionDate}
              onChange={(e) => setSelectedSessionDate(e.target.value)}
            >
              {sessionDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {date.toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button variant="contained" onClick={calculateNumberOfSessions}>
            Calculate Sessions
          </Button>
        </div>
        {numberOfSessions > 0 && (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            Number of sessions: {numberOfSessions}
          </Typography>
        )}
      </div>
    </>
  );
};

export default FacultyAttendance;
