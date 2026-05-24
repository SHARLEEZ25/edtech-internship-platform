// ============================================
// IMPORTS
// ============================================
// React hooks and types
import { useState } from "react";
import type { FormEvent } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// API functions
import { forgotPassword } from "@/api/auth.api";

// ============================================
// COMPONENT DEFINITION
// ============================================
const ForgotPasswordForm = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ============================================
  // HOOKS
  // ============================================
  const navigate = useNavigate();

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await forgotPassword({ email });
      // Suggest pass email to reset-password to prefill
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to send reset instructions"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // JSX RENDERING
  // ============================================
  return (
    <div className="form-wrapper">
      {/* Form Header */}
      <header className="form-header">
        <h1>Forgot Password?</h1>
        <p>
          No worries, enter your email and we'll send you reset instructions.
        </p>
      </header>

      {/* Forgot Password Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email Input Field */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Error Message Display */}
        {error && <p className="error-text">{error}</p>}

        {/* Submit Button */}
        <button type="submit" className="auth-action-button glow-on-hover" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Form Footer */}
      <footer className="form-footer">
        <a href="/login" className="login-link">
          Back to Login
        </a>
      </footer>
    </div>
  );
};


export default ForgotPasswordForm;
