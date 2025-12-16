/**
 * Avnish Kumar's Global Error Handler
 * I hate when users see ugly error messages, so I built this centralized
 * error handler to catch everything and return clean, consistent responses.
 * It also protects sensitive stack traces in production.
 */

import { STATUS } from "../constants/statusCodes.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  // Smart status code detection - use my AppError codes or default to 500
  const statusCode =
    err instanceof AppError ? err.statusCode : STATUS.INTERNAL_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong", // User-friendly message
    status: statusCode,
    // Security first - only expose stack traces during development
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
