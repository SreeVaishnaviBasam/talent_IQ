import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address || "",
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            profileImage: image_url
        };
        await User.create(newUser);
        try {
            const streamUserData = {
                id: newUser.clerkId,
                name: newUser.name,
                image: newUser.profileImage,
            };
            console.log("Upserting Stream user with data:", streamUserData);
            await upsertStreamUser(streamUserData);
            console.log("Stream user created successfully:", newUser.clerkId);
        } catch (streamError) {
            console.error("Failed to create Stream user:", streamError.message);
            throw streamError;
        }


    }
);

const deleteUserfromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();
        const { id } = event.data;
        await User.deleteOne({ clerkId: id });

        await deleteStreamUser(id);


    }
);

export const functions = [syncUser, deleteUserfromDB];