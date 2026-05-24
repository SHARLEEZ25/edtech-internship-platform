import React from 'react';
import DashboardSidebar from '@/components/dashboard/student/DashboardSidebar';
import '@/styles/dashboard/student-dashboard.css';

interface StudentDashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable layout wrapper for all student dashboard pages.
 * Provides consistent structure with sidebar and main content area.
 */
export const StudentDashboardLayout: React.FC<StudentDashboardLayoutProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className="light animate-fade-in">
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <main className={`dashboard-main ${className}`}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};
