import React from "react";
import "@/styles/auth/auth-layout.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  visual?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, visual }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {children}
          </div>
        </div>

        {visual && (
          <div className="auth-visual-section">
            {visual}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;