import { Router } from "express";

import CallController from "../controllers/call.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = Router();

router.use(authentication);

// Create a new call
router.post("/video", CallController.createCall);
router.post("/voice", CallController.createCall);

export default router;
