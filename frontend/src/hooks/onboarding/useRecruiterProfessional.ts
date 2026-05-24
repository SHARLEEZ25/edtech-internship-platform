import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export function useRecruiterProfessional() {
    const { refreshAuth } = useAuth();
    const [professionalTitle, setProfessionalTitle] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!professionalTitle.trim()) {
            setError("Professional title is required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await onboardingApi.saveRecruiterProfessional({
                professionalTitle
            });

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save professional details";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [professionalTitle, refreshAuth]);

    return {
        professionalTitle,
        setProfessionalTitle,
        companyEmail,
        setCompanyEmail,
        handleSubmit,
        isSubmitting,
        error,
        canContinue: !!professionalTitle && professionalTitle.trim().length > 0
    };
}
