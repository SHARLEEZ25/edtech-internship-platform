// List of recent internships the student has applied to.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardInternship, DashboardApplication } from '@/hooks/dashboard/useStudentDashboard';
import '../../../styles/dashboard/student-dashboard.css';

interface InternshipsAppliedProps {
    applications: DashboardApplication[];
    suggestedInternship?: DashboardInternship;
}

const InternshipsApplied: React.FC<InternshipsAppliedProps> = ({ applications, suggestedInternship }) => {
    const navigate = useNavigate();
    const applicationCount = applications.length;

    return (
        <div className="stat-card">
            <h3 className="stat-card-title">Internships Applied</h3>

            {applicationCount > 0 ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <p className="stat-card-value" style={{ fontSize: '3rem', lineHeight: 1, color: '#3B82F6', fontWeight: 800, margin: 0 }}>
                            {applicationCount}
                        </p>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>
                            active applications
                        </span>
                    </div>

                    <div className="stat-card-list" style={{ gap: '0.75rem' }}>
                        {applications.slice(0, 2).map((app, index) => (
                            <div key={index} style={{
                                padding: '0.875rem 1rem',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1e293b', marginBottom: '0.125rem' }}>
                                        {app.position}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        @{app.company} • Joined 2d ago
                                    </p>
                                </div>
                                <span className={`status-badge ${app.statusClass}`}>
                                    {app.statusText}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                        <a
                            href="#"
                            className="stat-card-link"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/dashboard/student/applications');
                            }}
                        >
                            View All Applications
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                        </a>
                    </div>
                </>
            ) : (
                <div className="stat-card-empty">
                    {suggestedInternship ? (
                        /* [VISUAL STATE]: Empty State (With Rec). Shows specific internship recommendation. */
                        <div className="suggested-preview">
                            <span className="suggested-badge">Recommended Pick</span>
                            <div className="suggested-info">
                                <h4 className="suggested-title">{suggestedInternship.title}</h4>
                                <p className="suggested-company">{suggestedInternship.company}</p>
                            </div>
                            <button
                                className="btn btn-gradient btn-sm full-width mb-1"
                                onClick={() => suggestedInternship.id && navigate(`/dashboard/student/internships/${suggestedInternship.id}`)}
                            >
                                <span>View Details</span>
                            </button>
                            <button
                                className="btn btn-ghost btn-sm full-width"
                                onClick={() => navigate('/dashboard/student/internships')}
                            >
                                <span>Browse Similar</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* [VISUAL STATE]: Empty State (Generic). Shows placeholder and browse button. */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%' }}>
                                <div className="empty-icon-wrapper" style={{ marginBottom: '0.5rem' }}>
                                    <span className="material-symbols-outlined">assignment_late</span>
                                </div>
                                <p className="empty-text" style={{ marginBottom: '1.5rem' }}>No applications yet. Start your journey today!</p>

                                <div style={{
                                    background: '#f0f9ff',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    width: '100%',
                                    border: '1px solid #bae6fd',
                                    textAlign: 'left',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0ea5e9' }}>rocket_launch</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Pro Tip</span>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: '1.5' }}>
                                        Applying to at least 5 relevant positions increases your chances of getting hired by 3x.
                                    </p>
                                </div>

                                <button
                                    style={{
                                        background: '#3B82F6',
                                        color: 'white',
                                        width: '100%',
                                        height: '52px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        marginTop: 'auto',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => navigate('/dashboard/student/internships')}
                                >
                                    <span>Find Internship</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default InternshipsApplied;
