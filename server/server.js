const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db.config");
const { globalErrorHandler } = require("./utils/ApiHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/auth", require("./routes/auth.route"));
app.use("/applicant", require("./routes/applicant.route"));
app.use("/application", require("./routes/application.route"));

app.use(globalErrorHandler);
app.listen(3000, () => console.log("Backend running on port 3000"));
