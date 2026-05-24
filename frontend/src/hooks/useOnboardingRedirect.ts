
import { type AuthUser } from "@/context/AuthContext";
import { ONBOARDING_ROUTES, getOnboardingPath } from "@/routes/onboardingRouteMap";
import type { NavigateFunction } from "react-router-dom";

/**
 * Determines the correct path a user should be on based on their onboarding state.
 */
export const getOnboardingRedirectPath = (user: AuthUser | null): string => {
    if (!user) return "/login";

    // 1. If onboarding is completed, they go to dashboard
    if (user.onboardingCompleted) {
        return "/dashboard";
    }

    // 2. If no role, they must select one.
    if (!user.role) {
        return ONBOARDING_ROUTES.ROLE_SELECTION;
    }

    // 3. Otherwise, send them to their specific onboarding step
    return getOnboardingPath(user.onboardingStep);
};

/**
 * Reusable hook/helper to handle the navigation logic.
 * Can be used in Login, GoogleCallback, and Guards.
 */
export const useOnboardingRedirect = () => {
    const getRedirect = (user: AuthUser | null) => {
        return getOnboardingRedirectPath(user);
    };

    const handleRedirect = (user: AuthUser | null, navigate: NavigateFunction) => {
        const path = getRedirect(user);
        navigate(path, { replace: true });
    };

    return { getRedirect, handleRedirect };
};
