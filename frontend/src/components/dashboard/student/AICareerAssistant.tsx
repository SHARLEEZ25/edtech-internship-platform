// AI-powered widget offering career advice and tips.
import React from 'react';
import '../../../styles/dashboard/student-dashboard.css';

interface Feature {
    icon: string;
    label: string;
}

const AICareerAssistant: React.FC = () => {
    const features: Feature[] = [
        { icon: 'psychology', label: 'Resume Analysis' },
        { icon: 'model_training', label: 'Skill Gap' },
        { icon: 'radar', label: 'Job Matching' },
    ];

    return (
        <div className="ai-section">
            <div className="ai-content">
                <div className="ai-text">
                    <h3 className="ai-title">AI Career Assistant</h3>
                    <p className="ai-description">
                        Get instant resume feedback, job recommendations, and skill insights to
                        supercharge your career path.
                    </p>
                    <div className="ai-features">
                        {/* [VISUAL STATE]: List View. Highlights key AI features. */}
                        {features.map((feature, index) => (
                            <div key={index} className="ai-feature">
                                <span className="material-symbols-outlined">{feature.icon}</span>
                                <span>{feature.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ai-button-container">
                    {/* [VISUAL STATE]: Primary Action. Button to launch AI tools. */}
                    <button className="btn btn-ai">
                        <span>Try AI Tools</span>
                    </button>
                </div>
            </div>
            <div className="ai-glow-effect-1"></div>
            <div className="ai-glow-effect-2"></div>
        </div>
    );
};

export default AICareerAssistant;
