import { IReview } from "../interfaces/review.interface";
import Review from "../models/review.model";

export default class ReviewService {
  static async createReview(reviewData: Partial<IReview>): Promise<IReview> {
    const review = new Review(reviewData);
    return await review.save();
  }

  static async getReviews(): Promise<IReview[]> {
    return await Review.find()
      .populate({
        path: "userId",
        select: "_id fullName email role",
      })
      .populate({
        path: "lawyerId",
        select:
          "_id specialization yearsOfExperience certifications qualification about image isVerified status price totalConsults",
        populate: {
          path: "userId",
          select: "_id fullName email role",
        },
      })
      .sort({ createdAt: -1 });
  }

  static async getReviewById(id: string): Promise<IReview | null> {
    return await Review.findById(id)
      .populate({
        path: "userId",
        select: "_id fullName email role",
      })
      .populate({
        path: "lawyerId",
        select:
          "_id specialization yearsOfExperience certifications qualification about image isVerified status price totalConsults",
        populate: {
          path: "userId",
          select: "_id fullName email role",
        },
      });
  }

  static async getReviewsByLawyerId(lawyerId: string): Promise<IReview[]> {
    return await Review.find({ lawyerId })
      .populate({
        path: "userId",
        select: "_id fullName email role",
      })
      .populate({
        path: "lawyerId",
        select:
          "_id specialization yearsOfExperience certifications qualification about image isVerified status price totalConsults",
        populate: {
          path: "userId",
          select: "_id fullName email role",
        },
      })
      .sort({ createdAt: -1 });
  }

  static async deleteReview(id: string): Promise<IReview | null> {
    return await Review.findByIdAndDelete(id);
  }
}
