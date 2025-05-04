const Application = require("../models/application.model");
const { ApiResponse, ApiError } = require("../utils/ApiHandler");
const axios = require("axios");
const path = require("path");

const apply = async (req, res, next) => {
    try {
        const resume = req.file;

        if (!resume) {
            throw ApiError.badRequest("Resume file is required");
        }

        const absolutePath = path.resolve(resume.path);
        console.log("Absolute path of resume:", absolutePath);
        const response = await axios.post(
            "http://127.0.0.1:5000/score",
            {
                pdf_path: absolutePath, // Use the absolute path of the uploaded resume
            },
            {
                headers: { "Content-Type": "application/json" }, // Set Content-Type to application/json
            },
        );

        console.log("req.user ", req.user);
        const newApplication = await Application.create({
            applicant: req.user._id,
            resumePath: absolutePath,
            resumeScore: response.data.score || 0,
            status: "pending",
            appliedAt: new Date(),
        });

        delete newApplication.resumePath;
        delete newApplication.resumeScore;
        res.json(
            ApiResponse.success(
                "Application submitted successfully",
                newApplication,
            ),
        );
    } catch (error) {
        next(ApiError.serverError("Error submitting application: " + error));
    }
};

const getAllApplications = async (req, res, next) => {
    try {
        const all = await Application.find().populate("applicant");
        res.json(
            ApiResponse.success("Applications retrieved successfully", all),
        );
    } catch (error) {
        next(ApiError.serverError("Error fetching applications"));
    }
};

const getAcceptedApplications = async (req, res, next) => {
    try {
        const all = await Application.find({ status: "selected" }).populate(
            "applicant",
        );
        res.json(
            ApiResponse.success("Applications retrieved successfully", all),
        );
    } catch (error) {
        next(ApiError.serverError("Error fetching applications"));
    }
};

const getRejectedApplications = async (req, res, next) => {
    try {
        const all = await Application.find({ status: "rejected" }).populate(
            "applicant",
        );
        res.json(
            ApiResponse.success("Applications retrieved successfully", all),
        );
    } catch (error) {
        next(ApiError.serverError("Error fetching applications"));
    }
};

const acceptApplication = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            throw ApiError.badRequest("Application ID is required");
        }

        const application = await Application.findByIdAndUpdate(id, {
            status: "selected",
        });
        if (!application) {
            throw ApiError.notFound("Application not found");
        }

        res.json(
            ApiResponse.success(
                "Application accepted successfully",
                application,
            ),
        );
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(ApiError.serverError("Error accepting application"));
        }
    }
};

const rejectApplication = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            throw ApiError.badRequest("Application ID is required");
        }

        const application = await Application.findByIdAndUpdate(id, {
            status: "rejected",
        });
        if (!application) {
            throw ApiError.notFound("Application not found");
        }

        res.json(
            ApiResponse.success(
                "Application rejected successfully",
                application,
            ),
        );
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(ApiError.serverError("Error rejecting application"));
        }
    }
};

module.exports = {
    apply,
    getAllApplications,
    getAcceptedApplications,
    getRejectedApplications,
    acceptApplication,
    rejectApplication,
};
