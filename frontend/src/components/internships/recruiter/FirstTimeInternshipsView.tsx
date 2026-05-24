// Welcome screen for new recruiters who haven't posted internships yet.
import '../../../styles/internships/recruiter/first-time-view.css';

interface FirstTimeInternshipsViewProps {
    onCreateClick: () => void;
}

export const FirstTimeInternshipsView: React.FC<FirstTimeInternshipsViewProps> = ({ onCreateClick }) => {
    return (
        <div className="first-time-internships">
            <div className="first-time-container">
                <div className="first-time-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="50" fill="#E8F0FE" />
                        <path d="M60 35V85M35 60H85" stroke="#4285F4" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="60" cy="60" r="45" stroke="#4285F4" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                </div>

                <h2 className="first-time-title">Welcome to Your Internship Hub!</h2>
                <p className="first-time-subtitle">
                    Start building your team by posting your first internship opportunity.
                    Reach talented students across the platform.
                </p>

                {/* [VISUAL STATE]: Empty State Action. User clicks here to create their first internship. */}
                <button className="first-time-cta" onClick={onCreateClick}>
                    <span className="cta-icon">+</span>
                    Create Your First Internship
                </button>

                <div className="first-time-features">
                    <div className="feature-item">
                        <div className="feature-icon">📝</div>
                        <span>Easy posting process</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🎯</div>
                        <span>Reach qualified candidates</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">📊</div>
                        <span>Track applications</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
