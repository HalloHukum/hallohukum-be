import mongoose, { Schema } from "mongoose";

import { IConsultation } from "../interfaces/consultation.interface";

const consultationSchema: Schema<IConsultation> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lawyerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Lawyer",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    problemDescription: {
      type: String,
      required: true,
    },
    method: {
      type: String,
    },
    legalBasis: {
      type: String,
    },
    analysis: {
      type: String,
    },
    conclusionAndAdvice: {
      type: String,
    },
    chatId: {
      type: String,
    },
    disclaimer: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },
    expiredAt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "expired"],
    },
    price: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model<IConsultation>(
  "Consultation",
  consultationSchema
);
export default Consultation;
