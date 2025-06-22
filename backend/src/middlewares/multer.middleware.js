// src/middlewares/multer.middleware.js
import multer from "multer";

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Saving file to ./public/temp");
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    console.log("File original name:", file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});