const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const adminModel = require("../models/adminModel");
const {
  retrieveController,
  resetPasswordController,
} = require("../controllers/adminController");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating upload directory:", err);
      }
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Multer upload middleware
const upload = multer({ storage });

// Update profile route
router.post("/update-profile", upload.single("logo"), async (req, res) => {
  try {
    const { header } = req.body;
    const logo = req.file ? req.file.path : null;

    // Update the admin profile in the database
    await adminModel.findOneAndUpdate(
      { username: "admin" },
      { header, logo },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

// Get header and logo for navbar
router.get("/navbar", async (req, res) => {
  try {
    // Fetch admin profile from the database
    const admin = await adminModel.findOne();

    // Check if admin profile exists
    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    // Extract header and logo from admin profile
    const { header, logo } = admin;
    const logoUrl = logo ? `/uploads/${path.basename(logo)}` : null;

    res.status(200).json({ header, logoUrl });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//router.get("/image", retrieveController);

router.put("/reset-password/:id/:token", resetPasswordController);

module.exports = router;
