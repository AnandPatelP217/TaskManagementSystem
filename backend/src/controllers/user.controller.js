/**
 * User Controller - Handles HTTP requests for user/auth operations
 */

import { UserService } from "../services/user.services.js";
import { STATUS } from "../../constants/statusCodes.js";
import { sendResponse } from "../utils/sendResponse.js";

const userService = new UserService();

export class UserController {
  // Register a new user
  async register(req, res, next) {
    try {
      const result = await userService.register(req.body);
      sendResponse(res, STATUS.CREATED, "User registered successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      sendResponse(res, STATUS.OK, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      sendResponse(res, STATUS.OK, "Profile retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  // Get all users (admin only)
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      sendResponse(res, STATUS.OK, "Users retrieved successfully", users);
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID (admin only)
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      sendResponse(res, STATUS.OK, "User retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  // Update user (admin only)
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      sendResponse(res, STATUS.OK, "User updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  // Delete user (admin only)
  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id);
      sendResponse(res, STATUS.OK, result.message);
    } catch (error) {
      next(error);
    }
  }
}
