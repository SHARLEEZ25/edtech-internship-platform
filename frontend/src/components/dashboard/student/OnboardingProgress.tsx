// Tracks and displays the student's progress through onboarding steps.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/dashboard/student-dashboard.css';

interface OnboardingProgressProps {
    progress?: number;
    strokeDashoffset: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ progress = 0, strokeDashoffset }) => {
    const navigate = useNavigate();

    const handleCompleteProfile = () => {
        navigate('/dashboard/student/profile');
    };

    return (
        <div className="stat-card">
            <h3 className="stat-card-title">Profile Completion</h3>
            <div className="progress-card-center">
                <div className="progress-circle-container">
                    <svg className="progress-circle" width="96" height="96" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <circle
                            className="progress-circle-bg"
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            strokeWidth="3"
                        />
                        <circle
                            className="progress-circle-fill"
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            strokeWidth="3"
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <span className="progress-percentage">{progress}%</span>
                </div>
                <p className="progress-label">Complete Your Profile</p>
            </div>
            {/* [VISUAL STATE]: Primary Action. Button to continue onboarding. */}
            <button className="btn btn-gradient mt-auto" onClick={handleCompleteProfile}>
                <span>Complete Profile</span>
            </button>
        </div>
    );
};

export default OnboardingProgress;
