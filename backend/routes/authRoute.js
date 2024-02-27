const express = require("express");
const mongoose = require("mongoose");
const {
  registerController,
  loginController,
  loginAdminController,
  registerAdminController,
  forgotPasswordController,
  resetPasswordController,
  razorPayController,
  getAllUsersController,
  deleteUserController,
  dynamicCounterController,
} = require("../controllers/authController");
const userModel = require("../models/userModel.js");
const {
  requireSignIn,
  isAdmin,
  authenticateJWT,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Register post method
router.post("/register", registerController);

// Register admin
router.post("/admin-register", registerAdminController);

// Login post method
router.post("/login", loginController);

//forgot-password
router.post("/forgot-password", forgotPasswordController);

//reset-password
router.post("/reset-password/:id/:token", resetPasswordController);

//payment

router.post("/payment", razorPayController);

// Login post method for admin
router.post("/admin-login", loginAdminController);

router.put("/reset-password/:id/:token", resetPasswordController);

router.get("/get-all-users", getAllUsersController);
// Get user details
router.get("/user-details", authenticateJWT, async (req, res) => {
  try {
    const userDetails = req.user;

    console.log("userDetails:", userDetails);

    if (!userDetails) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Fetch more details from the database based on user information
    const userFromDB = await userModel.findOne({
      _id: userDetails._id,
    });

    res.status(200).send({
      success: true,
      user: userFromDB,
    });
  } catch (error) {
    console.error("Error in /user-details route:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

/* Get details of a specific user
router.get("/user/:userId", authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user details from the database based on the user ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.send({ success: true, user });
  } catch (error) {
    console.error("Error in /user/:userId route:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});*/

// Protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/delete-user/:userid", deleteUserController);

router.get("/dynamic-counter", dynamicCounterController);

module.exports = router;
