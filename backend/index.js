const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path"); // Add path module
const multer = require("multer");

dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' directory within the 'client' folder
app.use(express.static(path.join(__dirname, "client", "public")));

// Routes
app.use("/api/v1/auth", require("./routes/authRoute.js"));
app.use("/api/v1/courses", require("./routes/courseRoute.js"));
app.use("/api/v1/resource", require("./routes/resourceRoute.js"));
app.use("/api/v1/user", require("./routes/userRoute.js"));
app.use("/api/v1/registration", require("./routes/registerRoute.js"));
app.use("/api/v1/admin", require("./routes/adminRoute.js"));
app.use("/api/v1/profile", require("./routes/profileRoute.js"));
app.use("/api/v1/attendance", require("./routes/attendanceRoute.js"));

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "client", "public", "uploads")); // Save files in client/public/uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post("/api/v1/upload", upload.single("image"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// Serve images
app.get("/api/v1/images/:filename", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client", "public", "uploads", req.params.filename)
  );
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
