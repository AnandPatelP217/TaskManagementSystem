import { Task } from "../models/task.model.js";

export class TaskRepository {
  // Create a new task
  async create(taskData) {
    return await Task.create(taskData);
  }

  // Find task by ID with populated fields
  async findById(taskId) {
    return await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
  }

  // Find all tasks assigned to a user with pagination
  async findByUser(userId, page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = { assignedTo: userId, ...filters };

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    return {
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Find all tasks (admin only) with pagination
  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filters)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filters);

    return {
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Update task by ID
  async updateById(taskId, updateData) {
    return await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
  }

  
  async deleteById(taskId) {
    return await Task.findByIdAndDelete(taskId);
  }

 
  async updateStatus(taskId, status) {
    return await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
  }

  // Update task priority
  async updatePriority(taskId, priority) {
    return await Task.findByIdAndUpdate(
      taskId,
      { priority },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
  }

  // Find tasks assigned to a specific user (for my-tasks endpoint)
  async findByAssignedUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const tasks = await Task.find({ assignedTo: userId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Task.countDocuments({ assignedTo: userId });
    
    return {
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    };
  }

  // Find tasks by filters (status, priority)
  async findByFilters(filters) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    
    return await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }
}
