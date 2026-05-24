import { useParams, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/student/DashboardSidebar';
import { LoadingState } from '@/components/common/LoadingState';
import { StudentApplicationDetailsVisuals } from '@/components/internships/student/StudentApplicationDetailsVisuals';
import { useStudentApplicationDetails } from '@/hooks/internships/student/useStudentApplicationDetails';
import '@/styles/dashboard/student-dashboard.css';
import '@/styles/internships/student/student-application-details.css';

export default function StudentApplicationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        application,
        loading,
        error,
        isWithdrawModalOpen,
        isWithdrawing,
        setIsWithdrawModalOpen,
        handleWithdrawConfirm,
        getTimeAgo
    } = useStudentApplicationDetails(id);

    if (loading) {
        return (
            <div className="light animate-fade-in">
                <div className="student-dashboard">
                    <div className="dashboard-container">
                        <DashboardSidebar />
                        <main className="dashboard-main">
                            <LoadingState />
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="light animate-fade-in">
                <div className="student-dashboard">
                    <div className="dashboard-container">
                        <DashboardSidebar />
                        <main className="dashboard-main">
                            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                                <span className="material-symbols-outlined text-red-500 text-5xl">warning</span>
                                <h2 className="text-xl font-bold">Error</h2>
                                <p className="text-gray-600">{error || 'Application not found'}</p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors"
                                >
                                    Back to Internships
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="light animate-fade-in">
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <main className="dashboard-main">
                        <StudentApplicationDetailsVisuals
                            application={application}
                            isWithdrawModalOpen={isWithdrawModalOpen}
                            isWithdrawing={isWithdrawing}
                            onWithdrawCancel={() => setIsWithdrawModalOpen(false)}
                            onWithdrawConfirm={handleWithdrawConfirm}
                            onWithdrawClick={() => setIsWithdrawModalOpen(true)}
                            timeAgo={getTimeAgo(application.appliedAt)}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}
