// Sidebar panel displaying a list of user notifications.
import React from 'react';
import '../../../styles/dashboard/student-dashboard.css';

interface Notification {
    id: number;
    icon: string;
    type: 'success' | 'info' | 'warning' | 'course' | 'error';
    message: string;
    highlight?: string;
    time: string;
}

const NotificationsSidebar: React.FC = () => {
    const notifications: Notification[] = [
        {
            id: 1,
            icon: 'check_circle',
            type: 'success',
            message: 'Your application for Data Analyst was selected.',
            highlight: 'Data Analyst',
            time: '15 mins ago',
        },
        {
            id: 2,
            icon: 'mail',
            type: 'info',
            message: 'New message from Jane Doe (Innovate Inc.)',
            highlight: 'Jane Doe (Innovate Inc.)',
            time: '1 hour ago',
        },
        {
            id: 3,
            icon: 'event',
            type: 'warning',
            message: 'Interview reminder: TechCorp is tomorrow.',
            highlight: 'TechCorp',
            time: '4 hours ago',
        },
        {
            id: 4,
            icon: 'school',
            type: 'course',
            message: 'New course available: Advanced UI/UX',
            highlight: 'Advanced UI/UX',
            time: '1 day ago',
        },
        {
            id: 5,
            icon: 'cancel',
            type: 'error',
            message: 'Application for Backend Dev was rejected.',
            highlight: 'Backend Dev',
            time: '2 days ago',
        },
    ];

    const formatMessage = (message: string, highlight?: string) => {
        if (!highlight) return <span>{message}</span>;

        const parts = message.split(highlight);
        return (
            <span>
                {parts[0]}
                <span className="notification-text-highlight">{highlight}</span>
                {parts[1]}
            </span>
        );
    };

    return (
        <aside className="notifications-sidebar">
            <h3 className="notifications-title">Notifications</h3>
            <div className="notifications-list">
                {/* [VISUAL STATE]: List View. Sidebar list of all notifications. */}
                {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        <div className={`notification-icon ${notification.type}`}>
                            <span className="material-symbols-outlined">{notification.icon}</span>
                        </div>
                        <div className="notification-content">
                            <p className="notification-text">
                                {formatMessage(notification.message, notification.highlight)}
                            </p>
                            <p className="notification-time">{notification.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default NotificationsSidebar;
