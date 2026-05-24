// ============================================
// IMPORTS
// ============================================
// React hooks
import { useState } from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Layout & Components
import AuthLayout from "../AuthLayout";
import { LoginFormSide, LoginVisualSide } from "./LoginVisual";

// API & Context
import { login, getMe } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";
import { useOnboardingRedirect } from "@/hooks/useOnboardingRedirect";


// ============================================
// COMPONENT DEFINITION
// ============================================
const LoginForm = () => {
  // ============================================
  // HOOKS
  // ============================================
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { handleRedirect } = useOnboardingRedirect();

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {


      // 1️⃣ Login → sets cookies
      await login({
        email: email.trim(),
        password,
      });

      // 2️⃣ Fetch current user
      const meRes = await getMe();

      // 3️⃣ Store user in context
      const raw = meRes.data;
      const normalizedUser = {
        ...raw,
        fullName: raw.fullName || raw.full_name,
        onboardingCompleted:
          raw.isOnboarded ??
          raw.onboardingCompleted ??
          raw.onboarding_completed ??
          raw.is_onboarding_completed ??
          false,
        onboardingStep: raw.onboardingStep || raw.onboarding_step,
      };

      setUser(normalizedUser);

      // 4️⃣ Intelligent Redirect
      handleRedirect(normalizedUser, navigate);
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("credentials")) {
        setError("Invalid email or password");
      } else if (msg.includes("Internal Server Error") || msg === "") {
        setError("Something went wrong. Please try again later.");
      } else {
        setError(msg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };


  // ============================================
  // JSX RENDERING
  // ============================================
  return (
    <AuthLayout visual={<LoginVisualSide />}>
      <LoginFormSide
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        error={error}
        handleSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};


export default LoginForm;
