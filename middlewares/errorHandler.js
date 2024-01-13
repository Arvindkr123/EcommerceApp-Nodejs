import { DEBUG_MODE } from "../config/index.js";
import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal Server Error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };

  // Check if the error is a Joi validation error
  if (err instanceof Joi.ValidationError) {
    statusCode = 422;
    data = {
      message: err.details.map((error) => error.message),
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  // Ensure that res is an instance of the Express response object
  if (res && res.status && res.json) {
    return res.status(statusCode).json(data);
  } else {
    console.error("Error: Invalid response object in errorHandler middleware");
  }
};

export default errorHandler;
