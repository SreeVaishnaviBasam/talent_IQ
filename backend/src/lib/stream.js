import { StreamChat } from 'stream-chat';
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;
if (!apiKey || !apiSecret) {
    console.error("Stream API key or secret is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async (userData) => {
    try {

        await chatClient.upsertUser(userData);
        console.log(`Stream user ${userData.id} upserted successfully.`);
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};


export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId, { mark_messages_deleted: true });
        console.log(`Stream user ${userId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting Stream user:", error);
    }
};




