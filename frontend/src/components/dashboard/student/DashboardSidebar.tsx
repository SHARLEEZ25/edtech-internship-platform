import React from 'react';
import Sidebar from '../../layout/Sidebar';
import { STUDENT_SIDEBAR_LINKS, STUDENT_BOTTOM_LINKS } from '@/utils/dashboard.constants';

const DashboardSidebar: React.FC = () => {
    return <Sidebar mainLinks={STUDENT_SIDEBAR_LINKS} bottomLinks={STUDENT_BOTTOM_LINKS} className="dashboard-sidebar" />;
};

export default DashboardSidebar;
