import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOnboardingRedirectPath } from "../hooks/useOnboardingRedirect";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                Loading...
            </div>
        );
    }

    // Redirect to login if not authenticated
    // Note: VITE_BYPASS_GUARDS=true in .env will disable this check for development
    const bypassAuth = import.meta.env.VITE_BYPASS_GUARDS === "true";

    if (!user && !bypassAuth) {
        return <Navigate to="/login" replace />;
    }

    // Verify onboarding completion
    const correctPath = getOnboardingRedirectPath(user);
    if (correctPath !== "/dashboard" && !bypassAuth) {
        console.log(`[ProtectedRoute] Bypassing dashboard entry - redirecting to ${correctPath}`);
        return <Navigate to={correctPath} replace />;
    }

    // Render protected content if authenticated
    return <>{children}</>;
}
