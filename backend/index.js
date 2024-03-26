//import
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); //.env
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/auth", require("./routes/authRoute.js"));
app.use("/api/v1/courses", require("./routes/courseRoute.js"));
app.use("/api/v1/resource", require("./routes/resourceRoute.js"));
app.use("/api/v1/user", require("./routes/userRoute.js"));
app.use("/api/v1/registration", require("./routes/registerRoute.js"));
app.use("/api/v1/admin", require("./routes/adminRoute.js"));
app.use("/api/v1/profile", require("./routes/profileRoute.js"));
app.use("/api/v1/attendance", require("./routes/attendanceRoute.js"));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
