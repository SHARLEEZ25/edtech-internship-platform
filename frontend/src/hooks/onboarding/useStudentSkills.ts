import { useState, useCallback } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export function useStudentSkills() {
    const { refreshAuth } = useAuth();
    const [skills, setSkills] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleSkill = useCallback((skill: string) => {
        setSkills(prev => {
            if (prev.includes(skill)) {
                return prev.filter(s => s !== skill);
            } else {
                return [...prev, skill];
            }
        });
        setError(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (skills.length === 0) {
            setError("Please select at least one skill");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await onboardingApi.saveStudentSkills({ skills });

            await refreshAuth();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save skills";
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [skills, refreshAuth]);

    const canContinue = skills.length > 0 && !isSubmitting;

    return {
        skills,
        toggleSkill,
        handleSubmit,
        isSubmitting,
        error,
        canContinue
    };
}
