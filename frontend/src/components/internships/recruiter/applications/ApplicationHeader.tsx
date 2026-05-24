import React from 'react';
import type { Application } from '@/api/internships.api';
import { timeAgo } from '@/utils/dateUtils';
interface ApplicationHeaderProps {
    application: Application;
    updating: boolean;
    onStatusUpdate: (status: string) => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
    application,
    updating,
    onStatusUpdate
}) => {




    return (
        <div className="app-card-header">
            <div className="app-status-top">
                <select
                    className={`status-select-dropdown status-${application.status.toLowerCase()}`}
                    value={application.status}
                    onChange={(e) => onStatusUpdate(e.target.value)}
                    disabled={updating}
                >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="SELECTED">Selected</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            <div className="app-avatar-wrapper">
                {application.fullName.charAt(0)}
            </div>

            <h2 className="app-candidate-name">{application.fullName}</h2>
            <p className="app-candidate-role">{application.internship?.title || 'Software Engineering Intern'}</p>

            <div className="app-meta-row">
                <span className="meta-item">
                    <span className="material-symbols-outlined">badge</span>
                    App ID: #{application.id.slice(-5)} { }
                </span>
                <span className="meta-item">
                    <span className="material-symbols-outlined">schedule</span>
                    Applied {timeAgo(application.appliedAt)}
                </span>
            </div>
        </div>
    );
};
