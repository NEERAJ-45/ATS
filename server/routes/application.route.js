const express = require("express");
const {
    getAllApplications,
    getAcceptedApplications,
    getRejectedApplications,
    acceptApplication,
    rejectApplication,
    download,
} = require("../controllers/application.controller");
const {
    authenticateToken,
    authorizeRole,
} = require("../middlewares/auth.middlewares");
const { apply } = require("../controllers/application.controller");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
    "/apply",
    upload.single("resume"),
    authenticateToken,
    authorizeRole(["applicant"]),
    apply,
);

router.get(
    "/applications",
    authenticateToken,
    authorizeRole(["admin"]),
    getAllApplications,
);

router.post(
    "/accept",
    authenticateToken,
    authorizeRole(["admin"]),
    acceptApplication,
);

router.post(
    "/reject",
    authenticateToken,
    authorizeRole(["admin"]),
    rejectApplication,
);

router.get(
    "/accepted",
    authenticateToken,
    authorizeRole(["admin"]),
    getAcceptedApplications,
);

router.get(
    "/rejected",
    authenticateToken,
    authorizeRole(["admin"]),
    getRejectedApplications,
);

router.get("/download/:id", authenticateToken, authorizeRole(["admin"]), download);
module.exports = router;
