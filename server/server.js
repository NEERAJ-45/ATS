const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.config");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB

connectDB();

app.use("/auth", require("./routes/auth.route"));
app.use("/applicant", require("./routes/applicant.route"));

app.listen(3000, () => console.log("Backend running on port 3000"));
