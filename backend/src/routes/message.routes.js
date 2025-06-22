// src/routes/message.routes.js
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
  sendMessage, 
  getUsersForSidebar, 
  getMessages, // <-- renamed from getMessage
  markMessageAsRead,
  getOrCreateConversation,
  deleteMessageForMe,
  deleteMessageForEveryone,
} from "../controllers/message.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Sidebar: list all users in conversations
router.get("/users", verifyJWT, getUsersForSidebar);

router.post("/conversation", verifyJWT, getOrCreateConversation);

// Send a message to a conversation (POST body includes senderId, text, etc.)
router.post("/send", verifyJWT, upload.single("file"), sendMessage);

// Get all messages from a conversation by ID
router.get("/:conversationId", verifyJWT, getMessages);

// Mark a specific message as red 
router.patch("/read/:messageId", verifyJWT, markMessageAsRead);


router.delete("/delete-for-me/:messageId", verifyJWT, deleteMessageForMe);
router.delete("/delete-for-everyone/:messageId", verifyJWT, deleteMessageForEveryone);

export default router;
