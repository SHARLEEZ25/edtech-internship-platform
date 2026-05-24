// Logo component displayed in the sidebar.
import React from 'react';
import '../../styles/layout/SidebarLogo.css';

const SidebarLogo: React.FC = () => {
    return (
        <div className="sidebar-logo">
            <img
                src="/icons/thozhil-logo.png"
                alt="Thozhil Logo"
                className="logo-img"
            />
        </div>
    );
};

export default SidebarLogo;
