import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export interface RecruiterDescriptionData {
    companyDescription: string;
    companyWebsite?: string;
}

export function useRecruiterDescription() {
    const { refreshAuth } = useAuth();
    const [formData, setFormData] = useState<RecruiterDescriptionData>({
        companyDescription: "",
        companyWebsite: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = useCallback((field: keyof RecruiterDescriptionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formData.companyDescription.trim()) {
            setError("Description is required");
            return;
        }

        if (formData.companyDescription.length < 10) {
            setError("Description must be at least 10 characters long");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await onboardingApi.saveRecruiterDescription({
                companyDescription: formData.companyDescription,
                companyWebsite: formData.companyWebsite
            });

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save description";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, refreshAuth]);

    const canContinue =
        formData.companyDescription.trim().length >= 10 &&
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
