import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { type Application } from '@/api/internships.api';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { uploadApi } from '@/api/upload.api';

interface StudentApplicationDetailsVisualsProps {
    application: Application;
    isWithdrawModalOpen: boolean;
    isWithdrawing: boolean;
    onWithdrawCancel: () => void;
    onWithdrawConfirm: () => void;
    onWithdrawClick: () => void;
    timeAgo: string;
}

export const StudentApplicationDetailsVisuals: React.FC<StudentApplicationDetailsVisualsProps> = ({
    application,
    isWithdrawModalOpen,
    isWithdrawing,
    onWithdrawCancel,
    onWithdrawConfirm,
    onWithdrawClick,
    timeAgo
}) => {
    const navigate = useNavigate();


    const avatar = application.student?.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.fullName)}&background=random`;

    return (
        <div className="app-details-container">
            {/* Breadcrumb */}
            <div className="app-breadcrumb">
                <Link to="/dashboard/student/applications" className="breadcrumb-link-light">My Applications</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="app-breadcrumb-current">Application #{application.id.slice(-6).toUpperCase()}</span>
            </div>

            {/* Back Link */}
            <div className="app-back-link-wrapper">
                <button onClick={() => navigate(-1)} className="btn-back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to List
                </button>
            </div>

            {/* Main Card */}
            <div className="app-details-card">

                {/* Top Section */}
                <div className="app-card-top">
                    <span className={`status-badge-pending`} style={{
                        backgroundColor: application.status === 'SELECTED' ? '#dcfce7' :
                            application.status === 'REJECTED' ? '#fee2e2' :
                                application.status === 'INTERVIEW' ? '#f3e8ff' : '#fef9c3',
                        color: application.status === 'SELECTED' ? '#166534' :
                            application.status === 'REJECTED' ? '#991b1b' :
                                application.status === 'INTERVIEW' ? '#6b21a8' : '#854d0e'
                    }}>
                        <span className="status-dot" style={{
                            backgroundColor: application.status === 'SELECTED' ? '#16a34a' :
                                application.status === 'REJECTED' ? '#dc2626' :
                                    application.status === 'INTERVIEW' ? '#9333ea' : '#ca8a04'
                        }}></span>
                        {application.status.replace(/_/g, ' ')}
                    </span>

                    <div className="app-avatar-wrapper">
                        <img src={avatar} alt={application.fullName} className="app-avatar-img" />
                    </div>

                    <h1 className="app-candidate-name">{application.fullName}</h1>
                    <p className="app-candidate-role">{application.internship?.title || 'Unknown Role'}</p>

                    <div className="app-meta-row">
                        <span className="meta-item">
                            <span className="material-symbols-outlined">badge</span>
                            App ID: #{application.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="meta-separator">|</span>
                        <span className="meta-item">
                            <span className="material-symbols-outlined">schedule</span>
                            {timeAgo}
                        </span>
                    </div>
                </div>

                {/* Middle Section: Info Grid */}
                <div className="app-card-middle">
                    <div className="info-grid-row">
                        <div className="info-col">
                            <span className="info-label">UNIVERSITY</span>
                            <span className="info-value">{application.student?.collegeName || 'Not Specified'}</span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                {application.student?.degree}
                                {application.student?.graduationYear ? ` • Class of ${application.student.graduationYear}` : ''}
                            </span>
                        </div>
                        <div className="info-col">
                            <span className="info-label">EMAIL</span>
                            <span className="info-value">{application.email}</span>
                        </div>
                    </div>

                    <div className="info-grid-row">
                        <div className="info-col">
                            <span className="info-label">PHONE</span>
                            <span className="info-value">{application.phone || 'N/A'}</span>
                        </div>
                        <div className="info-col">
                            <span className="info-label">RESUME</span>
                            <div className="info-value">
                                {application.resumeUrl ? (
                                    <a
                                        href={uploadApi.getFileUrl(application.resumeUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>description</span>
                                        View Resume
                                    </a>
                                ) : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    {application.student?.skills && application.student.skills.length > 0 && (
                        <div className="info-skills-row" style={{ marginTop: '2rem' }}>
                            <span className="info-label">SKILLS</span>
                            <div className="skills-list">
                                {application.student.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cover Letter */}
                    {application.coverLetter && (
                        <div className="info-skills-row" style={{ marginTop: '2rem' }}>
                            <span className="info-label">COVER LETTER</span>
                            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', textAlign: 'left', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                "{application.coverLetter}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Section: Actions */}
                <div className="app-card-bottom">
                    <div className="action-buttons-row">
                        {application.internship?.recruiter?.id && (
                            <Link
                                to={`/dashboard/student/companies/${application.internship.recruiter.id}`}
                                className="btn-action-shortlist"
                                style={{ backgroundColor: '#3b82f6', textDecoration: 'none' }}
                            >
                                <span className="material-symbols-outlined">apartment</span>
                                View Company Profile
                            </Link>
                        )}

                        <button
                            className="btn-action-reject"
                            style={{ backgroundColor: '#ef4444' }}
                            onClick={onWithdrawClick}
                            disabled={isWithdrawing}
                        >
                            <span className="material-symbols-outlined">cancel</span>
                            {isWithdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                        </button>
                    </div>

                    {application.remarks && (
                        <div className="remarks-section">
                            <label className="remarks-label">Recruiter Remarks</label>
                            <div className="textarea-wrapper">
                                <p style={{
                                    padding: '1rem',
                                    background: '#fff7ed',
                                    border: '1px solid #ffedd5',
                                    borderRadius: '12px',
                                    color: '#9a3412',
                                    fontSize: '0.9rem'
                                }}>
                                    {application.remarks}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <ConfirmModal
                isOpen={isWithdrawModalOpen}
                title="Withdraw Application?"
                message="Are you sure you want to withdraw your application? This action cannot be undone and you'll need to reapply if you change your mind."
                confirmLabel="Withdraw"
                cancelLabel="Cancel"
                onConfirm={onWithdrawConfirm}
                onCancel={onWithdrawCancel}
            />
        </div>
    );
};
