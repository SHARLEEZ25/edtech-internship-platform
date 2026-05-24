import React, { useEffect } from 'react';
import { useMyInterviews } from '@/hooks/interviews/useMyInterviews';
import { RecruiterInterviewCard } from '@/components/interviews/recruiter/RecruiterInterviewCard';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';

const RecruiterInterviewsPage: React.FC = () => {
    const { interviews, isLoading, error } = useMyInterviews();

    useEffect(() => {
        document.title = 'Scheduled Interviews - Thozhil';
    }, []);

    if (isLoading) {
        return <div className="loading-state">Loading scheduled interviews...</div>;
    }

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />

            <main className="recruiter-main">
                <div className="dashboard-wrapper">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Interviews</h1>
                        <p className="text-slate-500 mt-1">Manage your upcoming interview schedules with candidates.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Content */}
                    {!isLoading && interviews.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">calendar_today</span>
                            <h3 className="text-lg font-medium text-slate-700">No Interviews Scheduled</h3>
                            <p className="text-slate-500 max-w-md mx-auto mt-2">
                                Go to your Applications to shortlist candidates and schedule interviews.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {interviews.map((interview) => (
                                <RecruiterInterviewCard key={interview.id} interview={interview} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RecruiterInterviewsPage;
