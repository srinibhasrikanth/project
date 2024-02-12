const express = require("express");
const userModel = require("../models/userModel"); // Ensure userModel is correctly imported
const router = express.Router();

// Define route to handle user data retrieval by user ID
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // Find user by ID in the database using the userModel
    const user = await userModel.findById(userId);
    if (!user) {
      // If user is not found, return a 404 response
      return res.status(404).json({ message: "User not found" });
    }
    // If user is found, return user details with a 200 response
    res.status(200).json(user);
  } catch (error) {
    // If an error occurs during database operation, return a 500 response
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
