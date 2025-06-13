import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  city: string;
  gender: "male" | "female";
  role: "client" | "lawyer" | "admin";
  pushTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}
