/**
 * User Routes - Define all user/auth-related endpoints
 */

import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, updateUserSchema } from "../dtos/user.dto.js";

const router = Router();
const userController = new UserController();
    

router.post("/register", validate(registerSchema), (req, res, next) =>
  userController.register(req, res, next)
);


router.post("/login", validate(loginSchema), (req, res, next) =>
  userController.login(req, res, next)
);


router.get("/profile", authenticate, (req, res, next) =>
  userController.getProfile(req, res, next)
);

router.get("/", authenticate, authorizeAdmin, (req, res, next) =>
  userController.getAllUsers(req, res, next)
);


router.get("/:id", authenticate, authorizeAdmin, (req, res, next) =>
  userController.getUserById(req, res, next)
);


router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validate(updateUserSchema),
  (req, res, next) => userController.updateUser(req, res, next)
);


router.delete("/:id", authenticate, authorizeAdmin, (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
