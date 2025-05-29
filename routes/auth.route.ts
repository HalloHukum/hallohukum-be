import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = Router()

router.post("/register", AuthController.register);
router.post("/verify-register-otp", AuthController.verifyRegisterOTP);
router.post("/login", AuthController.login);
router.post("/quick-login", AuthController.quickLogin);
router.post("/verify-login-otp", AuthController.verifyLoginOTP);

// Protected routes
router.get("/me", authentication, AuthController.getMe);
router.put("/me", authentication, AuthController.updateMe);

export default router;
