const StreamChat = require("stream-chat").StreamChat;
const { StreamClient } = require("@stream-io/node-sdk");

const apiKey = process.env.GETSTREAM_API_KEY;
const secret = process.env.GETSTREAM_API_SECRET;

export const chatClient = StreamChat.getInstance(apiKey, secret);

export const callClient = new StreamClient(apiKey, secret);
