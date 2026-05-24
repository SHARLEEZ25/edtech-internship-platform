import React from 'react';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import '@/styles/dashboard/recruiter-dashboard.css';

interface RecruiterDashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable layout wrapper for all recruiter dashboard pages.
 * Provides consistent structure with sidebar and main content area.
 */
export const RecruiterDashboardLayout: React.FC<RecruiterDashboardLayoutProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`recruiter-dashboard-container animate-fade-in ${className}`}>
            <RecruiterSidebar />
            <main className="recruiter-main-content">
                {children}
            </main>
        </div>
    );
};
