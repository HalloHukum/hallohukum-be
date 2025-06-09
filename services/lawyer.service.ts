import { ILawyer } from "../interfaces/lawyer.interface";
import Lawyer from "../models/lawyer.model";

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
}
