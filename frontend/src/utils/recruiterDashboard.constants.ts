export interface SidebarLink {
    icon: string;
    label: string;
    path: string;
}

export const RECRUITER_SIDEBAR_LINKS: SidebarLink[] = [
    { icon: 'home', label: 'Dashboard', path: '/dashboard/recruiter' },
    { icon: 'work', label: 'Internships', path: '/dashboard/recruiter/internships' },
    { icon: 'description', label: 'Applications', path: '/dashboard/recruiter/applications' },
    { icon: 'videocam', label: 'Interviews', path: '#' },
    { icon: 'domain', label: 'Company Profile', path: '/profile/recruiter' },
];

export const RECRUITER_BOTTOM_LINKS: SidebarLink[] = [
    { icon: 'notifications', label: 'Notifications', path: '#' },
    { icon: 'settings', label: 'Settings', path: '#' },
];

export interface QuickAction {
    title: string;
    description: string;
    icon: string;
    path: string;
}

export const RECRUITER_QUICK_ACTIONS: QuickAction[] = [
    {
        title: 'Post New Internship',
        description: 'Create a job listing',
        icon: 'add_circle',
        path: '/dashboard/recruiter/internships/new'
    },
    {
        title: 'Schedule Interview',
        description: 'Set up a call',
        icon: 'calendar_month',
        path: '/dashboard/recruiter/applications'
    },
    {
        title: 'View All Candidates',
        description: 'Review pipeline',
        icon: 'group',
        path: '/dashboard/recruiter/applications'
    }
];
