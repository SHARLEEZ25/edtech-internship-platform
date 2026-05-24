import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruiterDescription, type RecruiterDescriptionData } from "@/hooks/onboarding/recruiter/useRecruiterDescription";
import DescriptionVisuals from "@/components/onboarding/recruiter/DescriptionVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function DescriptionPage() {
    const navigate = useNavigate();
    const { formData, updateField, handleSubmit, isSubmitting, error, canContinue } = useRecruiterDescription();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleContinue = async () => {
        try {
            await handleSubmit();
            setIsNavigating(true);
            navigate(ONBOARDING_ROUTES.RECRUITER_FINAL);
        } catch (e) {
            setIsNavigating(false);
        }
    };

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.RECRUITER_COMPANY);
    };

    return (
        <DescriptionVisuals
            data={formData}
            onUpdateField={(field: keyof RecruiterDescriptionData, value: string) => updateField(field, value)}
            onContinue={handleContinue}
            onBack={handleBack}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
            currentStep={3}
            totalSteps={4}
        />
    );
}
