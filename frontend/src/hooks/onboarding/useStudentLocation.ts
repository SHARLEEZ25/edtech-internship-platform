import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export interface StudentLocationData {
    city: string;
    state: string;
}

export function useStudentLocation() {
    const { refreshAuth } = useAuth();
    const [formData, setFormData] = useState<StudentLocationData>({
        city: "",
        state: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = useCallback(
        (field: keyof StudentLocationData, value: string) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            setError(null);
        },
        []
    );

    const handleSubmit = useCallback(async () => {
        if (!formData.city.trim() || !formData.state.trim()) {
            setError("City and state are required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await onboardingApi.saveStudentLocation({
                city: formData.city,
                state: formData.state
            });

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save location";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, refreshAuth]);

    const canContinue =
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
