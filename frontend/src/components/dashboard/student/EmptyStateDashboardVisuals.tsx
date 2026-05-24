import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import '@/styles/dashboard/empty-state-dashboard.css';

interface EmptyStateDashboardVisualsProps {
    onCompleteProfile: () => void;
}

export const EmptyStateDashboardVisuals: React.FC<EmptyStateDashboardVisualsProps> = ({
    onCompleteProfile
}) => {
    return (
        <div className="empty-state-container" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">
                <Rocket size={48} color="#3b82f6" />
            </div>

            <h2 className="empty-state-header">
                No internships matched yet.
            </h2>

            <p className="empty-state-subtext">
                Recruiters are just getting started. Use this time to stand out!
            </p>

            <div className="empty-state-actions">
                <button
                    onClick={onCompleteProfile}
                    className="btn-primary"
                >
                    <Sparkles size={18} />
                    Complete Profile
                </button>
            </div>
        </div>
    );
};
