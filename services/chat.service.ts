import { chatClient } from "../configs/getstream.config";

export default class ChatService {
  // TODO: clientId and lawyerId should be existing users
  static async createChannel(clientId: string, lawyerId: string) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    await chatClient.upsertUsers([
      {
        id: clientId,
        role: `client`,
      },
      {
        id: lawyerId,
        role: `lawyer`,
      },
    ]);

    // Create a unique call ID
    const channelId = `chat_${clientId}_${lawyerId}`

    const newChannel = chatClient.channel("messaging", channelId, {
      name: `Consultation: ${clientId} & ${lawyerId}`,
      members: [clientId, lawyerId],
      created_by_id: "4645",
    });

    await newChannel.create();

    return {
      channelId,
      name: `Consultation: ${clientId} & ${lawyerId}`,
      members: [
        { id: clientId, role: "client" },
        { id: lawyerId, role: "lawyer" },
      ],
    };
  }
}
