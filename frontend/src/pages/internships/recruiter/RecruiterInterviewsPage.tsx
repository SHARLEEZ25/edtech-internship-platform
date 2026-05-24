import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { useRecruiterApplications } from '@/hooks/internships/recruiter/useRecruiterApplications';
import { useInterviews } from '@/hooks/interviews/useInterviews';
import { LoadingState } from '@/components/common/LoadingState';
import { Avatar } from '@/components/common/Avatar';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function RecruiterInterviewsPage() {
    const navigate = useNavigate();
    const { applications, loading: appsLoading } = useRecruiterApplications();
    const { interviews, loading: interviewsLoading, fetchInterviews } = useInterviews();
    const [activeTab, setActiveTab] = useState<'SCHEDULED' | 'TO_SCHEDULE'>('SCHEDULED');

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

    // Filter candidates who are ready to be scheduled (SHORTLISTED or INTERVIEW status) 
    // and don't have a SCHEDULED interview yet
    const candidatesToSchedule = useMemo(() => {
        return applications.filter(app => {
            const isReadyStatus = ['SHORTLISTED', 'INTERVIEW'].includes(app.status);
            const hasExistingRequest = interviews.some(inv =>
                inv.applicationId === app.id &&
                ['SCHEDULED', 'PENDING', 'CONFIRMED'].includes(inv.status)
            );
            return isReadyStatus && !hasExistingRequest;
        });
    }, [applications, interviews]);

    // Filter active interviews (Pending or Scheduled)
    const activeInterviews = useMemo(() => {
        return interviews
            .filter(inv => {
                const isCompletedStatus = ['SELECTED', 'REJECTED', 'OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED', 'OFFER_DECLINED', 'WITHDRAWN'].includes((inv as any).applicationStatus);
                return !isCompletedStatus && (inv.status === 'SCHEDULED' || inv.status === 'PENDING');
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [interviews]);

    if (appsLoading || interviewsLoading) {
        return (
            <div className="recruiter-dashboard-container">
                <RecruiterSidebar />
                <main className="recruiter-main">
                    <LoadingState />
                </main>
            </div>
        );
    }

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />

            <main className="recruiter-main">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Interviews Hub</h1>
                            <p className="text-slate-500">Manage your candidate schedule and upcoming meetings.</p>
                        </div>
                    </div>

                    {/* Dashboard Style Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-slate-200">
                        <button
                            className={`pb-4 px-2 font-medium transition-all ${activeTab === 'SCHEDULED' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
                            onClick={() => setActiveTab('SCHEDULED')}
                        >
                            Upcoming & Requests ({activeInterviews.length})
                        </button>
                        <button
                            className={`pb-4 px-2 font-medium transition-all ${activeTab === 'TO_SCHEDULE' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
                            onClick={() => setActiveTab('TO_SCHEDULE')}
                        >
                            Ready to Schedule ({candidatesToSchedule.length})
                        </button>
                    </div>

                    {activeTab === 'SCHEDULED' ? (
                        <div className="grid gap-4">
                            {activeInterviews.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-slate-400 text-3xl">calendar_today</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No interviews scheduled</h3>
                                    <p className="text-slate-500 mb-6">Select a shortlisted candidate to get started.</p>
                                    <button
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                                        onClick={() => setActiveTab('TO_SCHEDULE')}
                                    >
                                        View Shortlisted Candidates
                                    </button>
                                </div>
                            ) : (
                                activeInterviews.map((interview: any) => {
                                    const isScheduled = interview.status === 'SCHEDULED' || interview.status === 'CONFIRMED';
                                    const isOnline = interview.mode === 'ONLINE' || interview.mode === 'VIRTUAL';

                                    return (
                                        <div key={interview.id} className="bg-white p-6 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <Avatar src={interview.studentProfilePic} name={interview.studentName} size="lg" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-900">{interview.studentName}</h4>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isScheduled
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {isScheduled ? 'Confirmed' : 'Pending Student'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500">{interview.internshipTitle} • {new Date(interview.date).toLocaleDateString()} at {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <span className={`mt-2 inline-block px-2 py-1 text-xs font-bold rounded ${isOnline ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>
                                                        {interview.mode}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                                                    onClick={() => navigate(`/dashboard/recruiter/applications/${interview.applicationId}`)}
                                                >
                                                    View Application
                                                </button>
                                                {(() => {
                                                    const endTime = new Date(new Date(interview.date).getTime() + (interview.duration || 30) * 60000);
                                                    const isExpired = new Date() > endTime || interview.status === 'EXPIRED' || interview.status === 'COMPLETED';

                                                    if (isScheduled && interview.link && isOnline && !isExpired) {
                                                        return (
                                                            <button
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                                                onClick={() => window.open(interview.link, '_blank')}
                                                            >
                                                                Join Meeting
                                                            </button>
                                                        );
                                                    } else {
                                                        return (
                                                            <button
                                                                className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed"
                                                                disabled
                                                            >
                                                                {isExpired
                                                                    ? (interview.status === 'COMPLETED' ? 'Completed' : 'Expired')
                                                                    : (isScheduled && !interview.link && isOnline ? 'No Link' : 'Await Confirm')
                                                                }
                                                            </button>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {candidatesToSchedule.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-slate-400 text-3xl">person_search</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No candidates ready to schedule</h3>
                                    <p className="text-slate-500">Access your applications to shortlist more candidates.</p>
                                </div>
                            ) : (
                                candidatesToSchedule.map((app: any) => (
                                    <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <Avatar src={app.student?.user?.profilePicture} name={app.fullName} size="lg" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">{app.fullName}</h4>
                                                <p className="text-sm text-slate-500">{app.internship?.title} • {app.student?.collegeName}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            onClick={() => navigate(`/dashboard/recruiter/interviews/schedule?applicationId=${app.id}`)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                                            Schedule NOW
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
