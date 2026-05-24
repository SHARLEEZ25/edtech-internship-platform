import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { RecruiterDashboardInternship } from '@/hooks/dashboard/useRecruiterDashboardData';
import '../../../styles/dashboard/recruiter-dashboard.css';
import { getInitials, getAvatarColor, formatRelativeTime } from '@/utils/internshipFormatters';

interface ActiveInternshipsProps {
    internships: RecruiterDashboardInternship[];
}

const ActiveInternships: React.FC<ActiveInternshipsProps> = ({ internships }) => {
    const navigate = useNavigate();

    return (
        <div className="recruiter-section-card">
            <div className="section-card-header">
                <h3 >Active Internships</h3>
                <button
                    className="view-all-btn"
                    onClick={() => navigate('/dashboard/recruiter/internships')}
                >
                    View All
                </button>
            </div>
            <div className="internships-list">
                {internships.length === 0 ? (
                    <div className="empty-state-recruiter">No active internships found.</div>
                ) : (
                    internships.map((listing, index) => (
                        <div
                            key={listing.id}
                            className="internship-row-clickable"
                            onClick={() => navigate(`/dashboard/recruiter/internships/${listing.id}`)}
                        >
                            <div className="internship-info">
                                <div className={`internship-icon ${index % 2 === 0 ? 'icon-blue' : 'icon-purple'}`}>
                                    {getInitials(listing.title)}
                                </div>
                                <div className="internship-details">
                                    <h4>{listing.title}</h4>
                                    <div className="internship-meta">
                                        <span className="meta-tag">{listing.domain}</span>
                                        <span className="meta-date">• {formatRelativeTime(listing.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="internship-applicants-group">
                                <div className="avatar-group">
                                    {(listing.applicants || []).map((app) => (
                                        app.avatar ? (
                                            <img
                                                key={app.id}
                                                src={app.avatar}
                                                alt={app.name}
                                                className="avatar-group-item"
                                                title={app.name}
                                            />
                                        ) : (
                                            <div
                                                key={app.id}
                                                className="avatar-group-item initial-avatar"
                                                style={{ backgroundColor: getAvatarColor(app.name) }}
                                                title={app.name}
                                            >
                                                {getInitials(app.name)}
                                            </div>
                                        )
                                    ))}
                                    {listing.applicantCount > 3 && (
                                        <div className="avatar-more">+{listing.applicantCount - 3}</div>
                                    )}
                                </div>
                                <div className="internship-status-controls">
                                    <div className="status-indicator">
                                        <span className="status-dot-active"></span>
                                        <span className="status-text-active">{listing.status === 'LIVE' ? 'Active' : listing.status}</span>
                                    </div>
                                    <button className="notification-btn">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActiveInternships;
