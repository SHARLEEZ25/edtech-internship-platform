import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentLocation } from "@/hooks/onboarding/student/useStudentLocation";
import LocationVisuals from "@/components/onboarding/student/LocationVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function LocationPage() {
    const navigate = useNavigate();
    const { formData, updateField, handleSubmit, isSubmitting, error, canContinue } = useStudentLocation();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleContinue = async () => {
        try {
            await handleSubmit();
            setIsNavigating(true);
            navigate(ONBOARDING_ROUTES.COMPLETED);
        } catch (e) {
            setIsNavigating(false);
        }
    };

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.STUDENT_SKILLS);
    };

    return (
        <LocationVisuals
            data={formData}
            onUpdateField={updateField}
            onContinue={handleContinue}
            onBack={handleBack}
            currentStep={3}
            totalSteps={4}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
        />
    );
}
