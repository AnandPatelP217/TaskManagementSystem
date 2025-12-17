/**
 * Task Routes - Define all task-related endpoints
 */

import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  updatePrioritySchema,
} from "../dtos/task.dtos.js";

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

// Get tasks assigned to logged-in user
router.get("/my-tasks", (req, res, next) => 
  taskController.getMyTasks(req, res, next)
);

// Filter tasks by status and/or priority
router.get("/filter", (req, res, next) =>
  taskController.filterTasks(req, res, next)
);

router.post(
  "/",
  authorizeAdmin,
  validate(createTaskSchema),
  (req, res, next) => taskController.createTask(req, res, next)
);
router.get("/", (req, res, next) => taskController.getTasks(req, res, next));


router.get("/:id", (req, res, next) =>
  taskController.getTaskById(req, res, next)
);

router.put("/:id", validate(updateTaskSchema), (req, res, next) =>
  taskController.updateTask(req, res, next)
);


router.delete("/:id", (req, res, next) =>
  taskController.deleteTask(req, res, next)
);


router.patch("/:id/status", validate(updateStatusSchema), (req, res, next) =>
  taskController.updateTaskStatus(req, res, next)
);


router.patch(
  "/:id/priority",
  validate(updatePrioritySchema),
  (req, res, next) => taskController.updateTaskPriority(req, res, next)
);

// Assign task to user (admin only)
router.put("/:id/assign", authorizeAdmin, (req, res, next) =>
  taskController.assignTask(req, res, next)
);

export default router;
