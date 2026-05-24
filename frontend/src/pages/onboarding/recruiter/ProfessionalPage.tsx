import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruiterProfessional } from "@/hooks/onboarding/recruiter/useRecruiterProfessional";
import ProfessionalVisuals from "@/components/onboarding/recruiter/ProfessionalVisuals";
import { ONBOARDING_ROUTES } from "@/routes/onboardingRouteMap";

export default function ProfessionalPage() {
    const navigate = useNavigate();
    const {
        professionalTitle,
        setProfessionalTitle,
        companyEmail,
        setCompanyEmail,
        handleSubmit,
        isSubmitting,
        error,
        canContinue
    } = useRecruiterProfessional();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleContinue = async () => {
        try {
            await handleSubmit();
            setIsNavigating(true);
            navigate(ONBOARDING_ROUTES.RECRUITER_COMPANY);
        } catch (e) {
            setIsNavigating(false);
        }
    };

    const handleBack = () => {
        navigate(ONBOARDING_ROUTES.ROLE_SELECTION);
    };

    return (
        <ProfessionalVisuals
            professionalTitle={professionalTitle}
            companyEmail={companyEmail}
            onUpdateTitle={setProfessionalTitle}
            onUpdateEmail={setCompanyEmail}
            onContinue={handleContinue}
            onBack={handleBack}
            isSubmitting={isSubmitting || isNavigating}
            error={error}
            canContinue={canContinue}
            currentStep={1}
            totalSteps={4}
        />
    );
}
