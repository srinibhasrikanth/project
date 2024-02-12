const express = require("express");
const { saveAttendance } = require("../controllers/attendanceController");
const router = express.Router();

// POST route to save attendance
router.post("/save-attendance", saveAttendance);

module.exports = router;
