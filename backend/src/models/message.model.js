// src/models/message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "file", "voice", "gif"],
      default: "text",
    },
    text: {
      type: String,
    },
    media: {
      url: String,
      public_id: String,
      fileType: String,
      fileName: String,
      fileSize: Number,
    },
     gifUrl: { // Add gifUrl field for GIF messages
      type: String,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Tracks users who deleted the message for themselves
    deletedForEveryone: {
      type: Boolean,
      default: false,
    }, // Indicates if deleted for all
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;