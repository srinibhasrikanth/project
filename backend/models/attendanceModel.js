const mongoose = require("mongoose");

// Define the schema for attendance records
const attendanceSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses", // Assuming Course is the model for the course
    required: true,
  },
  details:[
    {
  date: {
    type: String,
    required: true,
  },
  rollNumberStatus: {
    type: Map,
    of: String,
    required: true,
  },
}
]
});

// Define the Attendance model
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
