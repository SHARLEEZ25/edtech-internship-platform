import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '@/components/dashboard/student/DashboardSidebar';
import '@/styles/dashboard/student-dashboard.css';
import '@/styles/internships/student/student-interviews.css';
import { LoadingState } from '@/components/common/LoadingState';
import { useInterviews } from '@/hooks/interviews/useInterviews';
import { toast } from 'react-hot-toast';
import { CancellationModal } from '@/components/common/CancellationModal';

export default function StudentInterviewDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getInterviewById, respondToInterview, loading: actionLoading } = useInterviews();
    const [interview, setInterview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            setLoading(true);
            const data = await getInterviewById(id);
            if (data) {
                setInterview(data);
            }
            setLoading(false);
        };
        fetchDetail();
    }, [id, getInterviewById]);

    const handleResponse = async (action: 'ACCEPT' | 'DECLINE') => {
        if (!id) return;
        try {
            await respondToInterview(id, { response: action });
            toast.success(`Interview ${action.toLowerCase()}ed successfully`);
            // Refresh detail
            const updated = await getInterviewById(id);
            setInterview(updated);
        } catch (err: any) {
            toast.error(err.message || 'Failed to update response');
        }
    };

    const handleDeclineScheduled = async (_reason: string) => {
        if (!id) return;
        setIsDeclineModalOpen(false);
        try {
            await respondToInterview(id, { response: 'DECLINE' });
            toast.success("Interview declined successfully");
            // Refresh detail
            const updated = await getInterviewById(id);
            if (updated) setInterview(updated);
        } catch (err: any) {
            toast.error(err.message || "Failed to decline interview");
        }
    };

    if (loading) {
        return <LoadingState fullPage />;
    }

    if (!interview) {
        return (
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <StudentSidebar />
                    <main className="dashboard-main flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold">Interview not found</h2>
                            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const isPending = interview.status === 'PENDING';
    const isScheduled = interview.status === 'SCHEDULED';

    return (
        <div className="student-dashboard">
            <div className="dashboard-container">
                <StudentSidebar />

                <main className="dashboard-main">
                    <div className="dashboard-content">
                        <div className="interview-exact-details-container">

                            {/* Header Section */}
                            <div className="exact-header-section">
                                <h1 className="exact-page-title">Interview Details</h1>
                                <p className="exact-page-subtitle">
                                    {isPending ? 'Action Required: Please respond to this interview request.' : 'Please be ready on time and check your audio/video setup.'}
                                </p>
                            </div>

                            {/* Main Detail Card */}
                            <div className="exact-detail-card">

                                {/* Card Header */}
                                <div className="card-top-row">
                                    <div className="company-info">
                                        <h2 className="exact-company-name">{interview.companyName || 'Unknown Company'}</h2>
                                        <p className="exact-role-name">{interview.internshipTitle || 'Position Intern'}</p>
                                    </div>
                                    <div className={`card-status-badge ${interview.status.toLowerCase()}`}>
                                        {interview.status}
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="exact-info-grid">
                                    <div className="exact-info-item">
                                        <div className="exact-icon-box">
                                            <span className="material-symbols-outlined">calendar_today</span>
                                        </div>
                                        <div className="exact-info-content">
                                            <span className="info-label">Date & Time</span>
                                            <span className="info-value">
                                                {new Date(interview.date).toLocaleString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                    hour: 'numeric', minute: '2-digit', hour12: true
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="exact-info-item">
                                        <div className="exact-icon-box">
                                            <span className="material-symbols-outlined">videocam</span>
                                        </div>
                                        <div className="exact-info-content">
                                            <span className="info-label">Mode</span>
                                            <span className="info-value">{interview.mode === 'ONLINE' ? 'Online Interview' : 'Office/Offline'}</span>
                                        </div>
                                    </div>

                                    <div className="exact-info-item full-width">
                                        <div className="exact-icon-box">
                                            <span className="material-symbols-outlined">link</span>
                                        </div>
                                        <div className="exact-info-content">
                                            <span className="info-label">Meeting Link / Address</span>
                                            <div className="link-with-copy">
                                                {interview.mode === 'ONLINE' && interview.link ? (
                                                    <>
                                                        <a href={interview.link} target="_blank" rel="noreferrer" className="meeting-link-text">
                                                            {interview.link}
                                                        </a>
                                                        <span className="material-symbols-outlined copy-icon-small" onClick={() => {
                                                            navigator.clipboard.writeText(interview.link);
                                                            toast.success('Link copied');
                                                        }}>content_copy</span>
                                                    </>
                                                ) : (
                                                    <span className="info-value">{interview.link || 'Discussed during call'}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="exact-info-item">
                                        <div className="exact-icon-box">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <div className="exact-info-content">
                                            <span className="info-label">Managed by</span>
                                            <span className="info-value">Recruiter</span>
                                        </div>
                                    </div>

                                    <div className="exact-info-item">
                                        <div className="exact-icon-box">
                                            <span className="material-symbols-outlined">schedule</span>
                                        </div>
                                        <div className="exact-info-content">
                                            <span className="info-label">Duration</span>
                                            <span className="info-value">{interview.duration} Minutes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="horizontal-divider"></div>

                                {/* Instructions / Notes */}
                                {(interview.notes || interview.mode === 'ONLINE') && (
                                    <div className="exact-instructions-section">
                                        <h3 className="exact-section-title">Interview Details & Instructions</h3>
                                        <ul className="exact-check-list">
                                            {interview.notes && (
                                                <li className="mb-2">
                                                    <span className="material-symbols-outlined check-bullet">info</span>
                                                    Notes: {interview.notes}
                                                </li>
                                            )}
                                            <li>
                                                <span className="material-symbols-outlined check-bullet">check_circle</span>
                                                Ensure a stable internet connection for a smooth video call.
                                            </li>
                                            <li>
                                                <span className="material-symbols-outlined check-bullet">check_circle</span>
                                                Find a quiet, well-lit space free from distractions.
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="exact-actions-row">
                                    {isPending ? (
                                        <>
                                            <button
                                                className="btn-join-now"
                                                onClick={() => handleResponse('ACCEPT')}
                                                disabled={actionLoading}
                                                style={{ backgroundColor: '#10b981' }} // Green for accept
                                            >
                                                <span className="material-symbols-outlined">check_circle</span>
                                                Accept Request
                                            </button>
                                            <button
                                                className="btn-add-calendar"
                                                onClick={() => handleResponse('DECLINE')}
                                                disabled={actionLoading}
                                                style={{ color: '#ef4444', borderColor: '#ef4444' }} // Red for decline
                                            >
                                                <span className="material-symbols-outlined">cancel</span>
                                                Decline
                                            </button>
                                        </>
                                    ) : isScheduled ? (
                                        <>
                                            {interview.link && (
                                                <a href={interview.link} target="_blank" rel="noopener noreferrer" className="btn-join-now no-underline flex items-center justify-center">
                                                    <span className="material-symbols-outlined">videocam</span>
                                                    Join Interview
                                                </a>
                                            )}
                                            <button className="btn-add-calendar">
                                                <span className="material-symbols-outlined">calendar_add_on</span>
                                                Add to Calendar
                                            </button>
                                            <button
                                                className="btn-add-calendar"
                                                onClick={() => setIsDeclineModalOpen(true)}
                                                disabled={actionLoading}
                                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                            >
                                                <span className="material-symbols-outlined">cancel</span>
                                                Decline Interview
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`status-badge-bottom ${interview.status.toLowerCase()}`}>
                                            Status: {interview.status}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <CancellationModal
                            isOpen={isDeclineModalOpen}
                            title="Decline Interview"
                            message={`Are you sure you want to decline the interview with ${interview.companyName}? This action cannot be undone.`}
                            onConfirm={handleDeclineScheduled}
                            onCancel={() => setIsDeclineModalOpen(false)}
                            confirmLabel="Decline Now"
                            cancelLabel="Keep Interview"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
