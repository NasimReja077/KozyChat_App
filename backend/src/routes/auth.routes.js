// src/routes/auth.routes.js
import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/updateProfile", verifyJWT , upload.single("avatar"), updateProfile);
router.get("/check", verifyJWT, checkAuth);

// // Login page
// router.get('/login', (req, res) => {
//   res.send('<h1>Please login at my chat app.</h1>');
// });


export default router;