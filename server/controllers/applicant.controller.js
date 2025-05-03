const Applicant = require("../models/applicant.model");
const { ApiResponse, ApiError } = require("../../utils/ApiHandler");

const getAllApplicants = async (req, res, next) => {
    try {
        const all = await Applicant.find();
        res.json(ApiResponse.success("Applicants retrieved successfully", all));
    } catch (error) {
        next(ApiError.serverError("Error fetching applicants"));
    }
};

const getProfile = async (req, res, next) => {
    try {
        const profile = await Applicant.findById(req.user.userId).select(
            "-password",
        );
        res.json(
            ApiResponse.success("Profile retrieved successfully", profile),
        );
    } catch (error) {
        next(ApiError.serverError("Error fetching profile"));
    }
};

module.exports = {
    getAllApplicants,
    getProfile,
};
