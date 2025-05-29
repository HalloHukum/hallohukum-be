import express from "express";

import TransactionController from "../controllers/transaction.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = express.Router();

// router.use(authentication);

router.post("/", authentication, TransactionController.createTransaction);
router.post(
  "/midtrans-notification",
  TransactionController.midtransNotification
);
router.get(
  "/:orderId/check-status",
  TransactionController.getTransactionStatus
);

export default router;
