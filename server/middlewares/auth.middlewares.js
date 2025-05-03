const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Try to get the token from cookies
    let token = req.cookies?.token;

    // If not found in cookies, fallback to Authorization header
    if (!token) {
        const authHeader = req.headers["authorization"];
        token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    }
    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. Noxxx token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

// Role-based authentication middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Insufficient permissions.",
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole,
};
