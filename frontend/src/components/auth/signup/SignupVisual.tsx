import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/auth/signup.css";
import GoogleSignupButton from "./GoogleSignupButton";

interface SignupFormSideProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading?: boolean;
  error?: string | null;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const SignupFormSide: React.FC<SignupFormSideProps> = ({
  formData,
  loading,
  error,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="form-wrapper">
      {/* Header */}
      <header className="form-header">
        <h1>Create Your Account</h1>
        <p>Start your internship and skill-building journey today.</p>
      </header>

      {/* Google Button */}
      <GoogleSignupButton />

      {/* Divider */}
      <div className="divider">
        <span className="divider-text">OR CONTINUE WITH EMAIL</span>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="visibility-btn"
              onClick={() => setShowPassword((v) => !v)}
              disabled={loading}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="visibility-btn"
              onClick={() => setShowConfirmPassword((v) => !v)}
              disabled={loading}
            >
              <span className="material-symbols-outlined">
                {showConfirmPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="error-text" style={{ fontSize: '14px', marginBottom: '8px' }}>{error}</p>}

        {/* Submit */}
        <button type="submit" className="create-account-button" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <footer className="form-footer">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Log In
          </Link>
        </p>
      </footer>
    </div>
  );
};

export const SignupVisualSide: React.FC = () => {
  return (
    <div className="visual-section" style={{ height: '100%' }}>
      {/* Background glows */}
      <div className="glow blue"></div>
      <div className="glow pink"></div>
      <div className="glow purple"></div>

      <div className="orbit-container">
        <div className="orbit orbit-1"></div>
        <div className="orbit orbit-2"></div>
        <div className="orbit orbit-3"></div>

        {/* User Icon */}
        <svg className="user-icon" viewBox="0 0 100 200">
          <path d="M50 30C39 30 30 39 30 50C30 61 39 70 50 70C61 70 70 61 70 50C70 39 61 30 50 30Z" />
          <path d="M20 100C20 83 33 70 50 70C67 70 80 83 80 100V150C80 167 67 180 50 180C33 180 20 167 20 150V100Z" />
        </svg>

        {/* Floating Icons */}
        <div className="orbit-ring"></div>
        <div className="float-icon top">
          <span className="material-symbols-outlined">school</span>
        </div>

        <div className="float-icon right">
          <span className="material-symbols-outlined">code</span>
        </div>

        <div className="float-icon bottom">
          <span className="material-symbols-outlined">groups</span>
        </div>

        <div className="float-icon left">
          <span className="material-symbols-outlined">business_center</span>
        </div>
      </div>

      <p className="visual-text">
        Build your skills. Get opportunities. Kickstart your <br />
        career with Thozhil.
      </p>
    </div>
  );
};
