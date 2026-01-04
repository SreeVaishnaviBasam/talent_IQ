import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { fileURLToPath } from "url";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); //This adds auth filed to req object:req.auth()




app.get("/health", (req, res) => {
    res.status(200).json({ msg: "Success from ppi" });
})


//when you pass an array of middleware to express ,it automatically falttens and executes them sequentially,one by one.

app.get("/video-calls", protectRoute, ((req, res) => {
    res.status(200).json({ msg: "This is video calls route" });
}))

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
    const staticPath = path.join(__dirname, "..", "..", "frontend", "dist");
    app.use(express.static(staticPath));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(staticPath, "index.html"));
    });
}




const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

// https://talent-iq-4-gxsg.onrender.com
//v4rcsevt9325