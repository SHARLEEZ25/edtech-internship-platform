import React from 'react';
import type { RecruiterDashboardInterview } from '@/hooks/dashboard/useRecruiterDashboardData';
import '../../../styles/dashboard/recruiter-dashboard.css';

interface UpcomingInterviewsProps {
    interviews: RecruiterDashboardInterview[];
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ interviews }) => {
    return (
        <div className="recruiter-section-card">
            <div className="section-card-header">
                <h3 >Upcoming Interviews</h3>
                <button className="notification-btn">
                    <span className="material-symbols-outlined">calendar_today</span>
                </button>
            </div>
            <div className="interviews-section">
                <div className="interviews-list-minimal">
                    {interviews.length === 0 ? (
                        <div className="empty-interviews-text">No interviews scheduled.</div>
                    ) : (
                        interviews.map((interview) => (
                            <div key={interview.id} className="interview-item">
                                <div className="date-box">
                                    <span className="date-month">{interview.month}</span>
                                    <span className="date-day">{interview.day}</span>
                                </div>
                                <div className="interview-content">
                                    <h5>{interview.candidateName}</h5>
                                    <p className="interview-meta-text">{interview.role} • {interview.time}</p>
                                    <button className="btn-join-meeting">
                                        Join Meeting
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button className="view-calendar-cta">
                    View Calendar <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default UpcomingInterviews;
