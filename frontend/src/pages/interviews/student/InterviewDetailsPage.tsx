import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/student/DashboardSidebar';
import { useInterview } from '@/hooks/interviews/useInterview';

const InterviewDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { interview, isLoading, error } = useInterview(id);

    if (isLoading) {
        return (
            <div className="student-dashboard bg-[#F8F9FC] min-h-screen font-sans">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <div className="dashboard-main flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !interview) {
        return (
            <div className="student-dashboard bg-[#F8F9FC] min-h-screen font-sans">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <div className="dashboard-main p-8 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Interview Not Found</h3>
                            <p className="text-slate-500 mb-6">{error || "The interview details you are looking for does not exist."}</p>
                            <button onClick={() => navigate('/student/interviews')} className="px-6 py-2 bg-indigo-600 text-white rounded-full">
                                Back to Interviews
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // derived data
    // derived data
    const companyName = interview.companyName || interview.recruiter?.recruiterProfile?.companyName || interview.application?.internship?.company?.name || 'Unknown Company';
    const role = interview.internshipTitle || interview.application?.internship?.title || 'Internship Role';
    const interviewerName = interview.recruiter?.recruiterProfile?.user?.fullName || 'Hiring Manager';
    const interviewerDesignation = interview.recruiter?.recruiterProfile?.designation || 'Recruiter';

    // Status Badge Logic
    const getStatusBadge = (status: string) => {
        const baseStyle = "px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wide";
        switch (status) {
            case 'SCHEDULED': return <span className={`${baseStyle} bg-[#dcfce7] text-[#166534]`}>Scheduled</span>; // Using exact green from image for similar pill
            case 'COMPLETED': return <span className={`${baseStyle} bg-blue-100 text-blue-700`}>Completed</span>;
            case 'CANCELLED': return <span className={`${baseStyle} bg-red-100 text-red-700`}>Cancelled</span>;
            default: return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status}</span>;
        }
    };

    const interviewDate = new Date(interview.date);
    const dateStr = interviewDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); // 15 Mar 2024
    const timeStr = interviewDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); // 10:30 AM

    const isOnline = interview.mode.toLowerCase() === 'online';

    return (
        <div className="student-dashboard bg-[#F9FAFB] min-h-screen font-sans">
            <div className="dashboard-container">
                <DashboardSidebar />

                <div className="dashboard-main p-8 md:p-12">
                    <main className="max-w-4xl mx-auto">

                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">Interview Details</h1>
                            <p className="text-[#6B7280] text-base">Please be ready on time and check your audio/video setup.</p>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">

                            {/* Card Header: Company, Role, Status */}
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#111827] mb-1">{companyName}</h2>
                                    <p className="text-lg text-[#6B7280] font-medium">{role}</p>
                                </div>
                                <div>
                                    {getStatusBadge(interview.status)}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
                                {/* Date & Time */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Date & Time</p>
                                        <p className="text-[#111827] font-bold text-base">{dateStr}, {timeStr}</p>
                                    </div>
                                </div>

                                {/* Mode */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">{isOnline ? 'videocam' : 'groups'}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Mode</p>
                                        <p className="text-[#111827] font-bold text-base">
                                            {isOnline ? 'Online: Google Meet' : 'Offline'}
                                        </p>
                                    </div>
                                </div>

                                {/* Meeting Link */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">link</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Meeting Link</p>
                                        {interview.link ? (
                                            <div className="flex items-center gap-2">
                                                <a href={interview.link} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] font-bold text-base truncate hover:underline">
                                                    {interview.link}
                                                </a>
                                                <button
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    onClick={() => navigator.clipboard.writeText(interview.link!)}
                                                    title="Copy link"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 italic text-sm">No link provided yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Interviewer */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">person</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Interviewer</p>
                                        <p className="text-[#111827] font-bold text-base">{interviewerName}</p>
                                    </div>
                                </div>

                                {/* Designation */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">badge</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Designation</p>
                                        <p className="text-[#111827] font-bold text-base">{interviewerDesignation}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 w-full mb-8"></div>

                            {/* Interview Instructions */}
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-[#111827] mb-5">Interview Instructions</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#22c55e] text-[20px] mt-0.5">check_circle</span>
                                        <span className="text-[#4B5563] font-medium">Ensure a stable internet connection for a smooth video call.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#22c55e] text-[20px] mt-0.5">check_circle</span>
                                        <span className="text-[#4B5563] font-medium">Test your microphone and camera beforehand.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#22c55e] text-[20px] mt-0.5">check_circle</span>
                                        <span className="text-[#4B5563] font-medium">Choose a quiet, well-lit space free from distractions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[#22c55e] text-[20px] mt-0.5">check_circle</span>
                                        <span className="text-[#4B5563] font-medium">Have your portfolio link and resume ready to share if needed.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                                {interview.link && (
                                    <a
                                        href={interview.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#3B82F6] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">videocam</span>
                                        Join Interview
                                    </a>
                                )}
                                <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-300 text-[#374151] rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                                    Add to Calendar
                                </button>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetailsPage;
