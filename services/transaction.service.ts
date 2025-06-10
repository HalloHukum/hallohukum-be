import Midtrans from "midtrans-client";

import Transaction from "../models/transaction.model";

interface PaymentRequest {
  method: string;
  lawyerId: string;
  amount: number;
  userId: string;
}

interface TransactionResponse {
  token: string;
  redirect_url: string;
  order_id: string;
}

export class TransactionService {
  private static snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SECRET as string,
    clientKey: process.env.MIDTRANS_PUBLIC_CLIENT as string,
  });
  static async createTransaction(
    payload: PaymentRequest
  ): Promise<TransactionResponse> {
    const { method, lawyerId, amount, userId } = payload;
    const order_id = `${method}-${Date.now()}-${lawyerId}`;

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: amount,
      },
      item_details: [
        {
          order_id,
          name: `Consultation ${method}-${lawyerId}`,
          price: amount,
          quantity: 1,
        },
      ],
    };

    try {
      // Create a transaction in the database
      await Transaction.create({
        userId,
        orderId: order_id,
        amount,
        status: "pending",
        payment_type: null,
        lawyerId,
      });

      const transaction = await this.snap.createTransaction(parameter);
      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id,
      };
    } catch (error: any) {
      console.error("failed to create token: ", error.message);
      throw new Error("Failed to create transaction");
    }
  }
}
