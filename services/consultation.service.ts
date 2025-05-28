import { Types } from "mongoose";

import { IConsultation } from "../interfaces/consultation.interface";
import Consultation from "../models/consultation.model";

export default class ConsultationService {
  static async createConsultation(
    consultationData: Partial<IConsultation>
  ): Promise<IConsultation> {
    const consultation = new Consultation(consultationData);
    return await consultation.save();
  }

  static async getExpiredAt(durationMinutes: number): Promise<string> {
    const now = new Date();
    const expiredAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
    return expiredAt.toISOString();
  }

  static async getConsultations(filters: {
    userId?: string;
    lawyerId?: string;
    status?: string;
  }): Promise<IConsultation[]> {
    const filter: any = {};

    if (filters.userId) filter.userId = new Types.ObjectId(filters.userId);
    if (filters.lawyerId)
      filter.lawyerId = new Types.ObjectId(filters.lawyerId);
    if (filters.status) filter.status = filters.status;

    return await Consultation.find(filter)
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
      .populate("categoryId", "_id title")
      .sort({ createdAt: -1 });
  }

  static async getConsultationById(id: string): Promise<IConsultation | null> {
    return await Consultation.findById(id)
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
      .populate("categoryId", "_id title");
  }

  static async updateConsultation(
    id: string,
    updateData: Partial<IConsultation>
  ): Promise<IConsultation | null> {
    return await Consultation.findByIdAndUpdate(id, updateData, { new: true })
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
      .populate("categoryId", "_id title");
  }

  static async deleteConsultation(id: string): Promise<IConsultation | null> {
    return await Consultation.findByIdAndDelete(id);
  }

  // Business logic for checking if a consultation belongs to a user or lawyer
  static async isConsultationOwner(
    consultationId: string,
    userId: string,
    isLawyer: boolean = false
  ): Promise<boolean> {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return false;

    return isLawyer
      ? consultation.lawyerId.toString() === userId
      : consultation.userId.toString() === userId;
  }

  static async getConsultationByChatId(
    chatId: string
  ): Promise<IConsultation | null> {
    return await Consultation.findOne({ chatId })
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
      .populate("categoryId", "_id title");
  }
}
