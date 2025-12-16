/**
 * Validation Middleware - Validates request body using Joi schemas
 */

import { STATUS } from "../constants/statusCodes.js";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: true, // Remove unknown fields
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};
