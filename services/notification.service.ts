import axios from "axios";
import User from "../models/user.model";

class PushNotificationService {
  private static API_URL = "https://exp.host/--/api/v2/push/send";

  static async sendNotification(tokens: string[], title: string, body: string) {
    const validTokens = tokens.filter((token) =>
      token.startsWith("ExponentPushToken")
    );

    if (validTokens.length === 0) {
      console.warn("No valid push tokens found");
      return;
    }

    try {
      // Send to all valid tokens
      const notifications = validTokens.map((token) => ({
        to: token,
        title,
        body,
        sound: "default",
      }));

      await axios.post(this.API_URL, notifications, {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  }

  static async removeInvalidToken(userId: string, invalidToken: string) {
    try {
      await User.updateOne(
        { _id: userId },
        { $pull: { pushTokens: invalidToken } }
      );
    } catch (error) {
      console.error("Error removing invalid token:", error);
    }
  }
}

export default PushNotificationService;
