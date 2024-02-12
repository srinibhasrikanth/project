const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
  },
  startDate: {
    type: String,
  },
  timing: {
    type: String,
  },
  resourcePerson: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  active: {
    type: Number,
    default: 0,
  },
  registrationCount: {
    type: Number,
    default: 0,
  },
  upcoming: {
    type: Number,
    default: 1,
  },
});

courseSchema.statics.activateCourse = async function (courseId) {
  try {
    return await this.findByIdAndUpdate(
      courseId,
      { active: "1", upcoming: "0" },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

courseSchema.statics.deactivateCourse = async function (courseId) {
  try {
    return await this.findByIdAndUpdate(
      courseId,
      { active: "0", upcoming: "0" },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

const courseModel = mongoose.model("course", courseSchema);

module.exports = courseModel;
