// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Fixed typo from 'asynHandler'
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
// import { now } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const signup = asyncHandler(async (req, res) =>{
  const { fullName, email, password } = req.body;

  if (
    [fullName ,email ,password].some((field) => !field?.trim())){
    throw new ApiError(400, "Allfields are required")
  }

  const existingUser = await User.findOne({ email });

  if(existingUser){
    throw new ApiError(409, "User with email already exists")
  }

  if (password.length < 6){
    throw new ApiError(400, "Password must be at least 6 characters")
  }

  // Auto-generate uniqe username
  // Auto-generate unique username
  const baseUsername = fullName.trim().toLowerCase().replace(/\s+/g, "_");
  let finalUsername = baseUsername;
  let usernameTaken = true;
  let counter = 1;

  while (usernameTaken) {
    const userWithUsername = await User.findOne({ username: finalUsername });
    if (userWithUsername) {
      finalUsername = `${baseUsername}${counter++}`;
    } else {
      usernameTaken = false;
    }
  }

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  let avatar = {
    url: "",
    public_id: "",
  }

  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      avatar ={
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      }
    }
  }
  

  const user = await User.create({
    fullName,
    email,
    password ,
    username: finalUsername,
    avatar,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
  } 
  generateTokenAndSetCookie(user._id, res); // without escape


  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered Successfully"));
});

export const login = asyncHandler(async (req, res) =>{
  const { email, password } = req.body;

  if(!email || !password){
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if(!user){
    throw new ApiError(404, "User dose not exist")
  }

  // Log the input password and hashed password for debugging
  // console.log("Input Password:", password);
  // console.log("Stored Password:", user.password);

  
  // const isPasswordValid = await user.isPasswordCorrect(password)

  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect){
    throw new ApiError(401, "Invalid credentials")
  }

  // if(!isPasswordValid){
  //   throw new ApiError(401, "Invalid user Credentials")
  // }

  // user.lastLogin = new Data()
  // await user.save({ validateBeforeSave: false })

  const { accessToken, refreshToken } = generateTokenAndSetCookie(user._id, res);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // const options = {
  //   httpOnly: true,
  //   sameSite: "strict",
  //   secure: process.env.NODE_ENV === "production", // Set secure to true in production
  // };


  return res.status(200)
  // .cookie("accessToken", accessToken, options)
  // .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, {
      user:loggedInUser, accessToken, refreshToken
    },"User Logged In successFully")
  )
});

export const logout = asyncHandler(async (req, res) =>{
  res.clearCookie("accessToken",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  return res.status(200).json(new ApiResponse(200, {}, "User Logged out Successfully"))
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username, bio, location, occupation } = req.body;
  const userId = req.user._id;

  console.log("Request body:", req.body);
  console.log("Request file:", req.file); // Debug: Log file details

  const updateFields = {};
  if (fullName?.trim()) updateFields.fullName = fullName.trim();
  if (username?.trim()) {
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ApiError(409, "Username is already taken");
    }
    updateFields.username = username.toLowerCase().trim();
  }
  if (bio !== undefined) updateFields.bio = bio.trim();
  if (location !== undefined) updateFields.location = location.trim();
  if (occupation !== undefined) updateFields.occupation = occupation.trim();

  if (req.file) {
    console.log("Processing file upload:", req.file.path); // Debug: Log file path
    try {
      if (!fs.existsSync(req.file.path)) {
        throw new ApiError(400, "Uploaded file not found on server");
      }

      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult || !uploadResult.secure_url) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
      }

      updateFields.avatar = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id || "",
      };

      // Clean up local file
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up local file:", cleanupError.message);
      }
    } catch (error) {
      // Clean up local file on error
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Failed to clean up local file:", cleanupError.message);
        }
      }
      throw new ApiError(
        error.statusCode || 500,
        error.message || "Error uploading profile image"
      );
    }
  }

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  console.log("Updated user:", updatedUser); // Debug: Log updated user
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export const checkAuth = asyncHandler(async (req, res) => {
  try {
    // Return user data wrapped in ApiResponse
    return res.status(200).json(
      new ApiResponse(200, req.user, "User authenticated successfully")
    );
   } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    throw new ApiError(500, "Internal Server Error");
  }
});

// export const signup = asyncHandler(async (req, res) => {
//   const { fullName, email, password } = req.body;


//     // Validate required fields
//     if ([fullName, email, password].some((field) => !field?.trim())) {
//       throw new ApiError(400, "All fields are required");
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       throw new ApiError(400, "User with this email already exists");
//     }

//     // Validate password length
//     if (password.length < 6) {
//       throw new ApiError(400, "Password must be at least 6 characters");
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate a random verification token
//     const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

//     // Create the user with necessary fields
//     const user = await User.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       verificationToken,
//       // verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000, // Token expires in 1 hour
//       isVerified: false,
//     });

//     // Exclude password and refreshToken from the user object when returning it
//     const createdUser = await User.findById(user._id).select("-password -refreshToken");

//     if (!createdUser) {
//       throw new ApiError(500, "Something There was a problem during registration the user");
//     }

//     // Generate token and set in cookies
//     generateTokenAndSetCookie(res, user._id);

//     // Send verification email
//     await sendVerificationEmail(user.email, verificationToken);

//     // Send response
//     return res.status(201).json(
//       new ApiResponse(201, null, "User registration successful. Email verification sent.")
//     );
// });

// export const verifyEmail = asyncHandler(async (req, res) =>{
//   const { code } = req.body;
  
//   const user = await User.findOne({
//     verificationToken: code,
//     verificationTokenExpiresAt: { $gt: Date.now() },
//     });

//     if(!user){
//       throw new ApiError(400, "Invalid or expired verification code");
//     }
    
//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiresAt = undefined;
//     await user.save();
    
//     await sendWelcomeEmail(user.email, user.fullName);

//     const safeUser = user.toObject();
//     delete safeUser.password;
//     delete safeUser.refreshToken;

//     return res.status(200).json(
//       new ApiResponse(200, safeUser, "Email verified successfully")
//     );
//   }
// );

// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new ApiError(400, "Email and password are required");
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new ApiError(404, "User does not exist");
//   }

//   if (!user.isVerified) {
//     throw new ApiError(400, "Please verify your email before logging in");
//   }

//   // console.log("Stored password (hashed):", user.password);
//   // console.log("Input Password:", password);

//   const isPasswordValid = await user.isPasswordCorrect(password);
//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials");
//   }

//   user.lastLogin = Date.now();
//   user.lastActive = Date.now();
//   await user.save({ validateBeforeSave: false });


//   // const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
//   generateTokenAndSetCookie(res, user._id);

//   const safeUser = user.toObject();
//   delete safeUser.password;
//   delete safeUser.refreshToken;

//   return res.status(200)
  
//   .json(
//     new ApiResponse(
//       200, safeUser, "User logged In Successfully")
//   );
// });

// export const logout = asyncHandler (async (req, res) =>{
//     res.clearCookie("accessToken", {
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     return res.status(200).json(
//       new ApiResponse(200, null, "Logged out successfully")
//     );
//   });