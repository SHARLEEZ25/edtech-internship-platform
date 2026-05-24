// Displays personalized internship recommendations for the student.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardInternship } from '@/hooks/dashboard/useStudentDashboard';
import '../../../styles/dashboard/student-dashboard.css';

interface RecommendedInternshipsProps {
    internships: DashboardInternship[];
}

const RecommendedInternships: React.FC<RecommendedInternshipsProps> = ({ internships }) => {
    const navigate = useNavigate();

    // Take the first 3 internships to display
    const displayInternships = internships.slice(0, 3);

    return (
        <div className="recommended-section">
            <h3 className="recommended-title">Recommended Internships</h3>

            <div className="recommended-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {displayInternships.map((internship, index) => (
                    <div key={internship.id || index} style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#94a3b8';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                        onClick={() => internship.id && navigate(`/dashboard/student/internships/${internship.id}`)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: '#f1f5f9',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                color: '#64748b',
                                fontWeight: 700,
                                flexShrink: 0
                            }}>
                                {internship.company.charAt(0)}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
                                    {internship.title}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                                    <span style={{ fontWeight: 500 }}>{internship.company}</span>
                                    <span style={{ fontSize: '0.5rem', color: '#cbd5e1' }}>●</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                                        {internship.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                                background: '#f0f9ff',
                                color: '#0369a1',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '0.35rem 0.85rem',
                                borderRadius: '9999px',
                                whiteSpace: 'nowrap'
                            }}>
                                New
                            </span>
                            <span className="material-symbols-outlined" style={{ color: '#cbd5e1' }}>chevron_right</span>
                        </div>
                    </div>
                ))}

                {internships.length === 0 && (
                    <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', width: '100%', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ width: '48px', height: '48px', background: '#e2e8f0', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>No recommendations yet</h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Complete your profile to get personalized matches!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendedInternships;
