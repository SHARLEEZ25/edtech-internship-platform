import axios from "axios";
const api = axios.create({
  baseURL: "/api/auth", //  RELATIVE URL ONLY
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   AUTH APIs
============================ */

/** Register */
export const register = (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  return api.post("/register", {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
  });
};

/** Verify Email */
export const verifyEmail = (data: {
  email: string;
  otp: string;
}) => {
  return api.post("/verify-email", data);
};

/** Resend Verification Email */
export const resendVerification = (email: string) => {
  return api.post("/resend-verification", { email });
};

/** Login */
export const login = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/login", data);
};

/** Refresh token */
export const refreshToken = () => {
  return api.post("/refresh-token");
};

/** Logout */
export const logout = () => {
  return api.post("/logout");
};

/** Forgot password */
export const forgotPassword = (data: {
  email: string;
}) => {
  return api.post("/forgot-password", data);
};

/** Reset password */
export const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  return api.post("/reset-password", data);
};

/** Get Current User */
export const getMe = () => {
  return api.get("/me");
};

/** Google OAuth */
export const googleLogin = () => {
  window.location.href = "/api/auth/google";
};
