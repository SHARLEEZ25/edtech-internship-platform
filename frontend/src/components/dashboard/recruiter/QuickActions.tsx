import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RECRUITER_QUICK_ACTIONS } from '@/utils/dashboard.constants';
import '../../../styles/dashboard/recruiter-dashboard.css';

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="quick-actions-card">
            <h3 className="quick-actions-title">
                <span className="material-symbols-outlined">bolt</span> Quick Actions
            </h3>
            <div className="actions-list">
                {RECRUITER_QUICK_ACTIONS.map((action, index) => (
                    <button
                        key={index}
                        className="action-item"
                        onClick={() => navigate(action.path)}
                    >
                        <div className="action-icon">
                            <span className="material-symbols-outlined">{action.icon}</span>
                        </div>
                        <div className="action-text">
                            <h5>{action.title}</h5>
                            <p>{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
