const express = require("express");
const {
  createResourceController,
  getResourceController,
  resourceLoginController,
  resetPassword,
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/create-instructor", createResourceController);

router.get("/get-instructor", getResourceController);

router.post("/instructor-login", resourceLoginController);

//reset-password
router.put("/reset-password/:id/:token", resetPassword);

module.exports = router;
