import mongoose, { Schema } from "mongoose";

import { IReview } from "../interfaces/review.interface";

const reviewSchema: Schema<IReview> = new Schema(
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
    consultationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Consultation",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    date: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
