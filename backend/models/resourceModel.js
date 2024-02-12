const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
});

const resourceModel = new mongoose.model("resource", resourceSchema);

module.exports = resourceModel;
