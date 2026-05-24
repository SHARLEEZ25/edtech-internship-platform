const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");

/* ===============================
   PASSWORD HELPERS
================================ */

const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/* ===============================
   TOKEN HELPERS
================================ */

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateAccessToken = (user) => {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    console.error("JWT secret not set. Please set JWT_SECRET in .env");
    throw new Error("JWT secret not set");
  }
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/* ===============================
   USER HELPERS
================================ */

const getAuthenticatedUser = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isOnboarded: true,
    },
  });
};

/* ===============================
   OTP HELPERS
================================ */

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/* ===============================
   CREATE OTP
================================ */

const createOTP = async (userId, purpose) => {
  const otp = generateOTP();
  const codeHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otp.updateMany({
    where: { userId, purpose, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.otp.create({
    data: { userId, purpose, codeHash, expiresAt },
  });

  return otp;
};

/* ===============================
   VERIFY OTP
================================ */

const verifyOTP = async (userId, purpose, otp) => {
  const codeHash = hashOTP(otp);

  const record = await prisma.otp.findFirst({
    where: {
      userId,
      purpose,
      codeHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("Invalid or expired OTP");
  }

  await prisma.otp.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return true;
};



/* ===============================
   EXPORTS
================================ */

module.exports = {
  hashPassword,
  verifyPassword,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  createOTP,
  verifyOTP,
  getAuthenticatedUser,
  
};
