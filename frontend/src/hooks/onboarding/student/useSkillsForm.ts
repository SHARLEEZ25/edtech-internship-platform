import { useState } from "react";
import { onboardingApi } from "@/api/onboarding.api";
import { useAuth } from "@/context/AuthContext";

export interface SkillCategory {
    id: string;
    label: string;
    icon: string;
    color: string;
    skills: string[];
}

export const SUGGESTED_CATEGORIES: SkillCategory[] = [
    {
        id: "trending",
        label: "Trending Now",
        icon: "trending_up",
        color: "#e64980", // pink
        skills: ["UI/UX Design", "Python", "Digital Marketing", "React Native"]
    },
    {
        id: "tech",
        label: "Tech & Development",
        icon: "terminal",
        color: "#228be6", // blue
        skills: ["JavaScript", "Machine Learning", "Cybersecurity", "DevOps", "Java", "C++", "AWS"]
    },
    {
        id: "soft",
        label: "Soft Skills",
        icon: "diversity_3",
        color: "#fab005", // yellow
        skills: ["Public Speaking", "Leadership", "Critical Thinking", "Team Management"]
    }
];

export const useSkillsForm = (onSuccess?: () => void) => {
    const { refreshAuth } = useAuth();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
        if (error) setError(null);
    };

    const canContinue = selectedSkills.length >= 3;

    const handleSubmit = async () => {
        if (!canContinue) {
            setError("Please select at least 3 skills to continue.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onboardingApi.saveStudentSkills({ skills: selectedSkills });
            await refreshAuth();

            if (onSuccess) onSuccess();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to save skills. Please try again.";
            setError(msg);
            console.error("Skills submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedSkills,
        searchQuery,
        setSearchQuery,
        toggleSkill,
        canContinue,
        isSubmitting,
        error,
        handleSubmit,
        categories: SUGGESTED_CATEGORIES
    };
};
