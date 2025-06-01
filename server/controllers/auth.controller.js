const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Applicant = require("../models/applicant.model");
const { ApiError, ApiResponse } = require("../utils/ApiHandler");

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: admin._id, email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expiration (optional)
    );

    // Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json(
      ApiResponse.success("Admin login successful", {
        token,
        user: admin,
        role: "admin",
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(ApiError.serverError("Error during login"));
  }
};

const registerApplicant = async (req, res, next) => {
  try {
    const { fullName, email, password, gender, age, phone } = req.body;

    let existingApplicant = await Applicant.findOne({ email });
    if (existingApplicant) {
      throw ApiError.badRequest("Email is already registered");
    }
    existingApplicant = await Applicant.findOne({ phone });
    if (existingApplicant) {
      throw ApiError.badRequest("Phone number is already registered");
    }

    if (!email || !password) {
      throw ApiError.badRequest(
        "fullName, email, password, gender, age and phone are required"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newApplicant = new Applicant({
      fullName,
      email,
      password: hashedPassword,
      gender,
      age,
      phone,
    });

    await newApplicant.save();
    newApplicant.password = undefined;

    res
      .status(201)
      .json(
        ApiResponse.success("Applicant registered successfully", newApplicant)
      );
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    console.log("error: ", error);
    next(ApiError.serverError("Error registering applicant"));
  }
};

const loginApplicant = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest("Email and password are required");
    }

    const user = await Applicant.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const token = jwt.sign(
      { _id: user._id, email, role: "applicant" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expiration (optional)
    );

    // Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json(
      ApiResponse.success("Login successful", {
        token,
        user,
        role: "applicant",
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.serverError("Error during login"));
    }
  }
};

const getUser = async (req, res, next) => {
  try {
    let user;
    console.log("user role: ", req.user.role);
    console.log("controller email: ", req.user.email);

    if (req.user.role === "admin") {
      user = await Admin.findOne({ email: req.user.email }).select("-password");
    } else {
      user = await Applicant.findOne({ email: req.user.email }).select(
        "-password"
      );
    }

    console.log("controller user: ", user);

    if (!user) throw ApiError.unauthorized("Not Logged In!!");
    let role = "admin";
    if (user?.age) role = "applicant";

    return res
      .status(200)
      .json(ApiResponse.success("User is Logged in ", { user, role }));
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.serverError("Error " + error.message));
    }
  }
};

module.exports = {
  loginAdmin,
  registerApplicant,
  loginApplicant,
  getUser,
};
