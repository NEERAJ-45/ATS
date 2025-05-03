const express = require("express");
const multer = require("multer");
const {
    submitApplication,
    getAllApplicants,
} = require("../controllers/applicant.controller");
const {
    authenticateToken,
    authorizeRole,
} = require("../middlewares/auth.middlewares");
const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/register", upload.single("resume"), submitApplication);

router.get(
    "/applicants",
    authenticateToken,
    authorizeRole(["admin"]),
    getAllApplicants,
);

module.exports = router;
