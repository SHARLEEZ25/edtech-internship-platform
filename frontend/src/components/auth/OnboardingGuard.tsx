
import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getOnboardingRedirectPath } from "@/hooks/useOnboardingRedirect";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

import { LoadingState } from "../common/LoadingState";

// 🔧 DEV MODE: Set to true to bypass onboarding guards for design/testing
const DEV_BYPASS_ONBOARDING_GUARD = true;

/**
 * Guard to prevent users from accessing incorrect onboarding steps.
 */
const OnboardingGuard = () => {
    const { user, authLoaded } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 🔧 DEV BYPASS: Skip all redirects when in dev mode
        if (DEV_BYPASS_ONBOARDING_GUARD) {
            console.log('[OnboardingGuard] DEV MODE - bypassing guards');
            return;
        }

        if (!authLoaded) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        const currentPath = location.pathname;
        const correctPath = getOnboardingRedirectPath(user);

        // 1. Allow access if they are on the correct path
        if (currentPath === correctPath) return;

        // 2. Allow access to Role Selection if they have no role
        // (This is implicitly handled by getOnboardingRedirectPath returning ROLE_SELECTION, so logic holds)

        // 3. Special Case: If they are on Role Selection page but HAVE a role, kick them to correct path
        if (currentPath === ONBOARDING_ROUTES.ROLE_SELECTION && user.role) {
            navigate(correctPath, { replace: true });
            return;
        }

        // 4. If they are trying to access a sub-route (e.g. /onboarding/recruiter/company)
        // but the Guard says they should be elsewhere (e.g. /onboarding/student/education), redirect them.
        // NOTE: This prevents cross-role access AND step-jumping.
        // However, we must ensure 'correctPath' is not too aggressive.
        // For example, if correctPath is /onboarding/student/skills, they should NOT be able to visit /onboarding/student/education?
        // STRICT MODE: Yes, force them to the current step.

        // Check if we are diverging from the "correct" path.
        // We ignore trailing slashes for safety
        const cleanCurrent = currentPath.replace(/\/$/, "");
        const cleanCorrect = correctPath.replace(/\/$/, "");

        if (cleanCurrent !== cleanCorrect) {
            // We allow them to view the generic /onboarding page IF they have no role.
            // But getOnboardingRedirectPath already handles that.

            console.log(`[OnboardingGuard] Redirecting from ${cleanCurrent} to ${cleanCorrect}`);
            navigate(correctPath, { replace: true });
        }

    }, [user, authLoaded, navigate, location]);

    if (!authLoaded && !DEV_BYPASS_ONBOARDING_GUARD) {
        return <LoadingState fullPage />;
    }

    return <Outlet />;
};

export default OnboardingGuard;
