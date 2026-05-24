import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruiterCompany } from "@/hooks/onboarding/recruiter/useRecruiterCompany";
import CompanyVisuals from "@/components/onboarding/recruiter/CompanyVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function CompanyPage() {
    const navigate = useNavigate();
    const { formData, updateField, handleSubmit, isSubmitting, error, canContinue } = useRecruiterCompany();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleContinue = async () => {
        try {
            await handleSubmit();
            setIsNavigating(true);
            navigate(ONBOARDING_ROUTES.RECRUITER_DESCRIPTION);
        } catch (e) {
            setIsNavigating(false);
        }
    };

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.RECRUITER_PROFESSIONAL);
    };

    return (
        <CompanyVisuals
            data={formData}
            onUpdateField={updateField}
            onContinue={handleContinue}
            onBack={handleBack}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
            currentStep={2}
            totalSteps={4}
        />
    );
}
