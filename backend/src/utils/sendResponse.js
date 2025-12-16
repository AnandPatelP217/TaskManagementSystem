/**
 * Avnish Kumar's API Response Utility
 * I created this to keep all my API responses consistent and professional.
 * No more scattered response formats throughout my codebase!
 */

import { STATUS } from "../constants/statusCodes.js";

/**
 * Send a standardized API response
 * I use this everywhere to maintain consistency across my entire API
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - User-friendly message
 * @param {Any} data - Optional payload data
 */
export const sendResponse = (
  res,
  statusCode = STATUS.OK,
  message = "Success",
  data,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    status: statusCode,
  });
};
