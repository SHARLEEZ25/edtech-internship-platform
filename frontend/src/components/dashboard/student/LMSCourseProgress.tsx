// Displays the student's current LMS course progress
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/dashboard/student-dashboard.css';

interface LMSCourseProgressProps {
    courseName?: string;
    progress?: number;
}

const LMSCourseProgress: React.FC<LMSCourseProgressProps> = ({
    courseName = "Advanced React",
    progress = 0, // Default to 0 for safety, but parent usually passes value
}) => {
    const navigate = useNavigate();
    const isStarted = progress > 0;

    const handleContinueLearning = () => {
        navigate('#'); // Update with actual LMS route once available
    };

    return (
        <div className="stat-card lms-card">
            <h3 className="stat-card-title">LMS Courses</h3>
            <div className="progress-card-center" style={{ gap: '0.5rem' }}>
                <div className="progress-circle-container">
                    <svg className="progress-circle" width="120" height="120" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path
                            className="progress-circle-bg"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="3"
                        />
                        <path
                            className="progress-circle-fill"
                            strokeDasharray={`${progress}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={isStarted ? "#8b5cf6" : "#cbd5e1"}
                            strokeWidth="3"
                            style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ paddingLeft: '0.2rem', fontSize: '1.5rem', fontWeight: 600, color: isStarted ? '#1986ecff' : '#64748b', lineHeight: 1 }}>{progress}%</span>
                    </div>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', marginTop: '-0.25rem' }}>
                    {isStarted ? 'COMPLETED' : 'NOT STARTED'}
                </span>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0.25rem 0 0' }}>{courseName}</h4>

                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.25rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '0' }}>{isStarted ? '12h' : '0h'}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>SPENT</p>
                    </div>
                    <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '0' }}>{isStarted ? '4/12' : '0/12'}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>MODULES</p>
                    </div>
                </div>
            </div>
            {/* [VISUAL STATE]: Primary Action. Button to continue learning. */}
            <button
                style={{
                    background: isStarted ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#3B82F6',
                    color: 'white',
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '16px',
                    marginTop: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isStarted ? '0 10px 20px rgba(139, 92, 246, 0.2)' : '0 10px 20px rgba(59, 130, 246, 0.2)',
                    transition: 'all 0.2s ease'
                }}
                onClick={handleContinueLearning}
            >
                {isStarted ? 'Continue Learning' : 'Start Learning'}
            </button>
        </div>
    );
};

export default LMSCourseProgress;
