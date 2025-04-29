const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Applicant = require("../models/applicant.model");
const Application = require("../models/Application");
const { ApiResponse, ApiError } = require("../../utils/ApiHandler");

const registerApplicant = async (req, res, next) => {
    try {
        const { name, email, password, gender, age, phone, skills } = req.body;

        if (!email || !password) {
            throw ApiError.badRequest("Email and password are required");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newApplicant = new Applicant({
            name,
            email,
            password: hashedPassword,
            gender,
            age,
            phone,
            skills: skills || [],
            resumePath: "",
            resumeScore: 0,
            status: "",
        });

        await newApplicant.save();
        delete newApplicant.password;
        delete newApplicant.resumePath;
        delete newApplicant.resumeScore;
        res.status(201).json(
            ApiResponse.success(
                "Applicant registered successfully",
                newApplicant.select("-password"),
            ),
        );
    } catch (error) {
        if (error.code === 11000) {
            next(ApiError.badRequest("Email or phone number already exists"));
            return;
        }
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
            { userId: user._id, role: "applicant" },
            process.env.JWT_SECRET,
        );

        res.json(ApiResponse.success("Login successful", { token }));
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(ApiError.serverError("Error during login"));
        }
    }
};

const submitApplication = async (req, res, next) => {
    try {
        const { name, email, phone, skills } = req.body;
        const resume = req.file;

        if (!resume) {
            throw ApiError.badRequest("Resume file is required");
        }

        const response = await axios.post(
            "http://localhost:5000/score",
            {},
            {
                headers: { "Content-Type": "multipart/form-data" },
                data: { resume: resume },
            },
        );

        const newApplicant = await Applicant.create({
            name,
            email,
            phone,
            skills: skills.split(","),
            resumePath: resume.filename,
            resumeScore: response.data.score,
        });

        res.json(
            ApiResponse.success(
                "Application submitted successfully",
                newApplicant,
            ),
        );
    } catch (error) {
        next(ApiError.serverError("Error submitting application"));
    }
};

const getAllApplicants = async (req, res, next) => {
    try {
        const all = await Applicant.find();
        res.json(ApiResponse.success("Applicants retrieved successfully", all));
    } catch (error) {
        next(ApiError.serverError("Error fetching applicants"));
    }
};

module.exports = {
    registerApplicant,
    loginApplicant,
    submitApplication,
    getAllApplicants,
};
