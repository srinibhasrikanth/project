const express = require("express");
const {
  saveAttendance,
  getAttendanceByCourse,
  downloadAttendance,
} = require("../controllers/attendanceController");
const router = express.Router();

// POST route to save attendance
router.post("/save-attendance/:courseId", saveAttendance);

//Route for displaying attendance
router.get("/get-attendance/:courseId", getAttendanceByCourse);

module.exports = router;
