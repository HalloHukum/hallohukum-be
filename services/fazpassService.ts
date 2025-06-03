import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const fazpassGatewayKey = process.env.FAZPASS_GATEWAY_KEY;
const fazPassAccessKey = process.env.FAZPASS_MERCHANT_ID;

if (!fazpassGatewayKey || !fazPassAccessKey) {
  throw new Error("Missing FazPass configuration");
}

class FazpassService {
  static async sendOtp(phone: string, otp: string): Promise<void> {
    try {
      const response = await axios.post(
        "https://api.fazpass.com/v1/otp/send",
        {
          phone,
          otp,
          gateway_key: fazpassGatewayKey,
          params: [
            {
              tag: "brand",
              value: "Hallo Hukum",
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fazPassAccessKey}`,
          },
        }
      );
      console.info("OTP sent successfully:", response.data);
    } catch (error: any) {
      console.error("FazPass OTP error:", error.message);
      throw new Error("Failed to send OTP via FazPass");
    }
  }
}

export default FazpassService;
