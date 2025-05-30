import { serverClient } from "../configs/getstream.config";

export default class CallService {
  static async createCall(
    clientId: string,
    lawyerId: string,
    audioOnly: boolean = false
  ) {
    if (!clientId || !lawyerId) {
      throw new Error("clientId and lawyerId are required");
    }

    await serverClient.upsertUsers([
      { id: clientId, role: "user" },
      { id: lawyerId, role: "user" },
    ]);

    const callId = `call_${clientId.slice(0, 8)}_${lawyerId.slice(
      0,
      8
    )}_${Date.now()}`;
    const callType = audioOnly ? "audio_room" : "default";
    const call = serverClient.video.call(callType, callId);

    await call.getOrCreate({
      data: {
        created_by_id: clientId,
        members: [{ user_id: clientId, role: "admin" }, { user_id: lawyerId }],
        custom: {
          topic: audioOnly ? "Konsultasi hukum (Suara)" : "Konsultasi hukum",
        },
        settings_override: {
          audio: {
            mic_default_on: true,
            default_device: audioOnly ? "earpiece" : "speaker",
          },
        },
      },
    });

    return { callId };
  }
}
