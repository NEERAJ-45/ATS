const express = require("express");
const {
    getAllApplicants,
    getProfile,
} = require("../controllers/applicant.controller");
const {
    authenticateToken,
    authorizeRole,
} = require("../middlewares/auth.middlewares");
const router = express.Router();

router.get(
    "/applicants",
    authenticateToken,
    authorizeRole(["admin"]),
    getAllApplicants,
);

router.get(
    "/profile",
    authenticateToken,
    authorizeRole(["applicant"]),
    getProfile,
);
module.exports = router;
