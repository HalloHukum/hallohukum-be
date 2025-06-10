import axios from "axios";

class PushNotificationService {
  private static API_URL = "https://exp.host/--/api/v2/push/send";

  static async sendNotification(token: string, title: string, body: string) {
    if (!token.startsWith("ExponentPushToken")) {
      throw new Error("Invalid push token format");
    }
    try {
      await axios.post(
        this.API_URL,
        {
          to: token,
          title,
          body,
          sound: "default",
        },
        {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Push notification sent successfully:", response.data);
      
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }
}

export default PushNotificationService;
