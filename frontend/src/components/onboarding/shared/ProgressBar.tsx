// Visual progress bar for onboarding steps.
import "@/styles/onboarding/onboarding-shared.css";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="progress-container">
            <div className="progress-info">
                <span className="step-text">Step {currentStep} of {totalSteps}</span>
                <span className="percentage-text">{percentage}% completed</span>
            </div>
            <div className="progress-bar-stack">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`progress-segment ${index < currentStep ? "filled" : ""}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
