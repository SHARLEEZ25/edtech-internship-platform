export interface SidebarLink {
    icon: string;
    label: string;
    path: string;
    active?: boolean;
    badge?: number;
}

export const RECRUITER_SIDEBAR_LINKS: SidebarLink[] = [
    { icon: 'home', label: 'Dashboard', path: '/dashboard/recruiter' },
    { icon: 'work', label: 'Internships', path: '/dashboard/recruiter/internships' },
    { icon: 'description', label: 'Applications', path: '/dashboard/recruiter/applications' },
    { icon: 'calendar_month', label: 'Interviews', path: '/dashboard/recruiter/interviews' },
    { icon: 'business', label: 'Company Profile', path: '/dashboard/recruiter/profile' },
];

export const RECRUITER_BOTTOM_LINKS: SidebarLink[] = [
    { icon: 'notifications', label: 'Notifications', path: '#' },
    { icon: 'settings', label: 'Settings', path: '#' },
];

export const STUDENT_SIDEBAR_LINKS: SidebarLink[] = [
    { icon: 'home', label: 'Home', path: '/dashboard/student' },
    { icon: 'work', label: 'Internships', path: '/dashboard/student/internships' },
    { icon: 'assignment', label: 'Applications', path: '/dashboard/student/applications' },
    { icon: 'bookmark', label: 'Saved Internships', path: '/dashboard/student/saved-internships' },
    { icon: 'school', label: 'LMS', path: '#' },
    { icon: 'video_chat', label: 'Interviews', path: '/dashboard/student/interviews' },
    { icon: 'smart_toy', label: 'AI Tools', path: '#' },
    { icon: 'description', label: 'Offer Letter', path: '#' },
];

export const STUDENT_BOTTOM_LINKS: SidebarLink[] = [
    { icon: 'notifications', label: 'Notifications', path: '#' },
    { icon: 'person', label: 'My Profile', path: '/dashboard/student/profile' },
];

export const RECRUITER_QUICK_ACTIONS = [
    {
        title: 'Post New Internship',
        description: 'Create a new listing for students',
        icon: 'add_circle',
        path: '/dashboard/recruiter/internships/new',
        color: 'blue'
    },
    {
        title: 'Review Applications',
        description: 'Manage candidates and hires',
        icon: 'group',
        path: '/dashboard/recruiter/applications',
        color: 'green'
    },
    {
        title: 'Schedule Interview',
        description: 'Set up meetings with candidates',
        icon: 'calendar_today',
        path: '/dashboard/recruiter/interviews/new',
        color: 'yellow'
    }
];
