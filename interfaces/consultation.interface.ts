import { Document, Types } from "mongoose";

export interface IConsultation extends Document {
  userId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  caseType: string;
  problemDescription: string;
  method: "chat" | "call" | "video";
  legalBasis: string;
  analysis: string;
  conclusionAndAdvice: string;
  chatId: string;
  disclaimer: string;
  durationMinutes: number;
  expiredAt: string;
  orderId?: string;
  status:
    | "pending"
    | "accepted"
    | "declined"
    | "paid"
    | "active"
    | "expired"
    | "done";
  createdAt: Date;
  updatedAt: Date;
}
