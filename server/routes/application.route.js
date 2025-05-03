const express = require("express");
const {
    getAllApplications,
    acceptApplication,
    rejectApplication,
} = require("../controllers/application.controller");
const {
    authenticateToken,
    authorizeRole,
} = require("../middlewares/auth.middlewares");
const router = express.Router();

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

module.exports = router;
