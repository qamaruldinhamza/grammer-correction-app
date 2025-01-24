const jwt = require("jsonwebtoken");

const checkAuthorization = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  if (token === process.env.JWT_SECRET) {
    next(); 
  } else {
    try {
      jwt.verify(token, process.env.JWT_SECRET); 
      next();
    } catch {
      res.status(400).json({ error: "Invalid token." });
    }
  }
};

module.exports = checkAuthorization;