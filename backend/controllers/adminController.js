const adminModel = require("../models/adminModel");
const path = require("path");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const updateProfile = async (req, res) => {
  try {
    const { header } = req.body;
    let logo = "";

    if (req.file) {
      logo = req.file.filename; // Uploaded file's filename
    }

    // Create or update admin profile in the database
    let admin = await adminModel.findOne();
    if (!admin) {
      admin = new adminModel({ header, logo });
    } else {
      admin.header = header;
      if (logo) {
        admin.logo = logo;
      }
    }
    await admin.save();

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", logo });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const resetPasswordController = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    // Check if newPassword is provided and not empty
    if (!newPassword) {
      return res.status(400).json({ error: "Invalid newPassword" });
    }

    // Verify the JWT token
    JWT.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
      }

      try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Pass newPassword and saltRounds (10) as arguments

        // Update the user's password in the database
        await adminModel.findByIdAndUpdate(id, { password: hashedPassword });

        // Send success response
        return res.status(200).json({ message: "Password reset successful" });
      } catch (error) {
        console.error("Error hashing password or updating database:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const retrieveController = async (req, res) => {
  try {
    // Query the database for the admin profile
    const admin = await adminModel.findOne();

    // If admin profile exists, retrieve header and logo
    if (admin) {
      const { header, logo } = admin;
      res.status(200).json({ header, logo });
    } else {
      res.status(404).json({ message: "Admin profile not found" });
    }
  } catch (error) {
    console.error("Error retrieving admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { updateProfile, retrieveController, resetPasswordController };
