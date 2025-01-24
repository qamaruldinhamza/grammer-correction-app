const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const grammarRoutes = require("./routes/grammar");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/grammar", grammarRoutes);

const PORT = 5000; 
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));