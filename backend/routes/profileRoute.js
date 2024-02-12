const express = require("express");
const router = express.Router();
const multer = require("multer");
const Profile = require("../models/profileModel.js");
const { getHeaderName } = require("../controllers/profileController.js");

// Multer configuration for handling file uploads
const upload = multer({ dest: "uploads/" });

// POST route to update profile
router.put("/update", async (req, res) => {
  try {
    const { header } = req.body;

    // Create or update profile in the database
    await Profile.findOneAndUpdate({}, { header }, { upsert: true });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET route to retrieve profile header name
router.get("/", getHeaderName);

module.exports = router;
