const Application = require("../models/application.model");
const { ApiResponse, ApiError } = require("../../utils/ApiHandler");

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
    getAllApplications,
    acceptApplication,
    rejectApplication,
};
