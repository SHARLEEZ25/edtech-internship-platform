// Component: ProfessionalVisuals
// Purpose: UI for Recruiter Identity step (Step 1 of 4) - Recruiter Name & Company Email
import "@/styles/onboarding/recruiter-identity.css";
import { Link } from "react-router-dom";

interface ProfessionalVisualsProps {
    professionalTitle: string;
    companyEmail: string;
    onUpdateTitle: (title: string) => void;
    onUpdateEmail: (email: string) => void;
    onContinue: () => void;
    onBack?: () => void;
    canContinue: boolean;
    isSubmitting: boolean;
    error: string | null;
    currentStep: number;
    totalSteps: number;
}

const ProfessionalVisuals = ({
    professionalTitle = '',
    companyEmail = '',
    onUpdateTitle,
    onUpdateEmail,
    onContinue,
    onBack,
    canContinue,
    isSubmitting,
    error,
    currentStep,
    totalSteps
}: ProfessionalVisualsProps) => {
    const stepLabels = ['Identity', 'Company', 'Description', 'Complete'];
    const currentLabel = stepLabels[currentStep - 1] || 'Identity';

    return (
        <div className="rec-root">
            {/* Fixed Background */}
            <div className="fixed-bg"></div>

            {/* Header with Login Link */}
            <header className="rec-header-nav">
                <div className="login-prompt">
                    <span>Already have an account?</span>
                    <Link to="/login" className="login-link">Log in</Link>
                </div>
            </header>

            <main className="rec-main">
                {/* Floating Decorative Elements */}

                {/* Yellow Dot - Top Right */}
                <div className="floating-dot dot-yellow"></div>

                {/* Blue Dot - Bottom Left */}
                <div className="floating-dot dot-blue"></div>

                {/* Left Floating Card - Person Icon */}
                <div className="floating-card floating-left">
                    <div className="floating-card-inner purple-theme">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                </div>

                {/* Right Floating Card - Checkmark Icon */}
                <div className="floating-card floating-right">
                    <div className="floating-card-inner blue-theme">
                        <span className="material-symbols-outlined">mark_email_read</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="rec-card">
                    {/* Progress Section */}
                    <div className="rec-card-header">
                        <div className="progress-section">
                            <div className="progress-header">
                                <span className="step-count">STEP {currentStep} OF {totalSteps}</span>
                                <span className="step-label">{currentLabel}</span>
                            </div>
                            <div className="progress-bar-track">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="title-section">
                            <h1>Tell us about you 👤</h1>
                            <p>Let's get your recruiter profile set up so you can start hiring the best talent.</p>
                        </div>
                    </div>

                    <div className="rec-form-body">
                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Professional Title Input */}
                        <div className="input-block">
                            <label htmlFor="professional-title">Professional Title</label>
                            <div className="relative-field">
                                <span className="material-symbols-outlined field-icon">badge</span>
                                <input
                                    id="professional-title"
                                    type="text"
                                    className="rec-input"
                                    placeholder="e.g. HR Manager / Senior Recruiter"
                                    value={professionalTitle}
                                    onChange={(e) => onUpdateTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Company Email Input */}
                        <div className="input-block">
                            <label htmlFor="company-email">Company Email</label>
                            <div className="relative-field">
                                <span className="material-symbols-outlined field-icon">alternate_email</span>
                                <input
                                    id="company-email"
                                    type="email"
                                    className="rec-input"
                                    placeholder="e.g. jane@company.com"
                                    value={companyEmail}
                                    onChange={(e) => onUpdateEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer with Back & Next */}
                    <div className="rec-card-footer">
                        <button
                            className="back-action"
                            onClick={onBack}
                            type="button"
                        >
                            Back
                        </button>
                        <button
                            className="submit-action"
                            onClick={onContinue}
                            disabled={!canContinue || isSubmitting}
                        >
                            <span>{isSubmitting ? "Saving..." : "Next"}</span>
                            {!isSubmitting && <span className="material-symbols-outlined btn-icon">arrow_forward</span>}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfessionalVisuals;
