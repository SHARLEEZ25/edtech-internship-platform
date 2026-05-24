// Main navigation sidebar for the application layout.
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SidebarLogo from './SidebarLogo';
import '../../styles/layout/Sidebar.css';

export interface SidebarLink {
    icon: string;
    label: string;
    path: string;
    active?: boolean;
    badge?: number;
}

interface SidebarProps {
    mainLinks: SidebarLink[];
    bottomLinks?: SidebarLink[];
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ mainLinks, bottomLinks = [], className }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isLinkActive = (path: string) => {
        if (path === '#' || !path) return false;

        // Exact match for the dashboard home or root paths
        if (path === '/dashboard/student' || path === '/dashboard/recruiter' || path === '/') {
            return location.pathname === path;
        }

        // Sub-route match (e.g., /dashboard/student/internships/123 matches /dashboard/student/internships)
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        setShowProfileMenu(false);
        setIsOpen(false);
        navigate('/login');
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="mobile-sidebar-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="sidebar-mobile-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`${className || 'dashboard-sidebar'} ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-nav-container">
                    <SidebarLogo />
                    <nav className="sidebar-nav">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`sidebar-link ${link.active || isLinkActive(link.path) ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="material-symbols-outlined">{link.icon}</span>
                                <span>{link.label}</span>
                                {link.badge && <span className="sidebar-badge">{link.badge}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                {bottomLinks.length > 0 && (
                    <div className="sidebar-bottom">
                        {bottomLinks.map((link) => {
                            if (link.label === 'Profile') {
                                return (
                                    <div key={link.label} style={{ position: 'relative' }} ref={profileMenuRef}>
                                        {showProfileMenu && (
                                            <div className="sidebar-profile-dropdown">
                                                <Link
                                                    to={link.path}
                                                    className="profile-dropdown-item"
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined">person</span>
                                                    My Profile
                                                </Link>
                                                <button className="profile-dropdown-item">
                                                    <span className="material-symbols-outlined">settings</span>
                                                    Settings
                                                </button>
                                                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                                                <button
                                                    className="profile-dropdown-item sign-out"
                                                    onClick={handleLogout}
                                                >
                                                    <span className="material-symbols-outlined">logout</span>
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                        <div
                                            className={`sidebar-link ${link.active || isLinkActive(link.path) ? 'active' : ''}`}
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div
                                                className="sidebar-avatar-small"
                                                style={{
                                                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAC9Itld376700jjjrgL2a7TkB7NDsvVj0pJ3Blrv5MlFKT2Mblarp96n4xb8gyZtu8GNGWDtvyyOsGX2Mwg7rJyx1KcTlmu4rD6MRLYPRU64N7qjuS6usVldJKrV-g5OmqoiODQEoMusN0SYAaoBjNC8C7cRCLt6sgdv6gREOJDkVXrQt6D4gpRW_kgP5WjPIlVtyOFJzGcTPAnGibO6AA4x-bdB678Ix1nrYm_Ttm3h6hJqRyV4Ksridng7-rsIMl2R0k8PssB48')`,
                                                }}
                                            ></div>
                                            <span>{link.label}</span>
                                            <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '1.1rem' }}>
                                                {showProfileMenu ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={link.label}
                                    to={link.path}
                                    className={`sidebar-link ${link.active || isLinkActive(link.path) ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="material-symbols-outlined">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
