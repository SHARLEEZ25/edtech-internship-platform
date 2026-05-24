// Community focused banner for student dashboard.
import React from 'react';
import '../../../styles/dashboard/student-dashboard.css';

interface Feature {
    icon: string;
    label: string;
}

const CommunityBanner: React.FC = () => {
    const features: Feature[] = [
        { icon: 'photo_camera', label: 'Instagram Updates' },
        { icon: 'stars', label: 'Success Stories' },
        { icon: 'campaign', label: 'Weekly Giveaways' },
    ];

    return (
        <div className="ai-section">
            <div className="ai-content">
                <div className="ai-text">
                    <h3 className="ai-title">Join the Thozhil Community</h3>
                    <p className="ai-description">
                        Connect with 10,000+ students. Get the latest internship updates,
                        career tips, and behind-the-scenes action on our Instagram.
                    </p>
                    <div className="ai-features">
                        {/* [VISUAL STATE]: List View. Highlights community perks. */}
                        {features.map((feature, index) => (
                            <div key={index} className="ai-feature">
                                <span className="material-symbols-outlined">{feature.icon}</span>
                                <span>{feature.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ai-button-container">
                    {/* [VISUAL STATE]: Primary Action. Link to social media. */}
                    <button className="btn btn-ai" onClick={() => window.open('https://www.instagram.com/thozhil_thogari/', '_blank')}>
                        <span>Follow on Instagram</span>
                    </button>
                </div>
            </div>
            <div className="ai-glow-effect-1"></div>
            <div className="ai-glow-effect-2"></div>
        </div>
    );
};

export default CommunityBanner;
