const mongoose = require("mongoose");
const ROLL_NUMBER_PATTERN = /^(21071|20071|22071|23071)A\d{1,5}[a-zA-Z0-9]*$/;

const WHATSAPP_NUMBER_PATTERN = /^\d{10}$/;
const EMAIL_PATTERN = /\S+@\S+\.\S+/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rollNumber: { type: String },
    year: { type: String },
    branch: { type: String },
    section: { type: String },
    admission: { type: String },
    gender: { type: String },
    phoneNumber: { type: String },
    whatsappNumber: { type: String },
    personalEmail: { type: String },
    currentAddress: { type: String },
    permanentAddress: { type: String },
    laptop: { type: String },
    fatherName: { type: String },
    fatherProfession: { type: String },
    fatherCompany: { type: String },
    fatherWhatsappNumber: { type: String },
    fatherAddress: { type: String },
    motherName: { type: String },
    motherProfession: { type: String },
    motherCompany: { type: String },
    motherWhatsappNumber: { type: String },
    motherAddress: { type: String },
    username: { type: String },
    password: { type: String },
    delete: {
      type: Number,
      default: 0, // 0 means user is active, 1 means user is deleted
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const userModel = new mongoose.model("users", userSchema);
module.exports = userModel;
