import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/ListingRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import compatibilityRoutes from "./routes/compatabilityRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./sockets/socket.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

socketHandler(io);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});