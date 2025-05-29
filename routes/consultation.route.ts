import express from "express";

import ConsultationController from "../controllers/consultation.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authentication);

router.post("/", ConsultationController.createConsultation);
router.get("/", ConsultationController.getConsultations);
router.get("/channels/:id", ConsultationController.getConsultationByChatId);
router.get("/:id", ConsultationController.getConsultation);
router.put("/:id", ConsultationController.updateConsultation);
router.delete("/:id", ConsultationController.deleteConsultation);

export default router;
