import { useNavigate } from "react-router-dom";
import { useSkillsForm } from "@/hooks/onboarding/student/useSkillsForm";
import SkillsVisuals from "@/components/onboarding/student/SkillsVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function SkillsPage() {
    const navigate = useNavigate();
    const {
        selectedSkills,
        toggleSkill,
        handleSubmit,
        isSubmitting,
        error,
        canContinue,
        searchQuery,
        setSearchQuery,
        categories
    } = useSkillsForm(() => {
        navigate(ONBOARDING_ROUTES.STUDENT_LOCATION);
    });

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.STUDENT_EDUCATION);
    };

    return (
        <SkillsVisuals
            selectedSkills={selectedSkills}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSkill={toggleSkill}
            onContinue={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            error={error}
            canContinue={canContinue}
            currentStep={2}
            totalSteps={4}
            categories={categories}
        />
    );
}
