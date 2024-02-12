const express = require("express");
const {
  createCourseController,
  getCoursesController,
  editCourseController,
  deactivateCourseController,
  activateCourseController,
  updateCourseStatus,
  getEachController,
  deleteAllRecords,
  getCourseByInstructor,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.put("/edit-course/:id", editCourseController);
router.put("/activate/:id", activateCourseController);
router.put("/deactivate/:id", deactivateCourseController);
router.post("/create-course", createCourseController);
// No need to include the token in the route for GET requests
router.get("/get-all-courses", getCoursesController);
router.get("/get-course/:courseId", getEachController);
router.get("/delete-all", deleteAllRecords);
router.get("/get-course-by-instructor/:id", getCourseByInstructor);
router.delete("/:id", deleteCourse);
router.put("/update-course/:courseId", updateCourse);
module.exports = router;
