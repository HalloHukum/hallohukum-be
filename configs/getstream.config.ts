const StreamChat = require("stream-chat").StreamChat;
const { StreamClient } = require("@stream-io/node-sdk");
import { Agent } from "undici";

const apiKey = process.env.GETSTREAM_API_KEY;
const secret = process.env.GETSTREAM_API_SECRET;

export const chatClient = StreamChat.getInstance(apiKey, secret);

export const serverClient = new StreamClient(apiKey, secret, {
  agent: new Agent({ connections: 100 }),
});
