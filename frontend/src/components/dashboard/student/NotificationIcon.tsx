// Icon with badge showing unread notifications.
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/dashboard/student-dashboard.css';

interface Notification {
    id: string;
    icon: string;
    type: 'success' | 'info' | 'warning' | 'course' | 'error';
    message: string;
    highlight?: string;
    time: string;
    timestamp: Date;
}

const NotificationIcon: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Generate real-time notifications based on user data
    useEffect(() => {
        if (user) {
            const generatedNotifications: Notification[] = [];

            // Onboarding-related notifications
            if (!user.onboardingCompleted) {
                const progress = calculateProgress();

                if (progress < 100) {
                    generatedNotifications.push({
                        id: 'onboarding-incomplete',
                        icon: 'info',
                        type: 'info',
                        message: `Your profile is ${progress}% complete. Complete your profile to unlock all features.`,
                        highlight: `${progress}%`,
                        time: 'Now',
                        timestamp: new Date(),
                    });
                }

                // Specific step reminders
                if (!user.role) {
                    generatedNotifications.push({
                        id: 'role-pending',
                        icon: 'warning',
                        type: 'warning',
                        message: 'Please select your role to continue.',
                        time: '5 mins ago',
                        timestamp: new Date(Date.now() - 5 * 60 * 1000),
                    });
                } else if (user.onboardingStep === 'education') {
                    generatedNotifications.push({
                        id: 'education-pending',
                        icon: 'school',
                        type: 'course',
                        message: 'Add your education details to enhance your profile.',
                        time: '10 mins ago',
                        timestamp: new Date(Date.now() - 10 * 60 * 1000),
                    });
                } else if (user.onboardingStep === 'skills') {
                    generatedNotifications.push({
                        id: 'skills-pending',
                        icon: 'psychology',
                        type: 'info',
                        message: 'List your skills to get better internship recommendations.',
                        time: '15 mins ago',
                        timestamp: new Date(Date.now() - 15 * 60 * 1000),
                    });
                } else if (user.onboardingStep === 'location') {
                    generatedNotifications.push({
                        id: 'location-pending',
                        icon: 'location_on',
                        type: 'warning',
                        message: 'Add your location to find nearby opportunities.',
                        time: '20 mins ago',
                        timestamp: new Date(Date.now() - 20 * 60 * 1000),
                    });
                }
            } else {
                // Profile completed notification
                generatedNotifications.push({
                    id: 'profile-complete',
                    icon: 'check_circle',
                    type: 'success',
                    message: 'Your profile is complete! Start applying to internships.',
                    highlight: 'complete',
                    time: '1 hour ago',
                    timestamp: new Date(Date.now() - 60 * 60 * 1000),
                });
            }

            // Welcome notification
            if (user.role) {
                generatedNotifications.push({
                    id: 'welcome',
                    icon: 'celebration',
                    type: 'success',
                    message: `Welcome to Thozhil, ${user.fullName?.split(' ')[0] || 'Student'}! Explore opportunities tailored for you.`,
                    highlight: 'Thozhil',
                    time: '2 hours ago',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                });
            }

            // Sort by timestamp (newest first)
            generatedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setNotifications(generatedNotifications);
        }
    }, [user]);

    const calculateProgress = () => {
        if (!user) return 0;
        if (user.onboardingCompleted) return 100;

        const stepProgress: Record<string, number> = {
            'role-selection': 20,
            'education': 40,
            'skills': 60,
            'location': 80,
        };
        return stepProgress[user.onboardingStep] || (user.role ? 20 : 0);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

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

    const unreadCount = notifications.length;

    return (
        <div className="notification-icon-container" ref={dropdownRef}>
            <button
                className="notification-icon-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                    /* [VISUAL STATE]: Badge. Shows unread count. */
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <h3 className="notification-dropdown-title">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="notification-count">{unreadCount} new</span>
                        )}
                    </div>
                    <div className="notification-dropdown-list">
                        {notifications.length > 0 ? (
                            /* [VISUAL STATE]: List View. Dropdown list of notifications. */
                            notifications.map((notification) => (
                                <div key={notification.id} className="notification-dropdown-item">
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
                            ))
                        ) : (
                            /* [VISUAL STATE]: Empty State. Shown when no notifications exist. */
                            <div className="notification-empty">
                                <span className="material-symbols-outlined">notifications_off</span>
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;
