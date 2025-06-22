// src/db/index.js
import mongoose from "mongoose";

// Creating an async function to connect with MongoDB
const connectDB = async () =>{
     try {
          const connectionInStance = await mongoose.connect(process.env.MONGODB_URI);
          console.log(`\nMongoDB connected successfully!! DB HOST: ${connectionInStance.connection.host}`);
     } catch (error) {
          // Exit the process if DB connection fails
          console.log("MongoDB CONNECTION FAILED ", error);
          process.exit(1)
     }
}

export default connectDB