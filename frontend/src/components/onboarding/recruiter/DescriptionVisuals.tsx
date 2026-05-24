// Component: DescriptionVisuals
// Purpose: UI for Recruiter Company Online Presence step (Step 3 of 4)
import "@/styles/onboarding/recruiter-description.css";
import type { RecruiterDescriptionData } from "@/hooks/onboarding/recruiter/useRecruiterDescription";

interface DescriptionVisualsProps {
  data: RecruiterDescriptionData;
  onUpdateField: (field: keyof RecruiterDescriptionData, value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  canContinue: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
}

const DescriptionVisuals = ({
  data,
  onUpdateField,
  onContinue,
  onBack,
  canContinue,
  isSubmitting,
  error,
  currentStep,
  totalSteps,
}: DescriptionVisualsProps) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="presence-root">
      {/* Fixed Background */}
      <div className="fixed-bg-presence"></div>

      <main className="presence-main">
        {/* Floating Decorative Elements */}

        {/* Yellow dot - right side */}
        <div className="floating-dot-presence dot-yellow-presence"></div>

        {/* Blue dot - bottom left */}
        <div className="floating-dot-presence dot-blue-presence"></div>

        {/* Top Left Floating Card - Globe Icon (Teal) */}
        <div className="floating-card-presence floating-top-left-presence">
          <div className="floating-card-inner-presence teal-theme">
            <span className="material-symbols-outlined">public</span>
          </div>
        </div>

        {/* Bottom Right Floating Card - Link Icon (Purple) */}
        <div className="floating-card-presence floating-bottom-right-presence">
          <div className="floating-card-inner-presence purple-theme-presence">
            <span className="material-symbols-outlined">link</span>
          </div>
        </div>

        <div className="presence-container">
          {/* Segmented Progress Bar */}
          <div className="progress-header-presence">
            <div className="progress-top-row-presence">
              <span className="step-count-presence">STEP {currentStep} OF {totalSteps}</span>
              <span className="progress-percent-presence">{progressPercent}% Completed</span>
            </div>
            <div className="progress-segments-presence">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`progress-segment-presence ${i < currentStep ? 'filled' : ''}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Main Card */}
          <div className="presence-card">
            {/* Title Section */}
            <div className="card-top-presence">
              <h1>Company online presence 🌐</h1>
              <p>
                Add your company website to showcase your brand to potential interns. This helps candidates learn more about your culture.
              </p>
            </div>

            {/* Error Message */}
            {error && <div className="error-message-presence">{error}</div>}

            {/* Form Fields */}
            <div className="presence-form">
              {/* Company Website Input */}
              <div className="field-group-presence">
                <label className="field-label-presence">
                  Company Website <span className="optional-tag">(Optional)</span>
                </label>
                <div className="field-relative-presence">
                  <span className="material-symbols-outlined field-icon-presence">language</span>
                  <input
                    type="url"
                    className="presence-input"
                    placeholder="https://www.yourcompany.com"
                    value={data.companyWebsite || ''}
                    onChange={(e) => onUpdateField("companyWebsite", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="presence-footer">
              <button
                className="back-action-presence"
                onClick={onBack}
                type="button"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
              <button
                className="next-btn-presence"
                onClick={onContinue}
                disabled={!canContinue || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Next Step"}
                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DescriptionVisuals;
