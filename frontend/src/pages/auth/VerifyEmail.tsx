import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification } from "@/api/auth.api";
import AuthLayout from "@/components/auth/AuthLayout";
import { VerifyEmailFormSide, VerifyEmailVisualSide } from "@/components/auth/verify-email/VerifyEmailVisual";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // email passed from register page
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);

    // Timer countdown effect
    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    if (!email) {
        // Fallback for direct access
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '18px', color: '#64748b' }}>Invalid access. Please register again.</p>
                <button
                    onClick={() => navigate('/signup')}
                    style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Go to Signup
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            await verifyEmail({
                email,
                otp,
            });

            // Email verified
            navigate("/login");
        } catch (err: any) {
            const msg = err.response?.data?.message || "";
            if (msg.includes("Internal Server Error") || msg === "") {
                setError("Invalid or expired OTP. Please try again or resend a new one.");
            } else {
                setError(msg || "Verification failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0 || loading) return;

        setError(null);
        setSuccessMessage(null);

        try {
            const res = await resendVerification(email);
            setSuccessMessage(res.data.message || "Verification code resent");
            setTimer(60); // Start 60s cooldown
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to resend code";
            // If rate limited, extract time from message if possible, or just show message
            setError(msg);

            // Optional: If backend sends 429, we could sync timer, but for now just showing error is fine
        }
    };

    return (
        <AuthLayout visual={<VerifyEmailVisualSide />}>
            <VerifyEmailFormSide
                email={email}
                otp={otp}
                setOtp={setOtp}
                loading={loading}
                error={error}
                successMessage={successMessage}
                handleSubmit={handleSubmit}
                onResend={handleResend}
                timer={timer}
                isResendDisabled={timer > 0 || loading}
            />
        </AuthLayout>
    );
};

export default VerifyEmail;
