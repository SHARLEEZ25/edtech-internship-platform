const express = require("express");
const {
  login,
  register,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  getMe,
} = require("./auth.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireVerifiedUser } = require("../../middlewares/requireVerifiedUser");


const router = express.Router();


router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/me", requireAuth, getMe);


module.exports = router;
