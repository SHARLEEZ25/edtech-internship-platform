const prisma = require("../../config/db");
const axios = require("axios");
const { GOOGLE_CALLBACK_URL } = require("../../config/frontend");

const {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  createOTP,
  verifyOTP,
} = require("./auth.service");

const { sendOTPEmail } = require("./email.service");
const { ROLES, ONBOARDING_STEP_ORDER } = require("../../utils/constant");

/* ===============================
   REGISTER
================================ */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        emailVerifiedAt: null,
        role: null,
        onboardingStep: "ROLE_SELECTION",
        isOnboarded: false,
      },
    });

    const otp = await createOTP(user.id, "EMAIL_VERIFICATION");

    console.log("EMAIL VERIFICATION OTP:", otp); // remove in prod

    await sendOTPEmail({
      to: user.email,
      otp,
      type: "EMAIL_VERIFICATION",
    });

    res.status(201).json({
      message: "User registered. Please verify your email.",
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   VERIFY EMAIL
================================ */
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await verifyOTP(user.id, "EMAIL_VERIFICATION", otp);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   RESEND VERIFICATION
================================ */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Rate Limit Check: Check for recent OTPs
    const lastOtp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        purpose: "EMAIL_VERIFICATION",
      },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp) {
      const timeDiff = Date.now() - new Date(lastOtp.createdAt).getTime();
      const cooldown = 60 * 1000; // 60 seconds

      if (timeDiff < cooldown) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(
            (cooldown - timeDiff) / 1000
          )}s before requesting a new code`,
        });
      }
    }

    const otp = await createOTP(user.id, "EMAIL_VERIFICATION");
    console.log("RESENT EMAIL VERIFICATION OTP:", otp);

    await sendOTPEmail({
      to: user.email,
      otp,
      type: "EMAIL_VERIFICATION",
    });

    res.json({ message: "Verification code resent" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   LOGIN
================================ */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerifiedAt) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   REFRESH TOKEN
================================ */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const tokenHash = hashToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt < new Date()
    ) {
      res
        .clearCookie("accessToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const newRefreshToken = generateRefreshToken();
    const newHash = hashToken(newRefreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = generateAccessToken(user);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Token refreshed" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   LOGOUT
================================ */
const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const tokenHash = hashToken(token);
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   FORGOT PASSWORD
================================ */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const otp = await createOTP(user.id, "PASSWORD_RESET");
      console.log("PASSWORD RESET OTP:", otp);

      await sendOTPEmail({
        to: user.email,
        otp,
        type: "PASSWORD_RESET",
      });
    }

    res.json({
      message: "If the account exists, a reset code has been sent",
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   RESET PASSWORD
================================ */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and newPassword are required",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    await verifyOTP(user.id, "PASSWORD_RESET", otp);

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GOOGLE OAUTH
================================ */
const googleAuth = (req, res) => {
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing");
  console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent("openid email profile")}` +
    `&access_type=offline` +
    `&prompt=consent`;

  res.redirect(redirectUrl);
};

const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    // 1️⃣ Exchange code for token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenRes.data;

    // 2️⃣ Get user profile
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name, email_verified } = profileRes.data;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by Google" });
    }

    // 3️⃣ Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: name,
          emailVerifiedAt: new Date(),
          role: null,
          onboardingStep: "ROLE_SELECTION",
          isOnboarded: false,
        },
      });
    } else if (!user.emailVerifiedAt) {
      // Mark existing Google user as verified since Google already verified the email
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      });
      user.emailVerifiedAt = new Date();
    }

    // 4️⃣ Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 5️⃣ Cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // 🔴 IMPORTANT: Allow cross-site
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      // 6️⃣ Redirect frontend
      .redirect(GOOGLE_CALLBACK_URL);

  } catch (err) {
    console.error("Google OAuth Error:", err);
    next(err);
  }
};
/* ===============================
   GET ME
================================ */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user with relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            skills: true,
          },
        },
        recruiterProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let progress = {
      percentage: 0,
      currentStep: user.onboardingStep,
      totalSteps: 0,
      stepIndex: 0,
    };

    if (user.role && ONBOARDING_STEP_ORDER[user.role]) {
      const steps = ONBOARDING_STEP_ORDER[user.role];
      const totalSteps = steps.length - 1; // Excluding COMPLETED
      const currentStepIndex = steps.indexOf(user.onboardingStep);

      if (currentStepIndex !== -1) {
        progress = {
          percentage: Math.round((currentStepIndex / totalSteps) * 100),
          currentStep: user.onboardingStep,
          totalSteps: totalSteps,
          stepIndex: currentStepIndex + 1,
        };
      }
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isOnboarded: user.isOnboarded,
      onboardingStep: user.onboardingStep,
      emailVerifiedAt: user.emailVerifiedAt,
      studentProfile: user.role === ROLES.STUDENT ? {
        ...user.studentProfile,
        // Ensure nesting or naming if frontend expects something specific
      } : null,
      recruiterProfile: user.role === ROLES.RECRUITER ? user.recruiterProfile : null,
      progress,
    });
  } catch (err) {
    next(err);
  }
};



/* ===============================
   EXPORTS
================================ */
module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  getMe,

};
