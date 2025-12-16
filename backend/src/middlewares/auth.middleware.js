/**
 * Authentication Middleware - Protects routes and verifies JWT tokens
 */

import { UserService } from "../services/user.services.js";
import { AppError } from "../utils/AppError.js";
import { STATUS } from "../constants/statusCodes.js";

const userService = new UserService();

// Verify JWT token and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "No token provided. Please login.",
        STATUS.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = userService.verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is admin
export const authorizeAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new AppError(
        "Access denied. Admin privileges required.",
        STATUS.FORBIDDEN
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
