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

    // Aggregate rating dari Review
    const ratings = await Review.aggregate([
      {
        $group: {
          _id: "$lawyerId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Buat map rating berdasarkan lawyerId
    const ratingMap = ratings.reduce((acc, item) => {
      acc[item._id.toString()] = {
        averageRating: item.averageRating,
        totalReviews: item.totalReviews,
      };
      return acc;
    }, {} as Record<string, { averageRating: number; totalReviews: number }>);

    // Gabungkan rating ke masing-masing lawyer
    const lawyerList = lawyers.map((lawyer) => {
      const rating = ratingMap[lawyer.id.toString()] || {
        averageRating: 0,
        totalReviews: 0,
      };

      return {
        ...lawyer.toObject(),
        averageRating: rating.averageRating,
        totalReviews: rating.totalReviews,
      };
    });

    return lawyerList;
  }
}
