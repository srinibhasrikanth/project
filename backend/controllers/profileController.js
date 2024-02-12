// controllers/profileController.js

const Profile = require("../models/profileModel.js");

const getHeaderName = async (req, res) => {
  try {
    // Assuming you have a single document in the profile collection
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ header: profile.header });
  } catch (error) {
    console.error("Error fetching header name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { header } = req.body;

    // Create or update profile in the database
    await Profile.findOneAndUpdate({}, { header }, { upsert: true });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateProfile, getHeaderName };
