import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruiterFinalStep } from "@/hooks/onboarding/recruiter/useRecruiterFinalStep";
import FinalStepVisuals from "@/components/onboarding/recruiter/FinalStepVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function FinalStepPage() {
    const navigate = useNavigate();
    const {
        companyDescription,
        setCompanyDescription,
        handleSubmit,
        isSubmitting,
        error,
        canContinue,
        charCount
    } = useRecruiterFinalStep();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleComplete = async () => {
        try {
            await handleSubmit();
            setIsNavigating(true);
            navigate(ONBOARDING_ROUTES.COMPLETED);
        } catch (e) {
            setIsNavigating(false);
        }
    };

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.RECRUITER_DESCRIPTION);
    };

    return (
        <FinalStepVisuals
            companyDescription={companyDescription}
            onUpdateDescription={setCompanyDescription}
            onContinue={handleComplete}
            onBack={handleBack}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
            currentStep={4}
            totalSteps={4}
            charCount={charCount}
        />
    );
}
