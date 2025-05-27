import express from "express";

import UserController from "../controllers/user.controller";
import { authentication } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = express.Router();

router.post("/", authentication, authorizeRoles(['admin']), UserController.createUser);
router.get("/", authentication, authorizeRoles(['admin']), UserController.getUsers);
router.get("/:id", authentication, authorizeRoles(['admin', 'client', 'lawyer']), UserController.getUser);
router.put("/:id", authentication, authorizeRoles(['admin', 'client', 'lawyer']), UserController.updateUser);
router.delete("/:id", authentication, authorizeRoles(['admin']), UserController.deleteUser);

export default router;
