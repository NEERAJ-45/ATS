const express = require("express");

const {authenticateToken,authorizeRole} = require("../middlewares/auth.middlewares")
const {
    loginAdmin,
    registerApplicant,
    loginApplicant,
    getUser,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/applicant/register", registerApplicant);
router.post("/applicant/login", loginApplicant);


router.get("/user",authenticateToken,authorizeRole(["admin","applicant"]),getUser)
module.exports = router;
