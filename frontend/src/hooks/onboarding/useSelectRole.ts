
import { useState, useCallback } from "react";
import { onboardingApi, type BackendRole } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export function useSelectRole() {
    const { refreshAuth } = useAuth();
    const [role, setRole] = useState<BackendRole | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitRole = useCallback(async (selectedRole: BackendRole) => {
        try {
            setIsSubmitting(true);
            setError(null);

            let res;
            try {
                res = await onboardingApi.selectRole(selectedRole);
            } catch (apiErr: any) {
                // If 409 Conflict, it means role is already selected. 
                // We should treat this as success and proceed to fresh auth.
                if (apiErr.response?.status === 409) {
                    console.warn("Role already selected (409). Proceeding as success.");
                    // We fake a success response or just rely on refreshAuth
                    res = { data: { nextStep: "UNKNOWN" } }; // nextStep not strictly needed if we rely on user.role
                } else {
                    throw apiErr;
                }
            }

            // Refresh auth to sync role and next onboarding step
            await refreshAuth();
            return res.data;
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to select role";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshAuth]);

    return {
        role,
        setRole,
        submitRole,
        isSubmitting,
        error,
        canContinue: !!role,
    };
}
