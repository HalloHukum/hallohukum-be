import { Document, Types } from "mongoose";

interface UserData {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  role: string;
}

interface LawyerData {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  specialization: string[];
  yearsOfExperience: number;
  certifications: string[];
  qualification: string;
  about: string;
  image: string;
  isVerified: boolean;
  status: "online" | "offline";
  price: number;
  totalConsults: number;
  user: UserData;
}

export interface IReview extends Document {
  userId: UserData;
  lawyerId: LawyerData;
  rating: number;
  date: Date;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
