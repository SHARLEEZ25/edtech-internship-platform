import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { RecruiterDashboardApplication } from '@/hooks/dashboard/useRecruiterDashboardData';
import '../../../styles/dashboard/recruiter-dashboard.css';
import { getAvatarColor, getInitials, getApplicationStatusClass, getApplicationStatusText } from '@/utils/internshipFormatters';
import { formatDate } from '@/utils/dateUtils';

interface RecentApplicationsProps {
    applications: RecruiterDashboardApplication[];
}

const RecentApplications: React.FC<RecentApplicationsProps> = ({ applications }) => {
    const navigate = useNavigate();

    return (
        <div className="recruiter-section-card">
            <div className="section-card-header">
                <h3>Recent Applications</h3>
                <div className="header-actions-minimal">
                    <button className="notification-btn">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                    <button className="notification-btn">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </div>
            <div className="table-container">
                <table className="recruiter-table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Role</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty-table-row">No recent applications.</td>
                            </tr>
                        ) : (
                            applications.map((applicant) => (
                                <tr
                                    key={applicant.id}
                                    className="recruiter-table-row"
                                    onClick={() => navigate(`/dashboard/recruiter/applications/${applicant.id}`)}
                                >
                                    <td>
                                        <div className="applicant-info">
                                            {applicant.avatar ? (
                                                <img
                                                    src={applicant.avatar}
                                                    alt={applicant.candidateName}
                                                    className="applicant-avatar"
                                                />
                                            ) : (
                                                <div
                                                    className="applicant-avatar initial-avatar"
                                                    style={{ backgroundColor: getAvatarColor(applicant.candidateName) }}
                                                >
                                                    {getInitials(applicant.candidateName)}
                                                </div>
                                            )}
                                            <div className="applicant-details-text">
                                                <span className="applicant-name">{applicant.candidateName}</span>
                                                <span className="applicant-email">{applicant.candidateEmail}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{applicant.role}</td>
                                    <td>{formatDate(applicant.appliedDate)}</td>
                                    <td>
                                        <span className={`status-badge ${getApplicationStatusClass(applicant.status)}`}>
                                            {getApplicationStatusText(applicant.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="table-footer">
                <Link to="/dashboard/recruiter/applications" className="section-link">
                    View All Applications
                </Link>
            </div>
        </div>
    );
};

export default RecentApplications;
