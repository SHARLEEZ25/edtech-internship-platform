import React from 'react';
import { Link } from 'react-router-dom';
import type { Application } from '@/api/internships.api';
import { uploadApi } from '@/api/upload.api';

interface ApplicationInfoGridProps {
    application: Application;
}

export const ApplicationInfoGrid: React.FC<ApplicationInfoGridProps> = ({ application }) => {
    return (
        <div className="app-info-grid">
            <div>
                <h4 className="info-label">UNIVERSITY</h4>
                <p className="info-value">{application.student?.collegeName || 'N/A'}</p>
            </div>
            <div>
                <h4 className="info-label">RESUME</h4>
                {application.resumeUrl ? (
                    <a
                        href={uploadApi.getFileUrl(application.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-value resume-link"
                    >
                        View Resume 📄
                    </a>
                ) : (
                    <p className="info-value text-muted">No resume</p>
                )}
            </div>
            <div>
                <h4 className="info-label">PROFILE</h4>
                <Link
                    to={`/dashboard/recruiter/students/${application.studentId}`}
                    className="info-value profile-link view-profile-link"
                >
                    View Full Profile <span className="material-symbols-outlined icon-sm">open_in_new</span>
                </Link>
            </div>
        </div>
    );
};
