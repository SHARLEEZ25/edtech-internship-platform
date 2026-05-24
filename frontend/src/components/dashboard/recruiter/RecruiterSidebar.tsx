import React from 'react';
import Sidebar from '../../layout/Sidebar';
import { RECRUITER_SIDEBAR_LINKS, RECRUITER_BOTTOM_LINKS } from '@/utils/dashboard.constants';

const RecruiterSidebar: React.FC = () => {
    return <Sidebar mainLinks={RECRUITER_SIDEBAR_LINKS} bottomLinks={RECRUITER_BOTTOM_LINKS} />;
};

export default RecruiterSidebar;
