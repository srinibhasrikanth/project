// models/Profile.js

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  header: String,
  logo: String, // You can store the path to the uploaded logo file here
});

module.exports = mongoose.model("Profile", profileSchema);
