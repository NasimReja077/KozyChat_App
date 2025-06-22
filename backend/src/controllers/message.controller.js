// src/controllers/message.controller.js
import { User } from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { io, onlineUsers } from "../index.js";

// Get all users for sidebar except current user
export const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password -refreshToken"
  );

  const conversations = await Conversation.find({
    members: { $in: [loggedInUserId] },
  })
    .populate({
      path: "lastMessage",
      select: "text createdAt",
    })
    .lean();

  const usersWithConversationData = await Promise.all(
    users.map(async (user) => {
      const conversation = conversations.find((conv) =>
        conv.members.some((member) => member.toString() === user._id.toString())
      );

      let lastMessage = "";
      let lastMessageTime = null;
      let unreadCount = 0;

      if (conversation && conversation.lastMessage) {
        lastMessage = conversation.lastMessage.text || "Media message";
        lastMessageTime = conversation.lastMessage.createdAt;
        unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          senderId: { $ne: loggedInUserId },
          readBy: { $ne: loggedInUserId },
        });
      }

      return {
        ...user.toObject(),
        lastMessage,
        lastMessageTime,
        unreadCount,
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, usersWithConversationData, "Users fetched successfully")
  );
});

// Send message
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, conversationId, text, type = "text", gifUrl } = req.body;
  const senderId = req.user._id;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  if (!text && !req.file && !gifUrl) {
    throw new ApiError(400, "Message content, file, or GIF is required");
  }

  if (senderId.toString() === receiverId.toString()) {
    throw new ApiError(400, "Cannot send message to self");
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new ApiError(400, "Invalid receiver ID");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new ApiError(404, "Receiver not found");
  }

  const senderObjectId = new mongoose.Types.ObjectId(senderId);
  const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

  let conversation;
  if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
    conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
  } else {
    conversation = await Conversation.findOne({
      members: { $all: [senderObjectId, receiverObjectId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderObjectId, receiverObjectId],
        messages: [],
        unreadCount: new Map([
          [senderObjectId.toString(), 0],
          [receiverObjectId.toString(), 0],
        ]),
      });
    }
  }

  let media = {};
  let localFilePath = req.file?.path ? path.normalize(req.file.path) : null;

  if (req.file) {
    if (!fs.existsSync(localFilePath)) {
      throw new ApiError(400, "Uploaded file not found on server");
    }
    const uploaded = await uploadOnCloudinary(localFilePath);
    if (!uploaded) {
      throw new ApiError(500, "Failed to upload media to Cloudinary");
    }
    media = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
      fileType: uploaded.resource_type,
      fileName: req.file.originalname,
      fileSize: uploaded.bytes,
    };
  }

  try {
    const newMessage = await Message.create({
      senderId,
      receiverId,
      conversationId: conversation._id,
      text: text || "",
      type,
      media: Object.keys(media).length > 0 ? media : undefined,
      gifUrl: type === "gif" ? gifUrl : undefined,
      readBy: [senderId],
      deliveredTo: onlineUsers.has(receiverId.toString()) ? [senderId, receiverId] : [senderId],
    });

    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id;

    if (!conversation.unreadCount) {
      conversation.unreadCount = new Map();
    }

    const receiverKey = receiverId.toString();
    const currentUnread = conversation.unreadCount.get(receiverKey) || 0;
    conversation.unreadCount.set(receiverKey, currentUnread + 1);
    conversation.unreadCount.set(senderId.toString(), 0);

    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullName username avatar")
      .populate("receiverId", "fullName username avatar");

    // Emit Socket.IO event for new message
    io.emit("sendMessage", {
      message: populatedMessage,
      conversationId: conversation._id,
      receiverId,
    });

    // If receiver is online, emit delivered status
    if (onlineUsers.has(receiverId.toString())) {
      io.to(onlineUsers.get(receiverId.toString())).emit("messageDelivered", {
        messageId: newMessage._id,
        conversationId: conversation._id,
      });
    }

    return res
      .status(201)
      .json(new ApiResponse(201, populatedMessage, "Message sent successfully"));
  } catch (error) {
    console.error("Error saving message:", error);
    throw new ApiError(500, "Failed to save message to database");
  }
});

