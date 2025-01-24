const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middlewares/auth");
const checkAuthorization = require("../middlewares/checkAuthorization");
const { addUser, findUserByUsername } = require("../models/user");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", checkAuthorization, async (req, res) => {
  const { username, password } = req.body;

  const user = findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
});

router.post("/register", checkAuthorization, async (req, res) => {
  const { username, password } = req.body;

  const userExists = findUserByUsername(username);
  if (userExists) {
    return res.status(400).json({ error: "Username already exists. Please choose another one." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  addUser(username, hashedPassword);

  res.status(201).json({ message: "User registered successfully" });
});

router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;