import axios from "axios";
import { NextFunction, Response } from "express";
import Midtrans from "midtrans-client";

import { AuthenticatedRequest } from "../interfaces/auth.interface";
// import Lawyer from "../models/lawyer.model";
import Transaction from "../models/transaction.model";
import User from "../models/user.model";
import PushNotificationService from "../services/notification.service";
import { TransactionService } from "../services/transaction.service";

export default class TransactionController {
  static async createTransaction(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }
      // console.log(req.user, "<--- req user");

      const payload = {
        ...req.body,
        userId: req.user._id,
      };

      const response = await TransactionService.createTransaction(payload);
      // console.log(response, "<-- danish ajg");

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  static async midtransNotification(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const notif = req.body;
      // console.log("Received Midtrans notification:", req.body);
      // Create Midtrans notification handler
      const apiClient = new Midtrans.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SECRET as string,
        clientKey: process.env.MIDTRANS_PUBLIC_CLIENT as string,
      });

      // Verify the notification
      const statusResponse = await apiClient.transaction.notification(req.body);

      // const statusResponse = await notification.transactionStatus();
      // const statusResponse = await notification.getNotification(req.body);

      // Log the transaction status
      console.info("Transaction status:", {
        orderId: statusResponse.order_id,
        transactionStatus: statusResponse.transaction_status,
        fraudStatus: statusResponse.fraud_status,
        paymentType: statusResponse.payment_type,
      });

      // Handle the transaction status
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { orderId: statusResponse.order_id },
        {
          status: statusResponse.transaction_status,
          payment_type: statusResponse.payment_type,
        },
        { new: true }
      );

      if (!updatedTransaction) {
        console.warn(
          "Transaksi dengan orderId tidak ditemukan:",
          statusResponse.order_id
        );
        return res.status(404).json({
          status: "error",
          message: "Transaksi tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Notification processed",
        data: updatedTransaction,
      });
    } catch (error: any) {
      console.error(
        "Error in midtransNotification:",
        error.message,
        error.stack
      );
      next(error);
    }
  }

  static async getTransactionStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const mitransSercet = `${process.env.MIDTRANS_SECRET}:`;
      const { orderId } = req.params;
      const midtransRes = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(mitransSercet).toString(
              "base64"
            )}`,
          },
        }
      );

      // Handle the transaction status
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { orderId },
        {
          status: midtransRes.data.transaction_status,
          payment_type: midtransRes.data.payment_type,
        },
        { new: true }
      );
      // console.log(updatedTransaction, "<-- updated transaction");

      //handle sending notification to lawyer
      if (
        midtransRes.data.transaction_status === "settlement" &&
        updatedTransaction?.lawyerId
      ) {
        const lawyerUser = await User.findById(updatedTransaction.lawyerId);

        if (lawyerUser?.pushTokens && lawyerUser.pushTokens.length > 0) {
          await PushNotificationService.sendNotification(
            lawyerUser.pushTokens,
            "New Paid Transaction",
            "You just received a new paid transaction from a client!"
          );
        }
      }
      if (!updatedTransaction) {
        return res.status(404).json({
          status: "error",
          message: "Transaksi tidak ditemukan di database",
        });
      }

      return res.json({
        status: "success",
        message: "Status transaksi berhasil diambil dan diupdate",
        data: {
          transaction_status: midtransRes.data.transaction_status,
          order_id: midtransRes.data.order_id,
          updatedTransaction,
        },
      });
    } catch (error: any) {
      console.error(
        "Error in getTransactionStatus:",
        error.message,
        error.stack
      );
      next(error);
    }
  }
}
