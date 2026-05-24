import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type Internship } from '@/api/internships.api';
import { isDeadlinePassed } from '@/utils/dateUtils';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import perksAndBenefitsData from '@/data/perksAndBenefits.json';
import similarInternshipsData from '@/data/similarInternships.json';

interface StudentInternshipDetailsVisualsProps {
    internship: Internship;
    applicationId: string | null;
    isWithdrawModalOpen: boolean;
    isActionLoading: boolean;
    onWithdrawCancel: () => void;
    onWithdrawConfirm: () => void;
    onWithdrawClick: () => void;
    onSaveToggle: () => void;
    formattedStipend: string;
    formattedDuration: string;
}

export const StudentInternshipDetailsVisuals: React.FC<StudentInternshipDetailsVisualsProps> = ({
    internship,
    applicationId,
    isWithdrawModalOpen,
    isActionLoading,
    onWithdrawCancel,
    onWithdrawConfirm,
    onWithdrawClick,
    onSaveToggle,
    formattedStipend,
    formattedDuration
}) => {
    const navigate = useNavigate();
    const isExpired = isDeadlinePassed(internship.applicationDeadline);

    const getBadgeClass = (text: string) => {
        const domainMap: Record<string, string> = {
            'Design': 'tag-purple',
            'Marketing': 'tag-yellow',
            'Engineering': 'tag-blue',
            'Tech': 'tag-blue',
            'Data Science': 'tag-red',
            'Business': 'tag-green'
        };
        return domainMap[text] || 'tag-blue';
    };

    return (
        <div className="student-details-container animate-fade-in">
            {/* Header Section */}
            <header className="details-header-card">
                <div className="header-breadcrumbs">
                    <Link to="/dashboard/student/internships" className="breadcrumb-link">Internships</Link>
                    <span>/</span>
                    <span>{internship.title}</span>
                </div>

                <div className="header-main-content">
                    <div className="header-title-section">
                        <h1 className="details-title">{internship.title}</h1>
                        <div className="details-company-row">
                            <span>at {internship.recruiter?.companyName || 'Confidential'}</span>
                        </div>

                        <div className="header-meta-row">
                            <div className="meta-item">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>location_on</span>
                                {internship.city && internship.state
                                    ? `${internship.city}, ${internship.state}`
                                    : internship.city || internship.state || 'Remote'}
                            </div>
                            <div className="meta-dot"></div>
                            <div className="meta-item">{formattedStipend}</div>
                            <div className="meta-dot"></div>
                            <div className="meta-item">{formattedDuration}</div>
                        </div>

                        <div className="header-tags">
                            <span className="header-tag tag-blue">
                                {internship.workType === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
                            </span>
                            <span className="header-tag tag-yellow">
                                {internship.internshipType === 'REMOTE' ? 'Remote' : internship.internshipType}
                            </span>
                            <span className={`header-tag ${getBadgeClass(internship.domain)}`}>
                                {internship.domain}
                            </span>
                        </div>
                    </div>

                    <div className="verified-badge">
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>verified</span>
                        Verified
                    </div>
                </div>
            </header>

            {/* Main Grid Content */}
            <div className="details-grid-layout">
                {/* Left Column: Description & Content */}
                <div className="details-left-column">
                    <section className="content-section-card">
                        <h2 className="content-section-title">About the role</h2>
                        <p className="content-text">{internship.description}</p>
                    </section>

                    {internship.responsibilities && internship.responsibilities.length > 0 && (
                        <section className="content-section-card">
                            <h2 className="content-section-title">Responsibilities</h2>
                            <ul className="content-list">
                                {internship.responsibilities.map((item, index) => (
                                    <li key={index} className="content-list-item">
                                        <div className="list-bullet"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="content-section-card">
                        <h2 className="content-section-title">Required skills</h2>
                        <div className="content-text flex flex-wrap gap-2 mt-2">
                            {internship.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {internship.requirements && internship.requirements.length > 0 && (
                        <section className="content-section-card">
                            <h2 className="content-section-title">Requirements</h2>
                            <ul className="content-list">
                                {internship.requirements.map((item, index) => (
                                    <li key={index} className="content-list-item">
                                        <div className="list-bullet"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="content-section-card">
                        <h2 className="content-section-title">Perks & benefits</h2>
                        <ul className="content-list">
                            {perksAndBenefitsData.map((perk, index) => (
                                <li key={index} className="content-list-item">
                                    <div className="list-bullet"></div>
                                    <span>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="content-section-card">
                        <h2 className="content-section-title">Number of openings</h2>
                        <div className="openings-count">{internship.openings}</div>
                    </section>

                    {/* Similar Internships Section */}
                    <section className="similar-internships-section">
                        <h2 className="section-title-main">Similar Internships</h2>
                        <div className="similar-internships-grid">
                            {similarInternshipsData.map((internship) => (
                                <div key={internship.id} className="similar-internship-card">
                                    <h3 className="similar-internship-title">{internship.title}</h3>
                                    <p className="similar-company">{internship.company}</p>
                                    <p className="similar-location">{internship.location}</p>
                                    <div className="similar-tags">
                                        {internship.tags.map((tag, index) => (
                                            <span key={index} className={`similar-tag ${tag.className}`}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <br />
                </div>

                {/* Right Sidebar */}
                <aside className="sidebar-sticky">
                    <div className="application-card">
                        <div className="sidebar-group">
                            <label className="sidebar-label">Application Deadline</label>
                            <span className="sidebar-value">
                                {new Date(internship.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        <div className="sidebar-group">
                            <label className="sidebar-label">Posted Date</label>
                            <span className="sidebar-value">
                                {new Date(internship.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        <div className="sidebar-group">
                            <label className="sidebar-label">Applied</label>
                            <span className="sidebar-value">{internship._count?.applications || 0} applicants</span>
                        </div>

                        {internship.hasApplied ? (
                            <button
                                className="apply-btn-full flex items-center justify-center gap-2"
                                onClick={() => navigate(`/dashboard/student/applications/${applicationId}`)}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>visibility</span>
                                View My Application
                            </button>
                        ) : isExpired ? (
                            <button
                                className="apply-btn-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                                disabled
                                style={{ backgroundColor: '#94a3b8' }}
                            >
                                <span className="material-symbols-outlined">event_busy</span>
                                Applications Closed
                            </button>
                        ) : (
                            <button
                                className="apply-btn-full"
                                onClick={() => navigate(`/dashboard/student/internships/${internship.id}/apply`)}
                            >
                                Apply Now
                            </button>
                        )}

                        {internship.hasApplied ? (
                            <button
                                className="withdraw-btn mt-4"
                                onClick={onWithdrawClick}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? 'Processing...' : 'Withdraw Application'}
                            </button>
                        ) : (
                            <button
                                className={`save-btn mt-4 flex items-center justify-center gap-2 ${internship.isSaved ? 'saved' : ''}`}
                                onClick={onSaveToggle}
                                disabled={isActionLoading}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                                    {isActionLoading ? 'progress_activity' : (internship.isSaved ? 'bookmark' : 'bookmark_border')}
                                </span>
                                {internship.isSaved ? 'Saved' : 'Save for later'}
                            </button>
                        )}
                    </div>

                    <div className="company-card mt-6">
                        <div className="company-header">
                            <div className="company-logo-placeholder">
                                <span className="material-symbols-outlined">apartment</span>
                            </div>
                            <div className="company-info">
                                <Link to={`/dashboard/student/companies/${internship.recruiter?.id}`} className="company-title-link">
                                    <h4 className="company-title">About {internship.recruiter?.companyName || 'Company'}</h4>
                                </Link>
                                <Link to={`/dashboard/student/companies/${internship.recruiter?.id}`} className="view-profile-link">
                                    View Company Profile
                                </Link>
                            </div>
                        </div>
                        <p className="company-desc">
                            {internship.recruiter?.companyDescription || 'No company description available.'}
                        </p>
                        <button
                            className="visit-website-btn"
                            onClick={() => navigate(`/dashboard/student/companies/${internship.recruiter?.id}`)}
                        >
                            View Profile
                        </button>
                    </div>
                </aside>
            </div>

            <ConfirmModal
                isOpen={isWithdrawModalOpen}
                title="Withdraw Application?"
                message="Are you sure you want to withdraw your application? This action cannot be undone."
                confirmLabel="Withdraw"
                cancelLabel="Cancel"
                onConfirm={onWithdrawConfirm}
                onCancel={onWithdrawCancel}
            />
        </div>
    );
};
