// src/models/user.model.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
     {
          email: {
               type: String,
               required: true,
               unique: true,
               lowercase: true,
               trim: true,
               match: [/^\S+@\S+\.\S+$/, 'Invalid email format'], // Email regex validation
          },
          fullName: {
               type: String,
               required: true,
               trim: true,
               index: true
          },
          password: {
               type: String,
               // required: [true, 'Password is required']
               required: true,
               minlength: 6,
          },
          username: {
               type: String,
               required: true,
               // default: null, // or leave undefined
               unique: true,
               lowercase: true,
               trim: true,
               // index: true
          },
          // confirmPassword should not be stored in DB. Remove it completely.
          // confirmPassword is for frontend validation only.
          // confirmPassword:{ 
          //      type: String,
          // },
          avatar:{
               // type: String,
               // // required: "", // fixed: required should not be empty string
               // default: "",
               url: { type: String, default: "" },
               public_id: { type: String, default: "" },
          },

          bio: {
               type: String,
               default: "",
               maxlength: 200
          },

          location: {
               type: String,
               trim: true,
               default: "",
             },
          occupation: {
               type: String,
               trim: true,
               default: "",
             },
          lastLogin: {
               type: Date,
               default: Date.now,
             },
          lastActive: {
               type: Date,
               default: Date.now,
             },
          // isVerified:{
          //      type: Boolean,
          //      default: false,
          // },
          refreshToken: {
               type: String,
          },
          // resetPasswordToken: String,
          // resetPasswordExpiresAt: Date,
          // verificationToken: String,
          // verificationTokenExpiresAt: Date,
     }, { timestamps: true } // createdAt & updatedAt will be auto-managed
);
// Hash the password before saving (if modified)
// userSchema.pre("save", async function (next) {
//      if(this.isModified("password")){
//           this.password = await bcrypt.hash(this.password, 10)
//      }
//      next();
// });

// ✅ Method to compare user input password with DB password
// userSchema.methods.isPasswordCorrect = async function (password) {
//      return await bcrypt.compare(password, this.password)
// }


// Hash the password before saving (if modified)
userSchema.pre("save", async function (next) {
     if(!this.isModified("password")) return next();
     try {
          const salt = await bcrypt.genSalt(10)
          this.password = await bcrypt.hash(this.password, salt);
          next();
     } catch (error) {
          next(error);
     }
});

userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcrypt.compare(password, this.password)
};


// ✅ Method to generate Access Token (valid for short time like 15 min - 1 day)
userSchema.methods.generateAccessToken = function(){
     return jwt.sign(
          {
               _id: this._id,
               email: this.email,
               fullName: this.fullName
          },
          process.env.JWT_ACCESS_TOKEN_SECRET,
          {
               expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
          },
     )
}
// ✅ Method to generate Refresh Token (valid for longer time like 7 days)
userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
          {
               _id: this._id
          },
          process.env.JWT_REFRESH_TOKEN_SECRET,
          {
               expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
          }
     );
}
// / Exporting the User model
export const User = mongoose.model("User", userSchema);