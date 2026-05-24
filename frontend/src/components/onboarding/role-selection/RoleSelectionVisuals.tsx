// Initial screen for user to select their role (Student/Recruiter).
import "@/styles/onboarding/role-selection.css";
import { ROLES, type RoleType } from "@/utils/constants";

export type UserRole = RoleType;

interface RoleSelectionVisualsProps {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
  onContinue: () => void;
  canContinue: boolean;
  isSubmitting?: boolean;
  error?: string | null;
}

const RoleSelectionVisuals = ({
  selectedRole,
  onSelect,
  onContinue,
  canContinue,
  isSubmitting = false,
  error = null,
}: RoleSelectionVisualsProps) => {
  return (
    <div className="role-root">
      {/* Background Decorative Icons */}

      <div className="bg-decor">
        <div className="bg-blur"></div>
        <img src="/icons/briefcase.png" className="decor-item decor-2" />
        <img src="/icons/brain.png" className="decor-item decor-3" />
        <img src="/icons/bulb.png" className="decor-item decor-4" />
        <img src="/icons/graduation.png" className="decor-item decor-5" />
      </div>

      <div className="role-header">
        <h1>Choose how you want to continue</h1>
        <p>This helps us personalize your experience.</p>
      </div>

      <div className="role-cards">
        {/* Student Card */}
        <div
          className={`role-card student ${selectedRole === ROLES.STUDENT ? "active" : ""
            }`}
          onClick={() => onSelect(ROLES.STUDENT)}
        >
          <div className="card-top">
            <div className="icon-box">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="check-icon">
              <span className="material-symbols-outlined">check</span>
            </div>
          </div>
          <div className="card-info">
            <h2>Student</h2>
            <p>
              Explore internships, learn skills, and use AI tools to grow your
              career.
            </p>
          </div>
        </div>

        {/* Recruiter Card */}
        <div
          className={`role-card recruiter ${selectedRole === ROLES.RECRUITER ? "active" : ""
            }`}
          onClick={() => onSelect(ROLES.RECRUITER)}
        >
          <div className="card-top">
            <div className="icon-box">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <div className="check-icon">
              <span className="material-symbols-outlined">check</span>
            </div>
          </div>
          <div className="card-info">
            <h2>Recruiter</h2>
            <p>
              Post internships, review applications, and hire the right talent.
            </p>
          </div>
        </div>
      </div>

      <div className="role-footer">
        <button
          className={`continue-btn ${selectedRole === ROLES.RECRUITER ? "recruiter-theme" : ""
            }`}
          disabled={!canContinue || isSubmitting}
          onClick={onContinue}
        >
          <span>{isSubmitting ? "Please wait..." : "Continue"}</span>
          {!isSubmitting && (
            <span className="material-symbols-outlined btn-icon">
              arrow_forward
            </span>
          )}
        </button>

        {error && (
          <div className="role-error" style={{ color: "#ef4444", marginTop: "1rem", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <p className="hint">You can change this later from settings.</p>
      </div>
    </div>
  );
};

export default RoleSelectionVisuals;
