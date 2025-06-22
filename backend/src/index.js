// src/index.js (better name than indexedDB.js for entry point)

import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import http from "http";
import { initializeSocket } from "./utils/socketIo.js";

// Load environment variables
const dotenvResult = dotenv.config({ path: './.env' });
if (dotenvResult.error) {
  console.error("Failed to load .env file:", dotenvResult.error);
  process.exit(1);
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const { io, onlineUsers } = initializeSocket(server);

// Connect to MongoDB
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server is running at port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Database Connection FAILED!!!", err);
    process.exit(1);
  });

// Export io and onlineUsers for use in controllers
export { io, onlineUsers };