// Component: EducationVisuals
// Purpose: UI for the Education step in Student Onboarding (Step 1 of 4)
import "@/styles/onboarding/student-education.css";
import type { StudentEducationData } from "@/hooks/onboarding/student/useStudentEducation";
import { Link } from "react-router-dom";

interface EducationVisualsProps {
  data: StudentEducationData;
  onUpdateField: (field: keyof StudentEducationData, value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  canContinue: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
}

const EducationVisuals = ({
  data,
  onUpdateField,
  onContinue,
  onBack,
  canContinue,
  isSubmitting,
  error,
  currentStep,
  totalSteps,
}: EducationVisualsProps) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="sedu-root">
      {/* Fixed Background */}
      <div className="fixed-bg-sedu"></div>

      {/* Header */}
      <header className="sedu-header">
        <div className="help-link-sedu">Help Center</div>
      </header>

      <main className="sedu-main">
        {/* Floating Decorative Elements */}

        {/* Top Left - Graduation Cap (Blue) */}
        <div className="floating-card-sedu floating-top-left-sedu">
          <div className="floating-card-inner-sedu blue-theme-sedu">
            <span className="material-symbols-outlined">school</span>
          </div>
        </div>

        {/* Top Right - Star Badge (Teal) */}
        <div className="floating-card-sedu floating-top-right-sedu">
          <div className="floating-card-inner-sedu teal-badge-sedu">
            <span className="material-symbols-outlined">star</span>
          </div>
        </div>

        {/* Bottom Left - Book (Pink) */}
        <div className="floating-card-sedu floating-bottom-left-sedu">
          <div className="floating-card-inner-sedu pink-theme-sedu">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
        </div>

        {/* Bottom Right - Rocket (Pink) */}
        <div className="floating-card-sedu floating-bottom-right-sedu">
          <div className="floating-icon-rocket">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
        </div>

        <div className="sedu-container">
          {/* Segmented Progress Bar */}
          <div className="progress-header-sedu">
            <div className="progress-top-row-sedu">
              <span className="step-count-sedu">STEP {currentStep} OF {totalSteps}</span>
              <span className="progress-percent-sedu">{progressPercent}% completed</span>
            </div>
            <div className="progress-segments-sedu">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`progress-segment-sedu ${i < currentStep ? 'filled' : ''}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Main Card */}
          <div className="sedu-card">
            {/* Title Section */}
            <div className="card-top-sedu">
              <h1>Tell us about your education 🎓</h1>
              <p>We'll use these details to find the best internships and jobs for you.</p>
            </div>

            {/* Error Message */}
            {error && <div className="error-message-sedu">{error}</div>}

            {/* Form Fields */}
            <div className="sedu-form">
              {/* College Name Input */}
              <div className="field-group-sedu">
                <label className="field-label-sedu">Where are you studying?</label>
                <div className="field-relative-sedu">
                  <span className="material-symbols-outlined field-icon-sedu">apartment</span>
                  <input
                    type="text"
                    className="sedu-input"
                    placeholder="Search for your college name..."
                    value={data.collegeName}
                    onChange={(e) => onUpdateField("collegeName", e.target.value)}
                  />
                </div>
              </div>

              {/* Degree & Year Row */}
              <div className="flex-row-sedu">
                {/* Degree Select */}
                <div className="field-group-sedu flex-grow-sedu">
                  <label className="field-label-sedu">Degree / Course</label>
                  <div className="field-relative-sedu">
                    <span className="material-symbols-outlined field-icon-sedu">school</span>
                    <select
                      className="sedu-select"
                      value={data.degree}
                      onChange={(e) => onUpdateField("degree", e.target.value)}
                    >
                      <option value="">Select Degree</option>
                      <option value="btech">B.Tech / B.E</option>
                      <option value="bsc">B.Sc</option>
                      <option value="bca">BCA</option>
                      <option value="bcom">B.Com</option>
                      <option value="ba">B.A</option>
                      <option value="mba">MBA</option>
                      <option value="mtech">M.Tech</option>
                      <option value="mca">MCA</option>
                    </select>
                    <span className="material-symbols-outlined select-arrow-sedu">expand_more</span>
                  </div>
                </div>

                {/* Graduation Year Select */}
                <div className="field-group-sedu flex-shrink-sedu">
                  <label className="field-label-sedu">Graduation Year</label>
                  <div className="field-relative-sedu">
                    <span className="material-symbols-outlined field-icon-sedu">calendar_month</span>
                    <select
                      className="sedu-select"
                      value={data.graduationYear}
                      onChange={(e) => onUpdateField("graduationYear", e.target.value)}
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 6 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      }).reverse()}
                    </select>
                    <span className="material-symbols-outlined select-arrow-sedu">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sedu-footer">
              <button
                className="back-action-sedu"
                onClick={onBack}
                type="button"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
              <button
                className="next-btn-sedu"
                onClick={onContinue}
                disabled={!canContinue || isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Next Step"}
                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="login-hint-sedu">
            Already have an account? <Link to="/login" className="login-link-sedu">Log in here</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationVisuals;
