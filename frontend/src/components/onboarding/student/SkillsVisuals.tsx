// Component: SkillsVisuals
// Purpose: UI for the Skills step in Student Onboarding (Step 2 of 4)
import "@/styles/onboarding/student-skills.css";
import type { SkillCategory } from "@/hooks/onboarding/student/useSkillsForm";

interface SkillsVisualsProps {
    selectedSkills: string[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onToggleSkill: (skill: string) => void;
    onContinue: () => void;
    onBack?: () => void;
    canContinue: boolean;
    isSubmitting: boolean;
    error: string | null;
    currentStep: number;
    totalSteps: number;
    categories: SkillCategory[];
}

const SkillsVisuals = ({
    selectedSkills,
    searchQuery,
    onSearchChange,
    onToggleSkill,
    onContinue,
    onBack,
    canContinue,
    isSubmitting,
    error,
    currentStep,
    totalSteps,
    categories
}: SkillsVisualsProps) => {
    const progressPercent = Math.round((currentStep / totalSteps) * 100);

    // Basic search filtering
    const filteredCategories = categories.map(cat => ({
        ...cat,
        skills: cat.skills.filter(skill =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.skills.length > 0);

    return (
        <div className="sskill-root">
            {/* Fixed Background */}
            <div className="fixed-bg-sskill"></div>

            <main className="sskill-main">
                {/* Floating Decorative Elements */}

                {/* Top Left - Graduation Cap (Blue) */}
                <div className="floating-card-sskill floating-top-left-sskill">
                    <div className="floating-card-inner-sskill blue-theme-sskill">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                </div>

                {/* Top Right - Rocket (Blue/Orange) */}
                <div className="floating-card-sskill floating-top-right-sskill">
                    <div className="floating-icon-rocket-sskill">
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                </div>

                {/* Bottom Left - Document (Blue) */}
                <div className="floating-card-sskill floating-bottom-left-sskill">
                    <div className="floating-card-inner-sskill blue-outline-sskill">
                        <span className="material-symbols-outlined">description</span>
                    </div>
                </div>

                {/* Bottom Right - Location Pin (Pink) */}
                <div className="floating-card-sskill floating-bottom-right-sskill">
                    <div className="floating-icon-pin-sskill">
                        <span className="material-symbols-outlined">location_on</span>
                    </div>
                </div>

                <div className="sskill-container">
                    {/* Segmented Progress Bar */}
                    <div className="progress-header-sskill">
                        <div className="progress-top-row-sskill">
                            <span className="step-count-sskill">STEP {currentStep} OF {totalSteps}</span>
                            <span className="progress-percent-sskill">{progressPercent}% Completed</span>
                        </div>
                        <div className="progress-segments-sskill">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div
                                    key={i}
                                    className={`progress-segment-sskill ${i < currentStep ? 'filled' : ''}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="sskill-card">
                        {/* Title Section */}
                        <div className="card-top-sskill">
                            <h1>What skills are you building? 🚀</h1>
                            <p>Select at least 3 skills to help us personalize your learning feed and job recommendations.</p>
                        </div>

                        {/* Error Message */}
                        {error && <div className="error-message-sskill">{error}</div>}

                        {/* Search Input */}
                        <div className="search-wrapper-sskill">
                            <span className="material-symbols-outlined search-icon-sskill">search</span>
                            <input
                                type="text"
                                className="sskill-search"
                                placeholder="Search for a skill (e.g., Python, Graphic Design)..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-search-sskill" onClick={() => onSearchChange("")}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}
                        </div>

                        {/* Categories Section */}
                        <div className="categories-wrapper-sskill">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(category => (
                                    <div key={category.id} className="category-section-sskill">
                                        <h3 className="category-title-sskill">
                                            <span>{category.icon}</span>
                                            {category.label}
                                        </h3>
                                        <div className="skills-grid-sskill">
                                            {category.skills.map(skill => {
                                                const isSelected = selectedSkills.includes(skill);
                                                return (
                                                    <button
                                                        key={skill}
                                                        className={`skill-chip-sskill ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => onToggleSkill(skill)}
                                                    >
                                                        {skill}
                                                        <span className="material-symbols-outlined chip-icon-sskill">
                                                            {isSelected ? 'check' : 'add'}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results-sskill">
                                    <p>No skills found matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sskill-footer">
                            <button
                                className="back-action-sskill"
                                onClick={onBack}
                                type="button"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back
                            </button>
                            <button
                                className="continue-btn-sskill"
                                onClick={onContinue}
                                disabled={!canContinue || isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Continue"}
                                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SkillsVisuals;
