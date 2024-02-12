const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  // Modify attendance to an array of objects
  attendance: [
    {
      date: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["Present", "Absent", "Late"], // Add other possible statuses if needed
        default: "Absent", // Default status for a new attendance record
      },
    },
  ],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses", // Assuming your course collection name is 'courses'
    required: true,
  },
});

const registerModel = mongoose.model("registrations", registerSchema);
module.exports = registerModel;
