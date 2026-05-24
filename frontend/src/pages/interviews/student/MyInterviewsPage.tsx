import React, { useEffect } from 'react';
import { useMyInterviews } from '@/hooks/interviews/useMyInterviews';
import { InterviewCard } from '@/components/interviews/student/InterviewCard';
import DashboardSidebar from '@/components/dashboard/student/DashboardSidebar';


const MyInterviewsPage: React.FC = () => {
    const { interviews, isLoading, error } = useMyInterviews();

    useEffect(() => {
        document.title = 'My Interviews - Thozhil';
    }, []);

    const [statusFilter, setStatusFilter] = React.useState('All');
    const [platformFilter, setPlatformFilter] = React.useState('All');
    const [_dateFilter] = React.useState('All'); // Placeholder for now

    // Mock upcoming count for now (or derived from valid future interviews)
    const upcomingCount = interviews.filter(i => i.status === 'SCHEDULED').length;

    const filteredInterviews = interviews.filter(interview => {
        if (statusFilter !== 'All' && interview.status !== statusFilter.toUpperCase()) return false;
        if (platformFilter !== 'All' && !interview.mode.toLowerCase().includes(platformFilter.toLowerCase())) return false;
        return true;
    });

    if (isLoading) {
        return (
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <div className="dashboard-main flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="student-dashboard bg-[#F8F9FC] min-h-screen font-sans">
            <div className="dashboard-container">
                <DashboardSidebar />

                <div className="dashboard-main p-8 md:p-10">
                    <main className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">Interview Schedule</h1>
                            <p className="text-[#64748B] mt-1 text-base">Track and manage all your upcoming and completed interviews.</p>
                        </div>

                        {/* Banner */}
                        <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl py-5 px-8 shadow-lg shadow-indigo-100 text-white mb-10 flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-wide">You have {upcomingCount} upcoming interviews. Good luck!</h2>
                        </div>

                        {/* Filters & Controls */}
                        <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                {/* Status Filter */}
                                <div className="relative group">
                                    <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer">
                                        <span className="text-sm font-semibold text-slate-700">Status:</span>
                                        <select
                                            className="text-sm font-semibold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer p-0 pr-4 outline-none appearance-none"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            style={{ backgroundImage: 'none' }}
                                        >
                                            <option value="All">All</option>
                                            <option value="Schedule">Scheduled</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <span className="material-symbols-outlined text-slate-400 text-sm pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                {/* Platform Filter */}
                                <div className="relative group">
                                    <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer">
                                        <span className="text-sm font-semibold text-slate-700">Platform:</span>
                                        <select
                                            className="text-sm font-semibold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer p-0 pr-4 outline-none appearance-none"
                                            value={platformFilter}
                                            onChange={(e) => setPlatformFilter(e.target.value)}
                                            style={{ backgroundImage: 'none' }}
                                        >
                                            <option value="All">All</option>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                        </select>
                                        <span className="material-symbols-outlined text-slate-400 text-sm pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                {/* Date Filter Placeholder */}
                                <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer text-slate-600">
                                    <span className="material-symbols-outlined text-slate-500 text-[18px]">calendar_today</span>
                                    <span className="text-sm font-semibold text-slate-700">Date: All Time</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-100 flex items-center gap-3 shadow-sm">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {/* Content */}
                        {filteredInterviews.length === 0 ? (
                            <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-32 h-32 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                                    {/* Placeholder for illustration */}
                                    <span className="material-symbols-outlined text-6xl text-slate-300">telescope</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No interviews scheduled yet</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                                    Keep applying and opportunities will appear. Your next big chance is just an application away!
                                </p>
                                <a href="/internships" className="inline-flex items-center gap-2 px-8 py-3 bg-[#6366f1] text-white rounded-full hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200">
                                    Browse Internships
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredInterviews.map((interview) => (
                                    <InterviewCard key={interview.id} interview={interview} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyInterviewsPage;
