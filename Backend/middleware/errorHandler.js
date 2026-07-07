const {
    errorResponse
} = require("../utils/apiResponse");

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    console.error("Global Error:", err);

    const statusCode =
        err.statusCode || 500;

    res.status(statusCode).json(

        errorResponse(

            err.message ||
            "Internal Server Error"

        )

    );

};

module.exports = errorHandler;