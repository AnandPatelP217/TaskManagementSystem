import { TaskService } from "../services/task.services.js";
import { STATUS } from "../constants/statusCodes.js";
import { sendResponse } from "../utils/sendResponse.js";
import { AppError } from "../utils/AppError.js";

const taskService = new TaskService();

export class TaskController {
  // Create a new task
  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body, req.user.id);
      sendResponse(res, STATUS.CREATED, "Task created successfully", task);
    } catch (error) {
      next(error);
    }
  }

  // Get all tasks with pagination
  async getTasks(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Build filters
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;

      const result = await taskService.getTasks(
        req.user.id,
        req.user.role,
        page,
        limit,
        filters
      );

      sendResponse(res, STATUS.OK, "Tasks retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Get task by ID
  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(
        req.params.id,
        req.user.id,
        req.user.role
      );
      sendResponse(res, STATUS.OK, "Task retrieved successfully", task);
    } catch (error) {
      next(error);
    }
  }

  // Update task
  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      sendResponse(res, STATUS.OK, "Task updated successfully", task);
    } catch (error) {
      next(error);
    }
  }

  // Delete task
  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(
        req.params.id,
        req.user.id,
        req.user.role
      );
      sendResponse(res, STATUS.OK, result.message);
    } catch (error) {
      next(error);
    }
  }

  // Update task status
  async updateTaskStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        throw new AppError("Status is required", STATUS.BAD_REQUEST);
      }

      const task = await taskService.updateTaskStatus(
        req.params.id,
        status,
        req.user.id,
        req.user.role
      );
      sendResponse(res, STATUS.OK, "Task status updated successfully", task);
    } catch (error) {
      next(error);
    }
  }

  // Update task priority
  async updateTaskPriority(req, res, next) {
    try {
      const { priority } = req.body;
      if (!priority) {
        throw new AppError("Priority is required", STATUS.BAD_REQUEST);
      }

      const task = await taskService.updateTaskPriority(
        req.params.id,
        priority,
        req.user.id,
        req.user.role
      );
      sendResponse(res, STATUS.OK, "Task priority updated successfully", task);
    } catch (error) {
      next(error);
    }
  }

  // Get tasks assigned to logged-in user
  async getMyTasks(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await taskService.getMyTasks(req.user.id, { page, limit });
      sendResponse(res, STATUS.OK, "My tasks retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Assign task to a user (admin only)
  async assignTask(req, res, next) {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new AppError("User ID is required", STATUS.BAD_REQUEST);
      }

      const task = await taskService.assignTaskToUser(
        req.params.id,
        userId,
        req.user.role
      );
      sendResponse(res, STATUS.OK, "Task assigned successfully", task);
    } catch (error) {
      next(error);
    }
  }

  // Filter tasks by status and/or priority
  async filterTasks(req, res, next) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;

      const tasks = await taskService.filterTasks(filters);
      sendResponse(res, STATUS.OK, "Filtered tasks retrieved successfully", tasks);
    } catch (error) {
      next(error);
    }
  }
}
