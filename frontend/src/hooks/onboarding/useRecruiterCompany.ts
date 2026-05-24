import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export interface RecruiterCompanyData {
    companyName: string;
    city: string;
    state: string;
}

export function useRecruiterCompany() {
    const { refreshAuth } = useAuth();
    const [formData, setFormData] = useState<RecruiterCompanyData>({
        companyName: "",
        city: "",
        state: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = useCallback((field: keyof RecruiterCompanyData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formData.companyName.trim() || !formData.city.trim() || !formData.state.trim()) {
            setError("All fields are required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await onboardingApi.saveRecruiterCompany(formData);

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save company details";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, refreshAuth]);

    const canContinue = 
        !!formData.companyName.trim() && 
        !!formData.city.trim() && 
        !!formData.state.trim() && 
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
