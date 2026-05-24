// Displays key student metrics like applications sent and profile views.
import React from 'react';
import InternshipsApplied from './InternshipsApplied';
import InterviewSchedule from './InterviewSchedule';
import LMSCourseProgress from './LMSCourseProgress';
import type { DashboardInternship, DashboardApplication, DashboardInterview } from '@/hooks/dashboard/useStudentDashboard';
import '../../../styles/dashboard/student-dashboard.css';

interface DashboardStatsProps {
    onboardingProgress?: number;
    applications: DashboardApplication[];
    suggestedInternship?: DashboardInternship;
    interviews: DashboardInterview[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
    onboardingProgress = 65,
    applications,
    suggestedInternship,
    interviews
}) => {
    return (
        /* [VISUAL STATE]: Stats Grid. Layout for dashboard widgets. */
        <div className="stats-grid">
            <InternshipsApplied
                applications={applications}
                suggestedInternship={suggestedInternship}
            />
            <InterviewSchedule interviews={interviews} />
            <LMSCourseProgress progress={onboardingProgress} />
        </div>
    );
};

export default DashboardStats;
