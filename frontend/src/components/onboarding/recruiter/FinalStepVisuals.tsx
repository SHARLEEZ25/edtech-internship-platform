// Component: FinalStepVisuals
// Purpose: UI for Recruiter Company Description step (Step 4 of 4 - Final)
import "@/styles/onboarding/recruiter-final.css";

interface FinalStepVisualsProps {
    companyDescription: string;
    onUpdateDescription: (value: string) => void;
    onContinue: () => void;
    onBack?: () => void;
    canContinue: boolean;
    isSubmitting: boolean;
    error: string | null;
    currentStep: number;
    totalSteps: number;
    charCount: number;
}

const FinalStepVisuals = ({
    companyDescription,
    onUpdateDescription,
    onContinue,
    onBack,
    canContinue,
    isSubmitting,
    error,
    currentStep,
    totalSteps,
    charCount,
}: FinalStepVisualsProps) => {
    return (
        <div className="final-root">
            {/* Fixed Background */}
            <div className="fixed-bg-final"></div>

            <main className="final-main">
                {/* Floating Decorative Elements */}

                {/* Left Floating Card - Document Icon (Teal) */}
                <div className="floating-card-final floating-left-final">
                    <div className="floating-card-inner-final teal-theme-final">
                        <span className="material-symbols-outlined">description</span>
                    </div>
                </div>

                {/* Right Floating Card - Star Icon (Orange) */}
                <div className="floating-card-final floating-right-final">
                    <div className="floating-card-inner-final orange-theme-final">
                        <span className="material-symbols-outlined">star</span>
                    </div>
                </div>

                <div className="final-container">
                    {/* Segmented Progress Bar */}
                    <div className="progress-header-final">
                        <div className="progress-top-row-final">
                            <span className="step-count-final">Step {currentStep} of {totalSteps}</span>
                            <span className="profile-tag-final">COMPANY PROFILE</span>
                        </div>
                        <div className="progress-segments-final">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div
                                    key={i}
                                    className={`progress-segment-final ${i < currentStep ? 'filled' : ''}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="final-card">
                        {/* Title Section */}
                        <div className="card-top-final">
                            <h1>Describe your company 📝</h1>
                            <p>
                                Tell candidates what makes your company great. This is your chance to shine!
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && <div className="error-message-final">{error}</div>}

                        {/* Form Fields */}
                        <div className="final-form">
                            {/* Company Description Textarea */}
                            <div className="field-group-final">
                                <label className="field-label-final">Company Description</label>
                                <div className="textarea-wrapper-final">
                                    <textarea
                                        className="final-textarea"
                                        placeholder="We are a technology company focused on building the future of..."
                                        value={companyDescription}
                                        onChange={(e) => onUpdateDescription(e.target.value)}
                                        maxLength={500}
                                    />
                                    <span className="char-count-final">{charCount}/500</span>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="info-box-final">
                                <span className="material-symbols-outlined info-icon-final">info</span>
                                <p>This description will appear on your public profile. Keep it between 50-200 words for best engagement.</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="final-footer">
                            <button
                                className="back-action-final"
                                onClick={onBack}
                                type="button"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back
                            </button>
                            <button
                                className="complete-btn-final"
                                onClick={onContinue}
                                disabled={!canContinue || isSubmitting}
                            >
                                {isSubmitting ? "Completing..." : "Complete Setup"}
                                {!isSubmitting && <span className="material-symbols-outlined">check_circle</span>}
                            </button>
                        </div>

                        {/* Ready Text */}
                        <p className="ready-text-final">You're ready to start hiring smarter.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FinalStepVisuals;
