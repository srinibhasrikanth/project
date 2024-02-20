const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: "admin",
  },
  personalEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: "admin",
  },
  header: {
    type: String,
  },
  logo: {},
  role: {
    type: String,
    default: "1",
  },
});

const adminModel = new mongoose.model("admin", adminSchema);
module.exports = adminModel;
