const Attendance = require("../models/attendanceModel.js");

const saveAttendance = async (req, res) => {
  try {
    const { courseId, date, rollNumberStatus } = req.body;

    const attendanceRecords = rollNumberStatus.map(
      ({ rollNumber, status }) => ({
        courseId,
        date,
        rollNumber,
        status,
      })
    );

    await Attendance.insertMany(attendanceRecords);

    res.status(200).json({ message: "Attendance data saved successfully" });
  } catch (error) {
    console.error("Error saving attendance data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  saveAttendance,
};
