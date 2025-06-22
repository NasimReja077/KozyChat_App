// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.resolve();
const __filename = fileURLToPath(import.meta.url);

const app = express(); // 🔹 Create express app instance

//CORS configuration (Cross-Origin Resource Sharing)
//NOTE: 'Credentials' spelling should be "credentials"
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Fallback to localhost for development
  credentials: true, // allow cookies to be sent
}));

//Parse incoming JSON request bodies (limit 16kb)
//Express automatically parses JSON and form-data
app.use(express.json({ limit: "16kb" }));

//Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//Serve static files (e.g., images, PDFs) from "public" folder
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../public")));

//Parse cookies from request headers
app.use(cookieParser());

/* 
-------------------------------------
Routes
-------------------------------------
*/

//Import and mount authentication routes
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
// import conversationRoutes from './routes/conversation.routes.js';

app.use("/api/auth", authRoutes); // All routes will start with /api/auth
app.use("/api/messages", messageRoutes);
// app.use("/api/conversations", conversationRoutes)

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

//Export app to be used in server.js
export { app };