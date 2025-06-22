// src/ utils/ cloudinary.js
// Import cloudinary SDK and filesystem
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"; // Added for path normalization

// Function to configure Cloudinary
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Log the configuration for debugging
  console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Verify configuration
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("Missing Cloudinary configuration");
    throw new Error("Cloudinary configuration is incomplete");
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Configure Cloudinary before uploading
    configureCloudinary();

    // Validate file path exists
    if (!localFilePath) {
      console.log("No file path provided for upload");
      return null;
    }

    // Normalize the file path
    localFilePath = path.normalize(localFilePath);

    // Check if file exists at the given path
    if (!fs.existsSync(localFilePath)) {
      console.log("File not found at path:", localFilePath);
      return null;
    }

    console.log("Uploading to Cloudinary:", localFilePath);

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "chat_app_profile",
    });

    // File upload successful, delete local file
    try {
      fs.unlinkSync(localFilePath);
      console.log("Local file removed after successful upload");
    } catch (unlinkError) {
      console.error("Could not delete local file:", unlinkError);
    }

    console.log("Upload successful:", response.secure_url);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // Attempt to clean up local file if upload failed
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("Local file deleted after upload failure");
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file after failed upload:", cleanupError);
    }

    return null;
  }
};

export { uploadOnCloudinary };

// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: 'dxovjhjty', 
//         api_key: '472181648675868', 
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();