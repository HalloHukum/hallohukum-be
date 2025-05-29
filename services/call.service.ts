import { callClient } from "../configs/getstream.config";

export default class CallService {
  static async createCall(clientId: string, lawyerId: string) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    await callClient.upsertUsers([
      {
        id: clientId,
        role: "user",
      },
      {
        id: lawyerId,
        role: "user",
      },
    ]);

    // Create a unique call ID
    const callId = `call_${clientId}_${lawyerId}`;

    return {
      callId,
    };
  }

  static async createVoice(clientId: string, lawyerId: string) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    await callClient.upsertUsers([
      {
        id: clientId,
        role: "user",
      },
      {
        id: lawyerId,
        role: "user",
      },
    ]);

    // Create a unique call ID
    const callId = `voice_${clientId}_${lawyerId}`;

    return {
      callId,
    };
  }
}
