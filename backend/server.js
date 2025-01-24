require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const grammarRoutes = require("./routes/grammar");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));

app.use("/auth", authRoutes);
app.use("/grammar", grammarRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));