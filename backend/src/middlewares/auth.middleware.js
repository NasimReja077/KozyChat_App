// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Try to get token from cookie or Authorization header
    const token = 
    req.cookies?.accessToken || 
    req.header("Authorization")?.replace("Bearer ", "")

    // If token is missing, block access
    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided")
    }

    // Decode and verify token using JWT and secret key
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Find the user in DB using ID from token, excluding password and refreshToken
    const user = await User.findById(decodedToken?.userId).select("-password -refreshToken");

    // If user not found
    if (!user) {
      throw new ApiError(401, "Unauthorized - User not found")
    }

    // Attach user data to request object
    req.user = user

    // Continue to next middleware
    next();
  } catch (error) {
    // Handle JWT errors more specifically
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Unauthorized - Token expired. Please log in again.")
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Unauthorized - Invalid token.")
    }

    throw new ApiError(401, error?.message || "Unauthorized - Invalid or expired token.")
  }
});
// Middleware to verify JWT (authentication middleware)

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     // Try to get token from cookie or Authorization header
//     // const token = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer ", "");

//     const token = req.cookies?.accessToken || 
//     req.headers?.authorization?.replace("Bearer ", "");

//     // If token is missing, block access
//     if (!token) {
//       throw new ApiError(401, "Unauthorized request - No token provided");
//     }

//     // Decode and verify token using JWT and secret key
//     const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
//     console.log("Decoded Token:", decodedToken);

//     // Find the user in DB using ID from token, excluding password and refreshToken
//     const user = await User.findById(decodedToken?.userId).select("-password -refreshToken");

//     // If user not found
//     if (!user) {
//       console.error("User not found for ID:", decodedToken?.userId);
//       throw new ApiError(401, "Unauthorized - User not found");
//     }

//     // Attach user data to request object
//     req.user = user;

//     // Continue to next middleware
//     next();
//   } catch (error) {
//     // Handle JWT errors more specifically
//     if (error instanceof jwt.TokenExpiredError) {
//       console.error("JWT Token Expired:", error.message);
//       throw new ApiError(401, "Unauthorized - Token expired. Please log in again.");
//     }

//     if (error instanceof jwt.JsonWebTokenError) {
//       console.error("JWT Error:", error.message);
//       throw new ApiError(401, "Unauthorized - Invalid token.");
//     }

//     console.error("JWT Verification Error:", error.message);
//     throw new ApiError(401, "Unauthorized - Invalid or expired token.");
//   }
// });
