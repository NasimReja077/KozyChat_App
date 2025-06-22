// src/utils/generateTokenAndSetCookie.js
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  // Create access token
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,  // Use the correct access token secret
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY, // 15m or as per your .env
    }
  );

  // Create refresh token
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,  // Use the correct refresh token secret
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY, // 7d or as per your .env
    }
  );

  // Set the access token cookie
  res.cookie("accessToken", accessToken, {
    maxAge: Number.parseInt(process.env.JWT_ACCESS_COOKIE_EXPIRY_MS), // 15 minutes
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",  // Secure flag only for production
  });

  // Set the refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    maxAge: Number.parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRY_MS), // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",  // Secure flag only for production
  });

  // Return both tokens in case needed for the client-side
  return { accessToken, refreshToken };
};

export default generateTokenAndSetCookie;
