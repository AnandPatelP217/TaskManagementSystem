import Joi from "joi";

// Task creation validation
export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Task title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().max(500).required().messages({
    "string.empty": "Task description is required",
    "string.max": "Description cannot exceed 500 characters",
  }),
  dueDate: Joi.date().iso().required().messages({
    "date.base": "Due date must be a valid date",
    "any.required": "Due date is required",
  }),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid user ID format",
      "any.required": "Task must be assigned to a user",
    }),
});

// Task update validation
export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  dueDate: Joi.date().iso().messages({
    "date.base": "Due date must be a valid date",
  }),
  priority: Joi.string().valid("low", "medium", "high"),
  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid user ID format",
    }),
}).min(1);

// Task status update validation
export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "completed").required().messages({
    "any.only": "Status must be either 'pending' or 'completed'",
    "any.required": "Status is required",
  }),
});

// Task priority update validation
export const updatePrioritySchema = Joi.object({
  priority: Joi.string().valid("low", "medium", "high").required().messages({
    "any.only": "Priority must be 'low', 'medium', or 'high'",
    "any.required": "Priority is required",
  }),
});