// Get messages for a conversation
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new ApiError(400, "Invalid conversation ID");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.members.includes(userId)) {
    throw new ApiError(403, "You are not a member of this conversation");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("senderId", "fullName username avatar")
    .populate("receiverId", "fullName username avatar")
    .lean();

  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
    }
  );

  if (!conversation.unreadCount) {
    conversation.unreadCount = new Map();
  }
  conversation.unreadCount.set(userId.toString(), 0);
  await conversation.save();

  // Emit read events for messages
  messages.forEach((message) => {
    if (
      message.senderId._id.toString() !== userId.toString() &&
      !message.readBy.includes(userId)
    ) {
      io.emit("messageRead", {
        messageId: message._id,
        conversationId,
        senderId: message.senderId._id,
      });
    }
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(),
        page,
        limit,
      },
      "Messages fetched successfully"
    )
  );
});

// Mark single message as read
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    throw new ApiError(400, "Invalid message ID");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.receiverId.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only mark messages sent to you as read");
  }

  if (!message.readBy.includes(userId)) {
    message.readBy.push(userId);
    await message.save();

    // Emit read event
    const senderSocketId = onlineUsers.get(message.senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageRead", {
        messageId,
        conversationId: message.conversationId,
      });
    }
  }

  const conversation = await Conversation.findById(message.conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.unreadCount) {
    conversation.unreadCount = new Map();
  }
  conversation.unreadCount.set(userId.toString(), 0);
  await conversation.save();

  const populatedMessage = await Message.findById(messageId)
    .populate("senderId", "fullName username avatar")
    .populate("receiverId", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, populatedMessage, "Message marked as read"));
});

// Get or create conversation
export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  if (senderId.toString() === receiverId.toString()) {
    throw new ApiError(400, "Cannot create conversation with self");
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new ApiError(400, "Invalid receiver ID");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new ApiError(404, "Receiver not found");
  }

  const senderObjectId = new mongoose.Types.ObjectId(senderId);
  const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

  let conversation = await Conversation.findOne({
    members: { $all: [senderObjectId, receiverObjectId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      members: [senderObjectId, receiverObjectId],
      messages: [],
      unreadCount: new Map([
        [senderObjectId.toString(), 0],
        [receiverObjectId.toString(), 0],
      ]),
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { conversationId: conversation._id },
        "Conversation fetched or created"
      )
    );
});


// Delete message for the current user
export const deleteMessageForMe = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    throw new ApiError(400, "Invalid message ID");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Check if user is part of the conversation
  if (
    message.senderId.toString() !== userId.toString() &&
    message.receiverId.toString() !== userId.toString()
  ) {
    throw new ApiError(403, "You are not authorized to delete this message");
  }

  // Add user to deletedFor array if not already present
  if (!message.deletedFor.includes(userId)) {
    message.deletedFor.push(userId);
    await message.save();
  }

  // Notify other user if online
  const otherUserId =
    message.senderId.toString() === userId.toString()
      ? message.receiverId.toString()
      : message.senderId.toString();
  const receiverSocketId = onlineUsers.get(otherUserId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageDeletedForMe", {
      messageId,
      conversationId: message.conversationId,
      deletedBy: userId,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted for you successfully"));
});

// Delete message for everyone
export const deleteMessageForEveryone = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    throw new ApiError(400, "Invalid message ID");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Only sender can delete for everyone
  if (message.senderId.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the sender can delete this message for everyone");
  }

  // Mark message as deleted for everyone
  message.deletedForEveryone = true;
  message.deletedFor = [message.senderId, message.receiverId];
  await message.save();

  // Update conversation's last message if this was the last one
  const conversation = await Conversation.findById(message.conversationId);
  if (conversation.lastMessage.toString() === messageId) {
    const previousMessage = await Message.findOne({
      conversationId: message.conversationId,
      _id: { $ne: messageId },
      deletedForEveryone: false,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    conversation.lastMessage = previousMessage ? previousMessage._id : null;
    await conversation.save();
  }

  // Notify other user if online
  const receiverSocketId = onlineUsers.get(message.receiverId.toString());
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageDeletedForEveryone", {
      messageId,
      conversationId: message.conversationId,
      deletedBy: userId,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted for everyone successfully"));
});