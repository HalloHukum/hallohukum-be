import { ILawyer } from "../interfaces/lawyer.interface";
import Lawyer from "../models/lawyer.model";
import Review from "../models/review.model";

export default class LawyerService {
  static async toggleLawyerStatus(id: string): Promise<ILawyer | null> {
    const lawyer = await Lawyer.findById(id);

    if (!lawyer) {
      return null;
    }

    const newStatus = lawyer.status === "online" ? "offline" : "online";

    const updatedLawyer = await Lawyer.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    ).populate({
      path: "userId",
      select: "fullName phone email dateOfBirth city gender",
    });

    return updatedLawyer;
  }

  static async getAllLawyersWithRatings() {
    const lawyers = await Lawyer.find().populate({
      path: "userId",
      select: "fullName phone email dateOfBirth city gender",
    });

    // Get all reviews with populated user data
    const reviews = await Review.find()
      .populate({
        path: "userId",
        select: "fullName email",
      })
      .sort({ date: -1 });

    // Create a map of reviews by lawyerId
    const reviewMap = reviews.reduce(
      (acc, review) => {
        const lawyerId = review.lawyerId.toString();
        if (!acc[lawyerId]) {
          acc[lawyerId] = [];
        }
        acc[lawyerId].push({
          rating: review.rating,
          comment: review.comment,
          date: review.date,
          user: {
            fullName: review.userId.fullName,
            email: review.userId.email,
          },
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          rating: number;
          comment: string;
          date: Date;
          user: {
            fullName: string;
            email: string;
          };
        }>
      >
    );

    // Calculate average ratings and total reviews
    const ratingMap = Object.entries(reviewMap).reduce(
      (acc, [lawyerId, reviews]) => {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        acc[lawyerId] = {
          averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
          totalReviews: reviews.length,
          reviews,
        };
        return acc;
      },
      {} as Record<
        string,
        {
          averageRating: number;
          totalReviews: number;
          reviews: Array<{
            rating: number;
            comment: string;
            date: Date;
            user: {
              fullName: string;
              email: string;
            };
          }>;
        }
      >
    );

    // Combine lawyer data with ratings and reviews
    const lawyerList = lawyers.map((lawyer) => {
      const rating = ratingMap[lawyer.id.toString()] || {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      };

      return {
        ...lawyer.toObject(),
        averageRating: rating.averageRating,
        totalReviews: rating.totalReviews,
        reviews: rating.reviews,
      };
    });

    return lawyerList;
  }

  static async getLawyerWithRatings(id: string) {
    const lawyer = await Lawyer.findById(id).populate({
      path: "userId",
      select: "fullName phone email dateOfBirth city gender",
    });

    if (!lawyer) {
      return null;
    }

    // Get reviews for this specific lawyer
    const reviews = await Review.find({ lawyerId: id })
      .populate({
        path: "userId",
        select: "fullName email",
      })
      .sort({ date: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return {
      ...lawyer.toObject(),
      averageRating,
      totalReviews: reviews.length,
      reviews: reviews.map((review) => ({
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        user: {
          fullName: review.userId.fullName,
          email: review.userId.email,
        },
      })),
    };
  }
}
