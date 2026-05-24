// Component: LocationVisuals
// Purpose: UI for the Location step in Student Onboarding (Step 3 of 4)
import "@/styles/onboarding/student-location.css";
import type { StudentLocationData as LocationData } from "@/hooks/onboarding/student/useStudentLocation";

interface LocationVisualsProps {
  data: LocationData;
  onUpdateField: (field: keyof LocationData, value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  canContinue: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
}

const LocationVisuals = ({
  data,
  onUpdateField,
  onContinue,
  onBack,
  canContinue,
  isSubmitting,
  error,
  currentStep,
  totalSteps,
}: LocationVisualsProps) => {
  return (
    <div className="sloc-root">
      {/* Fixed Background */}
      <div className="fixed-bg-sloc"></div>

      <main className="sloc-main">
        {/* Floating Decorative Elements */}

        {/* Top Left - Briefcase (Teal) */}
        <div className="floating-card-sloc floating-top-left-sloc">
          <div className="floating-card-inner-sloc teal-theme-sloc">
            <span className="material-symbols-outlined">work</span>
          </div>
        </div>

        {/* Top Right - Graduation Cap (Blue) */}
        <div className="floating-card-sloc floating-top-right-sloc">
          <div className="floating-card-inner-sloc blue-theme-sloc">
            <span className="material-symbols-outlined">school</span>
          </div>
        </div>

        {/* Left Middle - Gear/Settings (Purple) */}
        <div className="floating-card-sloc floating-left-mid-sloc">
          <div className="floating-card-inner-sloc purple-theme-sloc">
            <span className="material-symbols-outlined">settings</span>
          </div>
        </div>

        {/* Bottom Left - Document (Blue outline) */}
        <div className="floating-card-sloc floating-bottom-left-sloc">
          <div className="floating-card-inner-sloc blue-outline-sloc">
            <span className="material-symbols-outlined">description</span>
          </div>
        </div>

        {/* Right Middle - Tag/Diamond (Green) */}
        <div className="floating-card-sloc floating-right-mid-sloc">
          <div className="floating-card-inner-sloc green-theme-sloc">
            <span className="material-symbols-outlined">sell</span>
          </div>
        </div>

        {/* Bottom Right - Location Pin (Pink) */}
        <div className="floating-card-sloc floating-bottom-right-sloc">
          <div className="floating-icon-pin-sloc">
            <span className="material-symbols-outlined">location_on</span>
          </div>
        </div>

        <div className="sloc-container">
          {/* Segmented Progress Bar */}
          <div className="progress-header-sloc">
            <div className="progress-top-row-sloc">
              <span className="step-count-sloc">STEP {currentStep} OF {totalSteps}</span>
            </div>
            <div className="progress-segments-sloc">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`progress-segment-sloc ${i < currentStep ? 'filled' : ''}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Main Card */}
          <div className="sloc-card">
            {/* Title Section */}
            <div className="card-top-sloc">
              <h1>Where are you located? 📍</h1>
              <p>We use this to match you with student-friendly jobs nearby.</p>
            </div>

            {/* Error Message */}
            {error && <div className="error-message-sloc">{error}</div>}

            {/* Form Fields */}
            <div className="sloc-form">
              {/* City Input */}
              <div className="field-group-sloc">
                <label className="field-label-sloc">City</label>
                <div className="field-relative-sloc">
                  <span className="material-symbols-outlined field-icon-sloc">apartment</span>
                  <input
                    type="text"
                    className="sloc-input"
                    placeholder="e.g. Chennai"
                    value={data.city}
                    onChange={(e) => onUpdateField("city", e.target.value)}
                  />
                </div>
              </div>

              {/* State Select */}
              <div className="field-group-sloc">
                <label className="field-label-sloc">State</label>
                <div className="field-relative-sloc">
                  <span className="material-symbols-outlined field-icon-sloc">map</span>
                  <select
                    className="sloc-select"
                    value={data.state}
                    onChange={(e) => onUpdateField("state", e.target.value)}
                  >
                    <option value="">Select State</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="KA">Karnataka</option>
                    <option value="KL">Kerala</option>
                    <option value="MH">Maharashtra</option>
                    <option value="DL">Delhi</option>
                    <option value="TS">Telangana</option>
                    <option value="AP">Andhra Pradesh</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="GJ">Gujarat</option>
                  </select>
                  <span className="material-symbols-outlined select-arrow-sloc">expand_more</span>
                </div>
              </div>

              {/* Location Preview Box */}
              <div className="location-preview-sloc">
                <span className="material-symbols-outlined preview-icon-sloc">public</span>
                <span className="preview-text-sloc">
                  {data.city && data.state
                    ? `${data.city}, ${data.state}`
                    : "Location preview will appear here"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="sloc-footer">
              <button
                className="back-btn-sloc"
                onClick={onBack}
                type="button"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
              <button
                className="next-btn-sloc"
                onClick={onContinue}
                disabled={!canContinue || isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Next"}
                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationVisuals;
