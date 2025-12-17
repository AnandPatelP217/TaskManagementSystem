import { TaskRepository } from "../repository/task.repository.js";
import { UserRepository } from "../repository/user.repository.js";
import { AppError } from "../utils/AppError.js";
import { STATUS } from "../constants/statusCodes.js";

const taskRepository = new TaskRepository();
const userRepository = new UserRepository();

export class TaskService {
  // Create a new task
  async createTask(taskData, createdById) {
    // Verify assigned user exists
    const assignedUser = await userRepository.findById(taskData.assignedTo);
    if (!assignedUser) {
      throw new AppError("Assigned user not found", STATUS.NOT_FOUND);
    }

    const newTask = await taskRepository.create({
      ...taskData,
      createdBy: createdById,
    });

    return newTask;
  }

  // Get task by ID with authorization check
  async getTaskById(taskId, userId, userRole) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", STATUS.NOT_FOUND);
    }

    // Check authorization: admin can view all, users can only view their assigned tasks
    if (userRole !== "admin" && task.assignedTo._id.toString() !== userId) {
      throw new AppError("Not authorized to view this task", STATUS.FORBIDDEN);
    }

    return task;
  }

  // Get all tasks with pagination (admin) or user's tasks
  async getTasks(userId, userRole, page, limit, filters = {}) {
    if (userRole === "admin") {
      return await taskRepository.findAll(page, limit, filters);
    } else {
      return await taskRepository.findByUser(userId, page, limit, filters);
    }
  }

  // Update task
  async updateTask(taskId, updateData, userId, userRole) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", STATUS.NOT_FOUND);
    }

    // Check authorization: admin or task creator can update
    if (
      userRole !== "admin" &&
      task.createdBy._id.toString() !== userId
    ) {
      throw new AppError("Not authorized to update this task", STATUS.FORBIDDEN);
    }

    // If assignedTo is being updated, verify the user exists
    if (updateData.assignedTo) {
      const assignedUser = await userRepository.findById(updateData.assignedTo);
      if (!assignedUser) {
        throw new AppError("Assigned user not found", STATUS.NOT_FOUND);
      }
    }

    const updatedTask = await taskRepository.updateById(taskId, updateData);
    return updatedTask;
  }

  // Delete task
  async deleteTask(taskId, userId, userRole) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", STATUS.NOT_FOUND);
    }

    // Check authorization: admin or task creator can delete
    if (
      userRole !== "admin" &&
      task.createdBy._id.toString() !== userId
    ) {
      throw new AppError("Not authorized to delete this task", STATUS.FORBIDDEN);
    }

    await taskRepository.deleteById(taskId);
    return { message: "Task deleted successfully" };
  }

  // Update task status
  async updateTaskStatus(taskId, status, userId, userRole) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", STATUS.NOT_FOUND);
    }

    // Users can update status of their assigned tasks, admins can update any
    if (
      userRole !== "admin" &&
      task.assignedTo._id.toString() !== userId
    ) {
      throw new AppError(
        "Not authorized to update this task status",
        STATUS.FORBIDDEN
      );
    }

    const updatedTask = await taskRepository.updateStatus(taskId, status);
    return updatedTask;
  }

  // Update task priority (admin or creator only)
  async updateTaskPriority(taskId, priority, userId, userRole) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", STATUS.NOT_FOUND);
    }

    // Only admin or task creator can change priority
    if (
      userRole !== "admin" &&
      task.createdBy._id.toString() !== userId
    ) {
      throw new AppError(
        "Not authorized to update task priority",
        STATUS.FORBIDDEN
      );
    }

    const updatedTask = await taskRepository.updatePriority(taskId, priority);
    return updatedTask;
  }

  // Get tasks assigned to logged-in user
  async getMyTasks(userId, queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    return await taskRepository.findByAssignedUser(userId, page, limit);
  }

  // Assign task to a user (admin only)
  async assignTaskToUser(taskId, userId, adminRole) {
    if (adminRole !== "admin") {
      throw new AppError("Only admins can assign tasks", STATUS.FORBIDDEN);
    }

    // Verify task exists
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", STATUS.NOT_FOUND);
    }

    // Verify user exists
    const userExists = await userRepository.findById(userId);
    if (!userExists) {
      throw new AppError("User not found", STATUS.NOT_FOUND);
    }
    
    return await taskRepository.updateById(taskId, { assignedTo: userId });
  }

  // Filter tasks by status and/or priority
  async filterTasks(filters) {
    return await taskRepository.findByFilters(filters);
  }
}
