import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { useRecruiterApplication } from '@/hooks/internships/recruiter/useRecruiterApplication';
import { useInterviews } from '@/hooks/interviews/useInterviews';
import { LoadingState } from '@/components/common/LoadingState';
import { Avatar } from '@/components/common/Avatar';
import { toast } from 'react-hot-toast';
import '@/styles/dashboard/recruiter-dashboard.css';
import '@/styles/internships/recruiter/application-details.css';

type ActionType = 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'OFFER_SENT' | 'OFFER_ACCEPTED' | 'HIRED' | 'OFFER_DECLINED';

export default function RecruiterApplicationDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { application, loading, error, handleStatusUpdate, updating, remarks, handleRemarksChange, handleRemarksSave, savingRemarks } = useRecruiterApplication(id);
    const { interviews, fetchInterviews, completeInterview, loading: interviewLoading } = useInterviews();

    const [selectedAction, setSelectedAction] = useState<ActionType>('SHORTLISTED');
    const [activeInterview, setActiveInterview] = useState<any>(null);
    const [fullInternship, setFullInternship] = useState<any>(null);
    const [outcome, setOutcome] = useState<'SELECTED' | 'REJECTED' | 'NEXT_ROUND'>('SELECTED');
    const [feedback, setFeedback] = useState('');

    const loadInterviews = useCallback(async () => {
        if (application?.status === 'INTERVIEW') {
            try {
                await fetchInterviews();
            } catch (err) {
                console.error("Failed to fetch interview details", err);
            }
        }
    }, [application?.status, fetchInterviews]);

    useEffect(() => {
        loadInterviews();
    }, [loadInterviews]);

    // Fetch full internship details when application is loaded
    useEffect(() => {
        const fetchFullInternship = async () => {
            if (application?.internshipId) {
                try {
                    const { internshipsApi } = await import('@/api/internships.api');
                    const response = await internshipsApi.getInternshipById(application.internshipId);
                    setFullInternship(response.data.data);
                } catch (err) {
                    console.error("Failed to fetch full internship details:", err);
                }
            }
        };
        fetchFullInternship();
    }, [application?.internshipId]);

    useEffect(() => {
        if (interviews.length > 0) {
            // Find the most relevant interview (latest that isn't COMPLETED)
            const relevant = interviews
                .filter((inv: any) => inv.applicationId === id)
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .find((inv: any) => ['PENDING', 'SCHEDULED', 'CONFIRMED', 'CANCELLED'].includes(inv.status));

            setActiveInterview(relevant);
        }
    }, [interviews, id]);

    const handleCompleteInterview = async () => {
        if (!activeInterview) return;
        try {
            await completeInterview(activeInterview.id);
            toast.success('Interview completed successfully');
            setActiveInterview(null);
            navigate(0); // Refresh to update application status
        } catch (err: any) {
            toast.error(err.message || 'Failed to complete interview');
        }
    };

    // Sync status with toggle
    useEffect(() => {
        if (application?.status) {
            const status = application.status;
            if (['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED', 'OFFER_DECLINED'].includes(status)) {
                setSelectedAction(status as ActionType);
            } else if (status === 'APPLIED' || status === 'UNDER_REVIEW') {
                setSelectedAction('SHORTLISTED');
            }
        }
    }, [application?.status]);

    if (loading) {
        return (
            <div className="recruiter-dashboard-container">
                <RecruiterSidebar />
                <main className="recruiter-main">
                    <LoadingState />
                </main>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="recruiter-dashboard-container">
                <RecruiterSidebar />
                <main className="recruiter-main">
                    <div className="error-state">
                        <h2>Application not found</h2>
                        <button onClick={() => navigate(-1)} className="btn-back-link">Go Back</button>
                    </div>
                </main>
            </div>
        );
    }

    const getActionConfig = (action: ActionType) => {
        switch (action) {
            case 'SHORTLISTED':
                return { label: 'Shortlist Candidate', icon: 'check_circle', className: 'btn-action-shortlist' };
            case 'INTERVIEW':
                if (activeInterview) {
                    if (activeInterview.status === 'CANCELLED') {
                        return { label: 'Re-Schedule Interview', icon: 'restart_alt', className: 'btn-action-interview' };
                    }
                    const isConfirmed = activeInterview.status === 'SCHEDULED' || activeInterview.status === 'CONFIRMED';
                    return {
                        label: isConfirmed ? 'Interview Scheduled' : 'Interview Request Sent',
                        icon: isConfirmed ? 'event_available' : 'pending_actions',
                        className: 'btn-action-interview'
                    };
                }
                return { label: 'Schedule Interview', icon: 'calendar_add_on', className: 'btn-action-interview' };
            case 'OFFER_SENT':
                return { label: 'Offer Sent', icon: 'mark_email_read', className: 'btn-action-offer' };
            case 'OFFER_ACCEPTED':
                return { label: 'Offer Accepted', icon: 'verified', className: 'btn-action-success' };
            case 'HIRED':
                return { label: 'Hired', icon: 'handshake', className: 'btn-action-success' };
            case 'OFFER_DECLINED':
                return { label: 'Offer Declined', icon: 'thumb_down', className: 'btn-action-reject' };
            case 'SELECTED':
                return { label: 'Select Candidate', icon: 'celebration', className: 'btn-action-select' };
            case 'REJECTED':
                return { label: 'Reject Application', icon: 'cancel', className: 'btn-action-reject' };
            default:
                return { label: 'Update Status', icon: 'update', className: 'btn-action-primary' };
        }
    };

    const actionConfig = getActionConfig(selectedAction);

    const handleActionClick = () => {
        if (selectedAction === 'INTERVIEW') {
            if (activeInterview && activeInterview.status !== 'CANCELLED') {
                toast.error('An interview is already scheduled or pending. Please complete or cancel it before scheduling again.');
                return;
            }
            navigate(`/dashboard/recruiter/interviews/schedule?applicationId=${application.id}${activeInterview?.status === 'CANCELLED' ? '&reschedule=true' : ''}`);
        } else if (selectedAction === 'SELECTED') {
            // "Hire" clicks now trigger Offer state instead of direct status update
            handleStatusUpdate('SELECTED');
        } else {
            handleStatusUpdate(selectedAction);
        }
    };

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main">
                <div className="app-details-container">

                    {/* Header Breadcrumb */}
                    <div className="app-breadcrumb">
                        <Link to="/dashboard/recruiter/applications" className="breadcrumb-link-light">Applications</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="app-breadcrumb-current">Review Application #{application.id.slice(0, 8)}</span>
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
                            <div className="app-card-header-row">
                                <span className={`status-badge-${application.status.toLowerCase().replace('_', '-')}`}>
                                    <span className="status-dot"></span> {application.status.replace('_', ' ')}
                                </span>

                                {/* Action Toggle */}
                                <button
                                    className={`toggle-option ${selectedAction === 'SHORTLISTED' ? 'active' : ''}`}
                                    onClick={() => setSelectedAction('SHORTLISTED')}
                                    disabled={application.status === 'OFFER_SENT' || application.status === 'OFFER_ACCEPTED' || application.status === 'HIRED'}
                                >Shortlist</button>
                                <button
                                    className={`toggle-option ${selectedAction === 'INTERVIEW' ? 'active' : ''}`}
                                    onClick={() => setSelectedAction('INTERVIEW')}
                                    disabled={application.status === 'OFFER_SENT' || application.status === 'OFFER_ACCEPTED' || application.status === 'HIRED'}
                                >Interview</button>
                                <button
                                    className={`toggle-option ${selectedAction === 'SELECTED' ? 'active' : ''}`}
                                    onClick={() => setSelectedAction('SELECTED')}
                                    disabled={application.status === 'OFFER_SENT' || application.status === 'OFFER_ACCEPTED' || application.status === 'HIRED'}
                                >Select</button>
                                <button
                                    className={`toggle-option ${selectedAction === 'REJECTED' ? 'active' : ''}`}
                                    onClick={() => setSelectedAction('REJECTED')}
                                    disabled={application.status === 'OFFER_SENT' || application.status === 'OFFER_ACCEPTED' || application.status === 'HIRED'}
                                >Reject</button>
                            </div>
                        </div>

                        <div className="app-avatar-wrapper">
                            <Avatar
                                src={application.student?.user?.profilePicture}
                                name={application.fullName}
                                size="xl"
                                className="app-avatar-img"
                            />
                        </div>

                        <h1 className="app-candidate-name">{application.fullName}</h1>
                        <p className="app-candidate-role">{application.internship?.title || 'Internship Role'}</p>

                        <div className="app-meta-row">
                            <span className="meta-item">
                                <span className="material-symbols-outlined">badge</span>
                                App ID: #{application.id.slice(0, 8)}
                            </span>
                            <span className="meta-separator">|</span>
                            <span className="meta-item">
                                <span className="material-symbols-outlined">schedule</span>
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Interview Section */}
                    {activeInterview && (
                        <div className="app-card-middle" style={{
                            borderTop: activeInterview.status === 'PENDING' ? '2px solid #f59e0b' :
                                activeInterview.status === 'CANCELLED' ? '2px solid #ef4444' : '2px solid #9333ea',
                            backgroundColor: activeInterview.status === 'PENDING' ? 'rgba(245, 158, 11, 0.03)' :
                                activeInterview.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(147, 51, 234, 0.03)',
                            padding: '24px'
                        }}>

                            {activeInterview.status === 'PENDING' ? (
                                <div className="pending-interview-info">
                                    <h3 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px' }}>
                                        <span className="material-symbols-outlined">pending</span>
                                        Awaiting Confirmation
                                    </h3>
                                    <p style={{ margin: '8px 0', color: '#64748b' }}>
                                        You've requested an interview for <strong>{new Date(activeInterview.date).toLocaleDateString()}</strong>.
                                        We'll notify you once the student accepts.
                                    </p>
                                </div>
                            ) : activeInterview.status === 'CANCELLED' ? (
                                <div className="cancelled-interview-info">
                                    <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px' }}>
                                        <span className="material-symbols-outlined">event_busy</span>
                                        Interview Cancelled
                                    </h3>
                                    <p style={{ margin: '8px 0', color: '#64748b' }}>
                                        The student declined the interview.
                                        {activeInterview.cancellationReason && (
                                            <span style={{ display: 'block', marginTop: '4px', fontStyle: 'italic' }}>
                                                Reason: "{activeInterview.cancellationReason}"
                                            </span>
                                        )}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/dashboard/recruiter/interviews/schedule?applicationId=${application.id}&reschedule=true`)}
                                        style={{ color: '#3b82f6', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: '600', textDecoration: 'underline', fontSize: '14px' }}
                                    >
                                        Schedule Again
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Confirmed Interview - Logic to show Feedback vs Meeting Info */}
                                    {new Date() < new Date(activeInterview.date) ? (
                                        <div className="upcoming-interview-info">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 style={{ color: '#9333ea', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px' }}>
                                                        <span className="material-symbols-outlined">event_available</span>
                                                        Confirmed Interview
                                                    </h3>
                                                    <p style={{ margin: '8px 0', color: '#64748b' }}>
                                                        Scheduled for <strong>{new Date(activeInterview.date).toLocaleDateString()}</strong> at <strong>{new Date(activeInterview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.
                                                    </p>
                                                </div>
                                                {activeInterview.link && (activeInterview.mode === 'ONLINE' || activeInterview.mode === 'VIRTUAL') && (
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                                        onClick={() => window.open(activeInterview.link, '_blank')}
                                                    >
                                                        Join Meeting
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-purple-100 italic text-sm text-slate-500">
                                                Note: The finalize options will appear here once the interview starts.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="finalize-interview-form">
                                            <div className="completion-header" style={{ marginBottom: '1.5rem' }}>
                                                <h3 style={{ color: '#9333ea', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                                    <span className="material-symbols-outlined">verified</span>
                                                    Finalize Interview
                                                </h3>
                                                <p className="text-muted text-sm" style={{ margin: '4px 0 0 0' }}>Record the interview outcome and provide feedback.</p>
                                            </div>

                                            <div className="outcome-selection" style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                                                <button
                                                    className={`btn-outcome ${outcome === 'SELECTED' ? 'selected' : ''}`}
                                                    onClick={() => setOutcome('SELECTED')}
                                                    style={outcome === 'SELECTED' ? { backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '600' } : { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' }}
                                                >Hire</button>
                                                <button
                                                    className={`btn-outcome ${outcome === 'REJECTED' ? 'selected' : ''}`}
                                                    onClick={() => setOutcome('REJECTED')}
                                                    style={outcome === 'REJECTED' ? { backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '600' } : { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' }}
                                                >Reject</button>
                                                <button
                                                    className={`btn-outcome ${outcome === 'NEXT_ROUND' ? 'selected' : ''}`}
                                                    onClick={() => setOutcome('NEXT_ROUND')}
                                                    style={outcome === 'NEXT_ROUND' ? { backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '600' } : { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' }}
                                                >Next Round</button>
                                            </div>

                                            <div className="feedback-section">
                                                <label className="info-label" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>FEEDBACK</label>
                                                <textarea
                                                    className="remarks-textarea"
                                                    style={{ height: '100px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                                                    placeholder="Add technical evaluation and final thoughts..."
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                ></textarea>
                                            </div>

                                            <button
                                                className="btn-action-primary"
                                                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#9333ea', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                                onClick={handleCompleteInterview}
                                                disabled={interviewLoading}
                                            >
                                                {interviewLoading ? 'Submitting...' : 'Complete Interview & Update Status'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Offer Preview Card - Appears when SELECTED or OFFER_SENT */}
                    {(application.status === 'SELECTED') && (
                        <div className="app-card-middle" style={{
                            borderTop: '2px solid #10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.03)',
                            padding: '24px'
                        }}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px' }}>
                                        <span className="material-symbols-outlined">description</span>
                                        Offer Confirmation Preview
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                                        Verify the details below before sending the official offer letter to {application.fullName}.
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                    Candidate Selected
                                </span>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px',
                                marginBottom: '24px',
                                padding: '16px',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Role</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>{fullInternship?.title || application.internship?.title}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Duration</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>
                                        {fullInternship?.durationValue} {fullInternship?.durationUnit === 'MONTHS' ? 'Months' : fullInternship?.durationUnit === 'WEEKS' ? 'Weeks' : fullInternship?.durationUnit}
                                    </p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Stipend</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#10b981' }}>
                                        {fullInternship?.stipendMin ? `₹ ${fullInternship.stipendMin.toLocaleString('en-IN')}` : 'Unpaid'}
                                        {fullInternship?.stipendMax ? ` - ₹ ${fullInternship.stipendMax.toLocaleString('en-IN')}` : ''}
                                        {fullInternship?.stipendCurrency && fullInternship?.stipendPeriod ? ` ${fullInternship.stipendCurrency}/${fullInternship.stipendPeriod === 'MONTH' ? 'mo' : fullInternship.stipendPeriod.toLowerCase()}` : ''}
                                    </p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Type</label>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#1e293b' }}>
                                        {fullInternship?.internshipType?.replace('_', ' ')} • {fullInternship?.workType?.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="btn-action-primary"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                                }}
                                onClick={() => {
                                    toast.success('Official Offer Letter Generated & Sent!');
                                    // In a real app, this would call offersApi.send()
                                    handleStatusUpdate('OFFER_SENT');
                                }}
                            >
                                <span className="material-symbols-outlined">send</span>
                                Generate & Send Official Offer
                            </button>
                        </div>
                    )}

                    {/* Offer Sent Card - Appears when status is OFFER_SENT */}
                    {(application.status === 'OFFER_SENT') && (
                        <div className="app-card-middle" style={{
                            borderTop: '2px solid #3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.03)',
                            padding: '24px'
                        }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px' }}>
                                        <span className="material-symbols-outlined">mark_email_read</span>
                                        Official Offer Sent
                                    </h3>
                                    <p style={{ margin: '8px 0', color: '#64748b' }}>
                                        The offer has been sent to <strong>{application.fullName}</strong>. We are now awaiting their acceptance or decline.
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                                    Awaiting Response
                                </span>
                            </div>
                            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 flex items-center gap-3">
                                <span className="material-symbols-outlined text-blue-500">info</span>
                                <p className="text-sm text-slate-600 m-0">
                                    If the candidate accepts, the status will automatically update to <strong>OFFER ACCEPTED</strong>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Middle Section: Info Grid */}
                    <div className="app-card-middle">
                        <div className="info-grid-row">
                            <div className="info-col">
                                <span className="info-label">UNIVERSITY</span>
                                <span className="info-value">{application.student?.collegeName || 'N/A'}</span>
                            </div>
                            <div className="info-col">
                                <span className="info-label">RESUME</span>
                                <span className="info-value">
                                    {application.resumeUrl ? (
                                        <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-link">
                                            View Resume <span className="material-symbols-outlined icon-sm">open_in_new</span>
                                        </a>
                                    ) : (
                                        <span className="text-muted">Not provided</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="info-skills-row">
                            <span className="info-label">SKILLS</span>
                            <div className="skills-list">
                                {application.student?.skills && application.student.skills.length > 0 ? (
                                    application.student.skills.map((skill: any, index: number) => (
                                        <span key={index} className="skill-tag">{typeof skill === 'string' ? skill : skill.name}</span>
                                    ))
                                ) : (
                                    <span className="text-muted">No specific skills listed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Actions */}
                    <div className="app-card-bottom">
                        <div className="action-buttons-row">
                            <button
                                className={`btn-action-dynamic ${selectedAction.toLowerCase()} ${activeInterview && selectedAction === 'INTERVIEW' ? 'disabled' : ''}`}
                                onClick={handleActionClick}
                                disabled={
                                    updating ||
                                    (application.status === selectedAction && selectedAction !== 'INTERVIEW') ||
                                    (activeInterview && selectedAction === 'INTERVIEW') ||
                                    ['OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED', 'OFFER_DECLINED'].includes(application.status)
                                }
                            >
                                <span className="material-symbols-outlined">{actionConfig.icon}</span>
                                {actionConfig.label}
                            </button>
                            {activeInterview && selectedAction === 'INTERVIEW' && (
                                <p className="reschedule-note" style={{ marginTop: '8px', fontSize: '13px', textAlign: 'center' }}>
                                    <span className="text-slate-500">Want to change the time? </span>
                                    <button
                                        onClick={() => navigate(`/dashboard/recruiter/interviews/schedule?applicationId=${application.id}&reschedule=true`)}
                                        style={{ color: '#3b82f6', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}
                                    >
                                        Reschedule Interview
                                    </button>
                                </p>
                            )}
                        </div>

                        <div className="remarks-section">
                            <div className="remarks-header">
                                <label className="remarks-label">Remarks (Optional)</label>
                                {savingRemarks && <span className="saving-text">Saving...</span>}
                            </div>
                            <div className="textarea-wrapper">
                                <textarea
                                    className="remarks-textarea"
                                    placeholder="Add any internal notes about this decision..."
                                    maxLength={500}
                                    value={remarks}
                                    onChange={(e) => handleRemarksChange(e.target.value)}
                                    onBlur={handleRemarksSave}
                                ></textarea>
                                <span className="char-count">{remarks.length}/500</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
