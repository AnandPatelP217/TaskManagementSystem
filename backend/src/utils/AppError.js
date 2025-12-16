/**
 * Custom Error Class
 * Provides proper HTTP status codes and better error handling
 */

import { STATUS } from "../constants/statusCodes.js";

export class AppError extends Error {
  constructor(message, statusCode = STATUS.INTERNAL_ERROR) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
