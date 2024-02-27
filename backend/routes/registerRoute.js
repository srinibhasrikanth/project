const express = require("express");
const {
  registrationCourse,
  getEachController,
  saveAttendanceController,
  registeredController,
  markAttendanceController,
} = require("../controllers/registerController");

const router = express.Router();

router.post("/register-course/:courseId", registrationCourse);
router.put("/save-attendance", saveAttendanceController);

router.get("/get-register/:courseId", getEachController);

//registered or not
router.post("/get-registered-or-not/:courseId", registeredController);
module.exports = router;
