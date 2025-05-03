const express = require("express");
const {
    loginAdmin,
    registerApplicant,
    loginApplicant,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/applicant/register", registerApplicant);
router.post("/applicant/login", loginApplicant);

module.exports = router;
