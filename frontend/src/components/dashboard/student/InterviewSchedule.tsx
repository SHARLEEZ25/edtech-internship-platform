import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardInterview } from '@/hooks/dashboard/useStudentDashboard';
import '../../../styles/dashboard/student-dashboard.css';

interface InterviewScheduleProps {
    interviews: DashboardInterview[];
}

const InterviewSchedule: React.FC<InterviewScheduleProps> = ({ interviews }) => {
    const navigate = useNavigate();
    const nextInterview = interviews.length > 0 ? interviews[0] : null;

    return (
        <div className="stat-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {nextInterview ? (
                <>
                    <div style={{
                        background: '#f0f9ff',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        border: '1px solid #bae6fd',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'white',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0ea5e9',
                                boxShadow: '0 4px 10px rgba(14, 165, 233, 0.1)',
                                flexShrink: 0
                            }}>
                                <span className="material-symbols-outlined">calendar_month</span>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#0c4a6e' }}>
                                    {nextInterview.position}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0284c7' }}>
                                    {nextInterview.company}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(14, 165, 233, 0.2)', display: 'flex', gap: '1.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATE</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>{nextInterview.date}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIME</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>{nextInterview.time}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <button
                            style={{
                                backgroundColor: '#4A85F6',
                                color: 'white',
                                width: '100%',
                                height: '48px',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '0.9375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 10px 20px rgba(74, 133, 246, 0.2)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>videocam</span>
                            Join Meeting
                        </button>

                        <a
                            href="#"
                            style={{
                                color: '#64748b',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.25rem',
                                marginTop: '1rem'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/dashboard/student/interviews');
                            }}
                        >
                            View All Interviews
                        </a>
                    </div>
                </>
            ) : (
                <>
                    <div className="empty-interview-state" style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '1rem', textAlign: 'center' }}>
                        <img
                            src="/images/no_interviews.png"
                            alt="No Interviews Scheduled"
                            style={{
                                width: '100%',
                                maxWidth: '220px',
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                        />

                        <div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                                No interviews scheduled yet
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
                                Keep applying and opportunities will appear. Your next big chance is just an application away!
                            </p>
                        </div>

                        <button
                            style={{
                                background: '#3B82F6',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                borderRadius: '9999px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                                transition: 'transform 0.2s ease'
                            }}
                            onClick={() => navigate('/dashboard/student/internships')}
                        >
                            Browse Internships
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                        </button>
                    </div>
                </>
            )}
        </div >
    );
};

export default InterviewSchedule;
