
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelectRole } from "@/hooks/onboarding/useSelectRole";
import RoleSelectionVisuals from "@/components/onboarding/role-selection/RoleSelectionVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/utils/constants";

export default function RoleSelectionPage() {
    const navigate = useNavigate();
    const { role, setRole, submitRole, isSubmitting, error, canContinue } = useSelectRole();
    const [isNavigating, setIsNavigating] = useState(false);
    const { user } = useAuth();

    // FAILSAFE: If the user context updates and shows they have a role, AUTO-NAVIGATE.
    // This helps if the submit succeeds but the imperative navigate() fails or gets reverted by guards.
    // IMPORTANT: We only trigger this if we are currently ON the role selection page.
    useEffect(() => {
        if (user?.role && !isSubmitting) {
            const targetPath = user.role === ROLES.STUDENT
                ? ONBOARDING_ROUTES.STUDENT_EDUCATION
                : ONBOARDING_ROUTES.RECRUITER_PROFESSIONAL;

            // Use replace to prevent back-button loops
            navigate(targetPath, { replace: true });
        }
    }, [user, navigate, isSubmitting]);


    const handleContinue = async () => {
        if (!role) return;
        try {
            // Lock UI immediately
            setIsNavigating(true);

            await submitRole(role);

            // We TRUST the useEffect above to handle the actual navigation.
            // But we add a small timeout to ensure state updates propagate if the effect is slow.
            // This is largely redundant due to the useEffect but safe.
            setTimeout(() => {
                const targetPath = role === ROLES.STUDENT
                    ? ONBOARDING_ROUTES.STUDENT_EDUCATION
                    : ONBOARDING_ROUTES.RECRUITER_PROFESSIONAL;
                navigate(targetPath, { replace: true });
            }, 100);

        } catch (e) {
            setIsNavigating(false);
        }
    };

    return (
        <RoleSelectionVisuals
            selectedRole={role}
            onSelect={setRole}
            onContinue={handleContinue}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
        />
    );
}
