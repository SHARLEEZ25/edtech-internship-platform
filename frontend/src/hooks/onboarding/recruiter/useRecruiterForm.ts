import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Data structure for the recruiter identity step.
 * These fields match what is displayed in IdentityVisuals.tsx.
 */
export interface RecruiterIdentityData {
    fullName: string;
    companyEmail: string;
}

/**
 * Hook to manage recruiter identity form state and submission.
 */
export function useRecruiterForm() {
    const { user, refreshAuth } = useAuth();

    // Initialize with existing user data if available
    const [formData, setFormData] = useState<RecruiterIdentityData>({
        fullName: user?.fullName || "",
        companyEmail: user?.email || ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = useCallback((field: keyof RecruiterIdentityData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formData.fullName.trim() || !formData.companyEmail.trim()) {
            setError("Full name and company email are required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // Note: If a specific onboarding API for identity is needed, it should be called here.
            // For now, we assume this is handled or will be implemented in onboardingApi.

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save identity details";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, refreshAuth]);

    const canContinue =
        !!formData.fullName.trim() &&
        !!formData.companyEmail.trim() &&
        !isSubmitting;

    return {
        formData,
        updateField,
        handleSubmit,
        isSubmitting,
        error,
        canContinue
    };
}
