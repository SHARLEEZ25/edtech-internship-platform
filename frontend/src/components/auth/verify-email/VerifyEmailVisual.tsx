import React from "react";
import "../../../styles/auth/verify-email.css";

interface VerifyEmailFormSideProps {
    email: string;
    otp: string;
    setOtp: (value: string) => void;
    loading: boolean;
    error: string | null;
    successMessage?: string | null;
    handleSubmit: (e: React.FormEvent) => void;
    onResend: () => void;
    timer: number;
    isResendDisabled: boolean;
}

export const VerifyEmailFormSide: React.FC<VerifyEmailFormSideProps> = ({
    email,
    otp,
    setOtp,
    loading,
    error,
    successMessage,
    handleSubmit,
    onResend,
    timer,
    isResendDisabled,
}) => {
    return (
        <div className="verify-form-wrapper">
            <div className="verify-header">
                <h1>Verify Your Email</h1>
                <p>
                    Enter the 6-digit verification code we sent to <b>{email}</b> to continue.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="otp-group">
                    <label>Verification Code</label>
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        className="otp-input-field"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                    />
                </div>

                {error && <p className="error-text" style={{ marginBottom: '16px' }}>{error}</p>}

                {successMessage && (
                    <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', marginBottom: '16px', textAlign: 'center' }}>
                        {successMessage}
                    </p>
                )}

                <button type="submit" disabled={loading} className="verify-btn">
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </form>

            <div className="resend-section">
                Didn't receive the code?
                <button
                    type="button"
                    className="resend-btn"
                    onClick={onResend}
                    disabled={isResendDisabled}
                    style={{ opacity: isResendDisabled ? 0.5 : 1, cursor: isResendDisabled ? 'not-allowed' : 'pointer' }}
                >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                </button>
            </div>
        </div>
    );
};

export const VerifyEmailVisualSide: React.FC = () => {
    return (
        <div className="verify-visual-root">
            <div className="verify-visual-wrapper">
                {/* Glow Backgrounds */}
                <div className="glow glow-emerald" />
                <div className="glow glow-indigo" />

                <div className="center-ring">
                    <div className="shield-badge">🛡️</div>
                </div>

                {/* Floating decorative elements */}
                <div className="card card-left" style={{ top: '60px', left: '20px' }}>
                    <span className="dot" style={{ backgroundColor: '#10b981' }} />
                </div>
                <div className="card card-right" style={{ bottom: '80px', right: '40px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#3b82f6' }}>
                        verified_user
                    </span>
                </div>
            </div>

            <p className="verify-visual-text">
                Secure your account. Verify your identity. Join Thozhil.
            </p>
        </div>
    );
};

export default VerifyEmailVisualSide;
