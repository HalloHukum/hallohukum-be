import { randomInt } from "crypto";

import redis from "../configs/redis.config";
// import { emailService } from "./emailService";
import FazpassService from "./fazpassService";

//interface OTPData
interface OTPData {
  phone: string;
  otp: string;
  expiresAt: Date;
}

class OTPService {
  private readonly OTP_PREFIX = "otp:";
  private readonly OTP_EXPIRY = 300; // 5 minutes in seconds

  public generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  async sendOTP(phone: string): Promise<string> {
    const otp = this.generateOTP();
    const otpData: OTPData = {
      phone,
      otp,
      expiresAt: new Date(Date.now() + this.OTP_EXPIRY * 1000),
    };

    // Store OTP in Redis
    const key = `${this.OTP_PREFIX}${phone}`;
    await redis.setex(key, this.OTP_EXPIRY, JSON.stringify(otpData));

    // Send OTP via email
    // await emailService.sendOTPEmail(email, otp);

    // Send OTP via Whatsapp
    await FazpassService.sendOtp(phone, otp);
    return otp;
  }

  async getOTP(phone: string): Promise<OTPData | null> {
    const key = `${this.OTP_PREFIX}${phone}`;
    const data = await redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as OTPData;
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    // const storedOtp= await this.getOTP(phone);
    // console.log("Checking OTP for", phone);
    // console.log("Expected:", storedOtp, "Received:", otp);
    const otpData = await this.getOTP(phone);

    if (!otpData) {
      return false;
    }

    if (otpData.expiresAt < new Date()) {
      await this.deleteOTP(phone);
      return false;
    }

    if (otpData.otp !== otp) {
      return false;
    }

    await this.deleteOTP(phone);
    return true;
  }

  private async deleteOTP(phone: string): Promise<void> {
    const key = `${this.OTP_PREFIX}${phone}`;
    await redis.del(key);
  }
}

export const otpService = new OTPService();
