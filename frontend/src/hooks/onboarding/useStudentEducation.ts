import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

/**
 * Form data for the student education step.
 */
export interface StudentEducationData {
    collegeName: string;
    degree: string;
    specialization: string;
    graduationYear: number | ""; // empty string while editing
}

export function useStudentEducation() {
    const { refreshAuth } = useAuth();
    const [formData, setFormData] = useState<StudentEducationData>({
        collegeName: "",
        degree: "",
        specialization: "",
        graduationYear: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = useCallback(
        (field: keyof StudentEducationData, value: string) => {
            // Convert graduationYear to number if possible
            if (field === "graduationYear") {
                const num = Number(value);
                setFormData(prev => ({
                    ...prev,
                    graduationYear: isNaN(num) ? "" : num
                }));
            } else {
                setFormData(prev => ({ ...prev, [field]: value }));
            }
            setError(null);
        },
        []
    );

    const handleSubmit = useCallback(async () => {
        // Basic validation
        if (!formData.collegeName.trim() || !formData.degree.trim()) {
            setError("College name and degree are required");
            return;
        }
        if (!formData.graduationYear || typeof formData.graduationYear !== "number") {
            setError("Valid graduation year is required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await onboardingApi.saveStudentEducation({
                collegeName: formData.collegeName,
                degree: formData.degree,
                specialization: formData.specialization,
                graduationYear: formData.graduationYear as number
            });

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save education details";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, refreshAuth]);

    const canContinue =
        !!formData.collegeName.trim() &&
        !!formData.degree.trim() &&
        typeof formData.graduationYear === "number" &&
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
