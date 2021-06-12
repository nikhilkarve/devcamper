const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);

  // Mongoose invalid id error
  if (err.name === "CastError") {
    const message = `Bootcamp not found with the ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate details error
  //   console.log(err);
  if (err.code === 11000) {
    const message = `Duplicate bootcamp entry`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose incomplete data entry
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;
