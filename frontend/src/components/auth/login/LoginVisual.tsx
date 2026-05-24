import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/auth/login.css";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginFormSideProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

export const LoginFormSide: React.FC<LoginFormSideProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  error,
  handleSubmit,
}) => {
  return (
    <div className="login-form-wrapper">
      {/* Header */}
      <div className="login-form-header">
        <h1>Welcome Back 👋</h1>
        <p>Log in to continue your internship journey.</p>
      </div>

      {/* Google Login */}
      <GoogleLoginButton />

      <div className="divider">
        <span>OR CONTINUE WITH EMAIL</span>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="input-field"
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field password-input"
            />
            <button
              type="button"
              className={`password-toggle ${showPassword ? "active" : ""}`}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="material-symbols-outlined eye">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="error-text">{error}</p>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} className="signin-btn">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Footer */}
      <div className="footer-links">
        <a href="/forgot-password" className="link-primary">
          Forgot Password?
        </a>
        <p className="link-text">
          New to Thozhil?{" "}
          <Link to="/signup" className="link-primary">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export const LoginVisualSide: React.FC = () => {
  return (
    <div className="visual-root" style={{ height: '100%', width: '100%' }}>
      <div className="visual-wrapper">
        {/* Glow Backgrounds */}
        <div className="glow glow-main" />
        <div className="glow glow-green" />
        <div className="glow glow-yellow" />
        <div className="glow glow-pink" />

        {/* Floating Cards */}
        <div className="card card-left">
          <span className="dot purple" />
          <span className="line purple" />
        </div>

        <div className="card card-right">
          <div className="text-lines">
            <span />
            <span />
            <span />
          </div>
          <span className="material-symbols-outlined icon sparkle">
            auto_awesome
          </span>
        </div>

        <div className="card card-bottom">
          <span className="trend">
            <span className="arrow-icon"></span>
          </span>

          <span className="divider" />

          <span className="trend">
            <span className="arrow-icon"></span>
          </span>

          <span className="divider" />

          <span className="trend">
            <span className="arrow-icon"></span>
          </span>
        </div>

        <div className="dots-circle">
          <span className="dot center" />
          <span className="dot small s1" />
          <span className="dot medium s2" />
          <span className="dot small s3" />
          <span className="dot tiny s4" />
          <span className="dot medium s5" />
        </div>

        {/* Center Badge */}
        <div className="center-ring">
          <div className="center-badge">🎓</div>
        </div>
      </div>

      <p className="visual-text">
        Build skills. Apply for internships. Kickstart your career.
      </p>
    </div>
  );
};

export default LoginVisualSide;
