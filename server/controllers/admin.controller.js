
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({
            message: "Error during admin login",
            error: error.message
        });
    }
};

module.exports = {
    loginAdmin
};