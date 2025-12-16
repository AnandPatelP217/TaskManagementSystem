/**
 * User/Auth Service - Business logic for user authentication and management
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository.js";
import { AppError } from "../utils/AppError.js";
import { STATUS } from "../constants/statusCodes.js";

const userRepository = new UserRepository();

export class UserService {
 
  async register(userData) {
   
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("Email already registered", STATUS.CONFLICT);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user._id, user.role);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // Login user
  async login(email, password) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", STATUS.UNAUTHORIZED);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", STATUS.UNAUTHORIZED);
    }

    // Generate token
    const token = this.generateToken(user._id, user.role);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // Get all users (admin kar skta hai)
  async getAllUsers() {
    return await userRepository.findAll();
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", STATUS.NOT_FOUND);
    }
    return user;
  }

  // Update user (admin kar skta hai)
  async updateUser(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", STATUS.NOT_FOUND);
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await userRepository.updateById(userId, updateData);
    return updatedUser;
  }

  // Delete user by admin  
  async deleteUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", STATUS.NOT_FOUND);
    }

    await userRepository.deleteById(userId);
    return { message: "User deleted successfully" };
  }

  // Generate JWT token
  generateToken(userId, role) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError("Token has expired", STATUS.UNAUTHORIZED);
      }
      throw new AppError("Invalid token", STATUS.UNAUTHORIZED);
    }
  }
}
