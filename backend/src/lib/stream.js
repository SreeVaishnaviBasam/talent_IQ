import { StreamChat } from 'stream-chat';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
if (!apiKey || !apiSecret) {
    console.error("Stream API key or secret is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async (userData) => {
    try {
        if (!userData.id) {
            throw new Error("User ID is required to upsert Stream user");
        }
        const result = await chatClient.upsertUser(userData);
        console.log("Successfully upserted Stream user:", userData.id);
        return result;
    } catch (error) {
        console.error("Error upserting Stream user:", error.message || error);
        throw error;
    }
};


export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId, { mark_messages_deleted: true });
        console.log(`Stream user ${userId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting Stream user:", error);
        throw error;
    }
};




