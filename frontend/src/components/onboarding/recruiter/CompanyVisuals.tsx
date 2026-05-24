// Component: CompanyVisuals
// Purpose: UI for Recruiter Company Details step (Step 2 of 4)
import "@/styles/onboarding/recruiter-company.css";
import type { RecruiterCompanyData } from "@/hooks/onboarding/recruiter/useRecruiterCompany";

interface CompanyVisualsProps {
  data: RecruiterCompanyData;
  onUpdateField: (field: keyof RecruiterCompanyData, value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  canContinue: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
}

const CompanyVisuals = ({
  data,
  onUpdateField,
  onContinue,
  onBack,
  canContinue,
  isSubmitting,
  error,
  currentStep,
  totalSteps,
}: CompanyVisualsProps) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="company-root">
      {/* Fixed Background */}
      <div className="fixed-bg-company"></div>

      <main className="company-main">
        {/* Floating Decorative Elements */}

        {/* Yellow dot - right side */}
        <div className="floating-dot-company dot-yellow-company"></div>

        {/* Pink/Red dot - left side */}
        <div className="floating-dot-company dot-pink-company"></div>

        {/* Green dot - bottom left */}
        <div className="floating-dot-company dot-green-company"></div>

        {/* Top Left Floating Card - Grid/Building Icon */}
        <div className="floating-card-company floating-top-left">
          <div className="floating-card-inner-company purple-theme-company">
            <span className="material-symbols-outlined">grid_view</span>
          </div>
        </div>

        {/* Right Floating Card - Location Pin Icon */}
        <div className="floating-card-company floating-bottom-right">
          <div className="floating-card-inner-company blue-theme-company">
            <span className="material-symbols-outlined">location_on</span>
          </div>
        </div>

        <div className="company-container">
          {/* Segmented Progress Bar Header */}
          <div className="progress-header-company">
            <div className="progress-top-row">
              <span className="step-count-company">STEP {currentStep} OF {totalSteps}</span>
              <span className="progress-percent">{progressPercent}% Completed</span>
            </div>
            <div className="progress-segments">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`progress-segment ${i < currentStep ? 'filled' : ''}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Main Card */}
          <div className="company-card">
            {/* Title Section */}
            <div className="card-top-company">
              <h1>Your company details 🏢</h1>
              <p>
                Tell us a little about where you are hiring. This helps us match you with local candidates.
              </p>
            </div>

            {/* Error Message */}
            {error && <div className="error-message-company">{error}</div>}

            {/* Form Fields */}
            <div className="company-form">
              {/* Company Name Input */}
              <div className="field-group-company">
                <label className="field-label-company">Company Name</label>
                <div className="field-relative-company">
                  <span className="material-symbols-outlined field-icon-company">business</span>
                  <input
                    type="text"
                    className="company-input"
                    placeholder="TechFlow Solutions"
                    value={data.companyName}
                    onChange={(e) => onUpdateField("companyName", e.target.value)}
                  />
                </div>
              </div>

              {/* City & State Row */}
              <div className="flex-row-fields-company">
                {/* City Input */}
                <div className="field-group-company">
                  <label className="field-label-company">City</label>
                  <div className="field-relative-company">
                    <span className="material-symbols-outlined field-icon-company">location_city</span>
                    <input
                      type="text"
                      className="company-input"
                      placeholder="e.g. San Francisco"
                      value={data.city}
                      onChange={(e) => onUpdateField("city", e.target.value)}
                    />
                  </div>
                </div>

                {/* State/Region Input */}
                <div className="field-group-company">
                  <label className="field-label-company">State / Region</label>
                  <div className="field-relative-company">
                    <span className="material-symbols-outlined field-icon-company">map</span>
                    <input
                      type="text"
                      className="company-input"
                      placeholder="e.g. California"
                      value={data.state}
                      onChange={(e) => onUpdateField("state", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="map-preview-company">
                <div className="map-bg-company"></div>
                <div className="map-city-label">
                  {data.city || 'San Francisco'}
                </div>
                <div className="map-overlay-company">
                  <p className="map-info-company">
                    <span className="material-symbols-outlined">info</span>
                    Map preview will update based on your input
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="company-footer">
              <button
                className="back-action-company"
                onClick={onBack}
                type="button"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
              <button
                className="next-btn-company"
                onClick={onContinue}
                disabled={!canContinue || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Next Step"}
                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </div>

          {/* Help Link */}
          <div className="why-help-company">
            <a className="why-link-company" href="#">Why do we need this info?</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyVisuals;
