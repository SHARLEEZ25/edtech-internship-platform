
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOnboardingRedirect } from "@/hooks/useOnboardingRedirect";

const GoogleCallback = () => {
    const { refreshAuth, user, authLoaded } = useAuth();
    const navigate = useNavigate();
    const { handleRedirect } = useOnboardingRedirect();

    // Step 1: fetch logged-in user from backend (auth/me)
    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    // Step 2: once user is loaded, decide where to go
    useEffect(() => {
        if (!authLoaded) return;

        // If no user after loading, redirect to login
        if (!user) {
            navigate("/login");
            return;
        }

        // Use the centralized redirect logic
        handleRedirect(user, navigate);

    }, [user, authLoaded, navigate, handleRedirect]);

    return (
        <div className="auth-loading">
            Signing you in with Google...
        </div>
    );
};

export default GoogleCallback;
