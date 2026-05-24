// src/routes/PublicRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOnboardingRedirect } from "@/hooks/useOnboardingRedirect";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import GoogleCallback from "@/pages/auth/GoogleCallback";

export default function PublicRoutes() {
    const { user, isAuthenticated, authLoaded } = useAuth();
    const { getRedirect } = useOnboardingRedirect();

    if (authLoaded && isAuthenticated && user) {
        return <Navigate to={getRedirect(user)} replace />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
        </Routes>
    );
}
