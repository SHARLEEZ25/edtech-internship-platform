import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

// 🔧 DEV MODE: Set to true to skip API calls for testing
const DEV_MOCK_MODE = false;

/**
 * Purpose: "Recruiter Final Step Manager"
 * - Manages the form state for Company Description.
 * - Step 4 (final) of recruiter onboarding.
 * 
 * Used in:
 * - FinalStepPage.tsx
 * - FinalStepVisuals.tsx
 */
export function useRecruiterFinalStep() {
    const { refreshAuth } = useAuth();
    const [companyDescription, setCompanyDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!companyDescription.trim()) {
            setError("Company description is required");
            return;
        }

        if (companyDescription.length < 10) {
            setError("Description must be at least 10 characters");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // 🔧 DEV MODE: Skip API call
            if (DEV_MOCK_MODE) {
                console.log('[DEV MODE] Skipping API call for final step');
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                await onboardingApi.saveRecruiterDescription({
                    companyDescription
                });
                await refreshAuth();
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to complete setup";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [companyDescription, refreshAuth]);

    const canContinue = companyDescription.trim().length >= 10;

    return {
        companyDescription,
        setCompanyDescription,
        handleSubmit,
        isSubmitting,
        error,
        canContinue,
        charCount: companyDescription.length
    };
}
