import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentEducation } from "@/hooks/onboarding/student/useStudentEducation";
import EducationVisuals from "@/components/onboarding/student/EducationVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function EducationPage() {
    const navigate = useNavigate();
    const { formData, updateField, handleSubmit, isSubmitting, error, canContinue } = useStudentEducation();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleContinue = async () => {
        try {
            await handleSubmit();
            setIsNavigating(true);
            navigate(ONBOARDING_ROUTES.STUDENT_SKILLS);
        } catch (e) {
            setIsNavigating(false);
        }
    };

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.ROLE_SELECTION);
    };

    return (
        <EducationVisuals
            data={formData}
            onUpdateField={updateField}
            onContinue={handleContinue}
            onBack={handleBack}
            currentStep={1}
            totalSteps={4}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
        />
    );
}
