const Attendance = require("../models/attendanceModel.js");

// Controller function to save attendance
const saveAttendance = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { date, rollNumberStatus } = req.body;

    // Find the existing attendance record for the courseId
    let attendanceRecord = await Attendance.findOne({ courseId });

    if (!attendanceRecord) {
      // If no attendance record exists, create a new one
      attendanceRecord = new Attendance({
        courseId,
        details: [],
      });
    }

    // Check if the date already exists in the details array
    const existingDate = attendanceRecord.details.find(
      (detail) => detail.date === date
    );

    if (existingDate) {
      // If the date already exists, return a 400 error response
      return res.status(400).json({
        error: "Duplicate date. Attendance for this date already exists.",
      });
    }

    // Push the new attendance details into the details array
    attendanceRecord.details.push({ date, rollNumberStatus });

    // Save the updated attendance record to the database
    await attendanceRecord.save();

    res.status(200).json({
      message: "Attendance saved successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Internal server error", error });
  }
};

const getAttendanceByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find attendance records for the specified courseId
    const attendance = await Attendance.findOne({ courseId });

    // // Extract unique dates from the attendance records
    // const uniqueDates = new Set();
    // attendance.forEach((record) => {
    //   record.details.forEach((detail) => {
    //     uniqueDates.add(detail.date);
    //   });
    // });

    // // Convert the set of unique dates to an array
    // const datesArray = [...uniqueDates];

    res.status(200).json({
      attendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { saveAttendance, getAttendanceByCourse };
