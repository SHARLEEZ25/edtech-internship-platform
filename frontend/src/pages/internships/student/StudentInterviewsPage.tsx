import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '@/components/dashboard/student/DashboardSidebar';
import '@/styles/dashboard/student-dashboard.css';
import '@/styles/internships/student/student-interviews.css';
import { LoadingState } from '@/components/common/LoadingState';
import { useInterviews } from '@/hooks/interviews/useInterviews';

export default function StudentInterviewsPage() {
    const navigate = useNavigate();
    const { interviews, loading, fetchInterviews } = useInterviews();

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

    const getStatusClass = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'scheduled') return 'interview-badge scheduled';
        if (s === 'completed') return 'interview-badge completed';
        if (s === 'cancelled' || s === 'declined') return 'interview-badge cancelled';
        if (s === 'pending') return 'interview-badge pending';
        return 'interview-badge';
    };

    if (loading) {
        return <LoadingState fullPage />;
    }

    const scheduledCount = interviews.filter(i => i.status === 'SCHEDULED' || i.status === 'PENDING').length;

    return (
        <div className="student-dashboard">
            <div className="dashboard-container">
                <StudentSidebar />

                <main className="dashboard-main">
                    <div className="dashboard-content">
                        <div className="interviews-container">

                            {/* Header */}
                            <div className="interviews-header">
                                <div className="header-text">
                                    <h1 className="page-title">Interview Schedule</h1>
                                    <p className="page-subtitle">Track and manage all your upcoming and completed interviews.</p>
                                </div>
                                <div className="header-actions">
                                    <button className="btn-history" onClick={() => navigate('/dashboard/student/interviews/history')}>
                                        <span className="material-symbols-outlined">history</span>
                                        Past Interviews
                                    </button>
                                </div>
                            </div>

                            {interviews.length > 0 ? (
                                <>
                                    {/* Notification Banner */}
                                    {scheduledCount > 0 && (
                                        <div className="interview-notification-banner">
                                            <div className="banner-content">
                                                You have {scheduledCount} upcoming {scheduledCount === 1 ? 'interview' : 'interviews'}. Good luck!
                                            </div>
                                        </div>
                                    )}

                                    {/* Filters Bar */}
                                    <div className="interviews-filters-bar">
                                        <button className="filter-chip">
                                            Status: <span>All</span> <span className="material-symbols-outlined icon-sm">expand_more</span>
                                        </button>
                                        <button className="filter-chip">
                                            Platform: <span>All</span> <span className="material-symbols-outlined icon-sm">expand_more</span>
                                        </button>
                                        <button className="filter-chip">
                                            <span className="material-symbols-outlined icon-sm">calendar_today</span>
                                            Date: <span>All Time</span>
                                        </button>
                                    </div>

                                    {/* Grid */}
                                    <div className="interviews-grid">
                                        {interviews.map(interview => (
                                            <div key={interview.id} className="interview-card">
                                                <div className="card-header">
                                                    <div className="role-company">
                                                        <h3 className="role-title">{interview.internshipTitle || 'Position Intern'}</h3>
                                                        <p className="company-name">{interview.companyName || 'Unknown Company'}</p>
                                                    </div>
                                                    <span className={getStatusClass(interview.status)}>
                                                        {interview.status}
                                                    </span>
                                                </div>

                                                <div className="card-body">
                                                    <div className="info-row">
                                                        <span className="material-symbols-outlined info-icon">
                                                            {interview.mode === 'OFFLINE' ? 'groups' : 'video_camera_front'}
                                                        </span>
                                                        <span className="info-text">{interview.mode === 'ONLINE' ? 'Online Interview' : 'Offline / In-Person'}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="material-symbols-outlined info-icon">calendar_month</span>
                                                        <span className="info-text">
                                                            {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date(interview.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="material-symbols-outlined info-icon">
                                                            {interview.mode === 'ONLINE' ? 'videocam' : 'location_on'}
                                                        </span>
                                                        <span className="info-text">{interview.mode === 'ONLINE' ? (interview.link ? 'Google Meet / Zoom' : 'Link TBD') : 'Office Address'}</span>
                                                    </div>
                                                </div>

                                                <div className="card-footer">
                                                    {interview.status === 'SCHEDULED' && interview.link && interview.mode === 'ONLINE' && (
                                                        <button
                                                            className="btn-join"
                                                            onClick={() => window.open(interview.link!, '_blank')}
                                                        >
                                                            <span className="material-symbols-outlined">play_arrow</span>
                                                            <span>Join Meeting</span>
                                                        </button>
                                                    )}
                                                    <button className={`btn-details ${interview.status !== 'SCHEDULED' ? 'full-width' : ''}`} onClick={() => navigate(`/dashboard/student/interviews/${interview.id}`)}>
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Empty State */
                                <div className="interviews-empty-state">
                                    <div className="empty-content-wrapper">
                                        <div className="empty-illustration">
                                            <img src="/images/no_interviews.png" alt="No interviews" />
                                        </div>
                                        <h3>No interviews scheduled yet</h3>
                                        <p>Keep applying and opportunities will appear. Your next big chance is just an application away!</p>
                                        <button className="btn-browse-internships" onClick={() => navigate('/dashboard/student/internships')}>
                                            Browse Internships
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
