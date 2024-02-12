const jwt = require("jsonwebtoken");

// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.query.token; // Assuming the token is sent in the query parameter

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
