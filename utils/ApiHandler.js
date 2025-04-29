class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    static success(message, data, statusCode = 200) {
        return new ApiResponse(statusCode, message, data);
    }

    static error(message, statusCode = 500) {
        return new ApiResponse(statusCode, message);
    }
}

class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message) {
        return new ApiError(400, message);
    }

    static unauthorized(message = "Unauthorized access") {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden access") {
        return new ApiError(403, message);
    }

    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }

    static serverError(message = "Internal server error") {
        return new ApiError(500, message);
    }
}

module.exports = { ApiResponse, ApiError };