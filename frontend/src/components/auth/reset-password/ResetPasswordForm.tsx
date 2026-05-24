// ============================================
// IMPORTS
// ============================================
// React hooks and types
import { useState } from "react";
import type { FormEvent } from "react";

// Routing
import { Link, useLocation, useNavigate } from "react-router-dom";

// API functions
import { resetPassword } from "@/api/auth.api";

// ============================================
// TYPES
// ============================================
interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// COMPONENT DEFINITION
// ============================================
const ResetPasswordForm = () => {
  // ============================================
  // HOOKS
  // ============================================
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: prefill email if passed from forgot-password page
  const prefilledEmail = (location.state as any)?.email || "";

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: prefilledEmail,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 🛡️ Client-side validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      });

      setSuccess(true);

      // Optional auto-redirect
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "";
      if (msg.includes("Internal Server Error") || msg === "") {
        setError("Invalid or expired OTP. Please try again or resend a new one.");
      } else {
        setError(msg || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SUCCESS STATE RENDERING
  // ============================================
  if (success) {
    return (
      <div className="form-wrapper">
        <h1>Password Reset Successful ✅</h1>
        <p>You can now log in with your new password.</p>
        <Link to="/login" className="login-link">
          Go to Login
        </Link>
      </div>
    );
  }

  // ============================================
  // JSX RENDERING
  // ============================================
  return (
    <div className="form-wrapper">
      {/* Form Header */}
      <header className="form-header">
        <h1>Reset Your Password</h1>
        <p>Enter the OTP sent to your email and set a new password.</p>
      </header>

      {/* Reset Password Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* OTP Input */}
        <div className="input-group">
          <label>OTP</label>
          <input
            name="otp"
            type="text"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
          />
        </div>

        {/* New Password Input */}
        <div className="input-group">
          <label>New Password</label>
          <input
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="input-group">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Error Message Display */}
        {error && <p className="error-text">{error}</p>}

        {/* Submit Button */}
        <button type="submit" className="reset-password-button glow-on-hover" disabled={loading}>
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>

      {/* Form Footer */}
      <footer className="form-footer">
        <Link to="/login" className="login-link">
          Back to Login
        </Link>
      </footer>
    </div>
  );
};


export default ResetPasswordForm;
