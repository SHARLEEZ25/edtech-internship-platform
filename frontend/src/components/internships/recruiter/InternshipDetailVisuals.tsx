// Detailed view of a specific internship posting for recruiters.
import React from 'react';
import type { Internship } from '../../../api/internships.api';
import '../../../styles/internships/recruiter/internship-details.css';

interface InternshipDetailVisualsProps {
    internship: Internship;
    stats: {
        totalApplications: number;
        shortlisted: number;
        interviews: number;
        offersSent: number;
    };
    companyName: string;
    onClose: () => void;
    onViewApplicants: () => void;
    onEdit: () => void;
}

export const InternshipDetailVisuals: React.FC<InternshipDetailVisualsProps> = ({
    internship,
    stats,
    companyName,
    onClose,
    onViewApplicants,
    onEdit
}) => {
    // Helper to format currency
    const formatCurrency = (amount: number | null | undefined) => {
        if (!amount) return 'Unpaid';
        return `₹ ${amount.toLocaleString('en-IN')} /mo`;
    };

    return (
        <div className="details-page-content">
            {/* 1. Main Info Card */}
            <div className="details-main-card">
                <div className="detail-header-row">
                    <div className="detail-title-group">
                        <h2>{internship.title}</h2>
                        <div className="detail-company-info">
                            {companyName} • {internship.domain} Team
                        </div>
                    </div>
                    <div className="status-badge active">
                        {internship.status === 'LIVE' ? 'Active' : internship.status}
                    </div>
                </div>

                <div className="detail-attributes-grid">
                    {/* Location */}
                    <div className="attribute-item">
                        <span className="attribute-label">LOCATION</span>
                        <div className="attribute-value">
                            <span className="material-symbols-outlined icon-location">location_on</span>
                            {internship.city || 'Remote'}
                        </div>
                    </div>

                    {/* Type */}
                    <div className="attribute-item">
                        <span className="attribute-label">TYPE</span>
                        <div className="attribute-value">
                            <span className="material-symbols-outlined icon-type">laptop_mac</span>
                            {internship.internshipType === 'REMOTE' ? 'Remote' : 'In-Office'}
                        </div>
                    </div>

                    {/* Domain */}
                    <div className="attribute-item">
                        <span className="attribute-label">DOMAIN</span>
                        <div className="attribute-value">
                            <span className="material-symbols-outlined icon-domain">category</span>
                            {internship.domain}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="attribute-item">
                        <span className="attribute-label">DURATION</span>
                        <div className="attribute-value">
                            <span className="material-symbols-outlined icon-duration">schedule</span>
                            {internship.durationValue} {internship.durationUnit === 'MONTHS' ? 'Months' : 'Weeks'}
                        </div>
                    </div>

                    {/* Openings */}
                    <div className="attribute-item">
                        <span className="attribute-label">OPENINGS</span>
                        <div className="attribute-value">
                            <span className="material-symbols-outlined icon-openings">group</span>
                            {internship.openings} Slots
                        </div>
                    </div>

                    {/* Stipend */}
                    <div className="attribute-item">
                        <span className="attribute-label">STIPEND</span>
                        <div className="attribute-value">
                            <span className="material-symbols-outlined icon-stipend">payments</span>
                            {formatCurrency(internship.stipendMin)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Performance Stats Grid */}
            <div className="details-stats-grid">
                <div className="stat-metric-card">
                    <div className="stat-metric-content">
                        <span className="stat-metric-label">Total Applications</span>
                        <span className="stat-metric-value">{stats.totalApplications}</span>
                    </div>
                    <div className="stat-metric-icon icon-bg-blue">
                        <span className="material-symbols-outlined">description</span>
                    </div>
                </div>
                <div className="stat-metric-card">
                    <div className="stat-metric-content">
                        <span className="stat-metric-label">Shortlisted</span>
                        <span className="stat-metric-value">{stats.shortlisted}</span>
                    </div>
                    <div className="stat-metric-icon icon-bg-purple">
                        <span className="material-symbols-outlined">filter_list</span>
                    </div>
                </div>
                <div className="stat-metric-card">
                    <div className="stat-metric-content">
                        <span className="stat-metric-label">Interviews</span>
                        <span className="stat-metric-value">{stats.interviews}</span>
                    </div>
                    <div className="stat-metric-icon icon-bg-orange">
                        <span className="material-symbols-outlined">video_call</span>
                    </div>
                </div>
                <div className="stat-metric-card">
                    <div className="stat-metric-content">
                        <span className="stat-metric-label">Offers Sent</span>
                        <span className="stat-metric-value">{stats.offersSent}</span>
                    </div>
                    <div className="stat-metric-icon icon-bg-green">
                        <span className="material-symbols-outlined">celebration</span>
                    </div>
                </div>
            </div>

            {/* 3. Description Section */}
            <div className="detail-section-card">
                <div className="details-section-header">
                    <span className="material-symbols-outlined section-icon-blue">notes</span>
                    <h3>Internship Description</h3>
                </div>
                <div className="description-text">
                    {internship.description?.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    )) || <p>No description provided.</p>}
                </div>
            </div>

            {/* 4. Bottom Grid: Skills & Responsibilities */}
            <div className="details-bottom-grid">
                {/* Left: Skills & Eligibility */}
                <div className="detail-section-card">
                    <div className="details-section-header">
                        <h3>Skills & Eligibility</h3>
                    </div>

                    <div className="skills-container">
                        <span className="attribute-label" style={{ marginBottom: '1rem' }}>REQUIRED TECH STACK</span>
                        <div className="skills-tags-row">
                            {internship.skills && internship.skills.length > 0 ? (
                                internship.skills.map(skill => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))
                            ) : (
                                <span className="description-text">No specific skills listed.</span>
                            )}
                        </div>

                        <span className="attribute-label" style={{ marginBottom: '0.75rem' }}>REQUIREMENTS</span>
                        <div className="responsibilities-list">
                            {internship.requirements && internship.requirements.length > 0 ? (
                                internship.requirements.map((req, i) => (
                                    <div key={i} className="responsibility-item" style={{ alignItems: 'flex-start' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8', marginTop: '2px' }}>check_circle</span>
                                        <div className="responsibility-content">{req}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="description-text">No specific requirements listed.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Responsibilities */}
                <div className="detail-section-card">
                    <div className="details-section-header">
                        <h3>Responsibilities</h3>
                    </div>
                    <div className="responsibilities-list">
                        {internship.responsibilities && internship.responsibilities.length > 0 ? (
                            internship.responsibilities.map((res, i) => (
                                <div key={i} className="responsibility-item">
                                    <div className="responsibility-number">{i + 1}</div>
                                    <div className="responsibility-content">{res}</div>
                                </div>
                            ))
                        ) : (
                            <p className="description-text">No responsibilities listed.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Fixed Bottom Footer Actions */}
            <div className="detail-footer-wrapper">
                <div className="detail-footer-actions">
                    <button className="btn-detail btn-close-int" onClick={onClose}>
                        <span className="material-symbols-outlined">block</span>
                        <span className="btn-text-desktop">Close Internship</span>
                        <span className="btn-text-mobile">Close</span>
                    </button>
                    <button className="btn-detail btn-view-apps" onClick={onViewApplicants}>
                        <span className="material-symbols-outlined">visibility</span>
                        <span className="btn-text-desktop">View Applicants</span>
                        <span className="btn-text-mobile">View</span>
                    </button>
                    <button className="btn-detail btn-edit-int" onClick={onEdit}>
                        <span className="material-symbols-outlined">edit</span>
                        <span className="btn-text-desktop">Edit Internship</span>
                        <span className="btn-text-mobile">Edit</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
