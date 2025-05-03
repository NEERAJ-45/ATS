const express = require("express");
const { loginAdmin } = require("../controllers/admin.controller");
const {
    registerApplicant,
    loginApplicant,
} = require("../controllers/applicant.controller");
const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/applicant/register", registerApplicant);
router.post("/applicant/login", loginApplicant);

module.exports = router;
