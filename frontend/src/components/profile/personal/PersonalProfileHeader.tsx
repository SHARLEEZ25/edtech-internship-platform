// Component: PersonalProfileHeader
// Purpose: Header card displaying the recruiter's avatar, name, email, and editing action.
import React from 'react';
import type { AuthUser } from '@/context/AuthContext';

interface PersonalProfileHeaderProps {
    user: AuthUser | null;
    isEditing: boolean;
    onEditClick: () => void;
}

const PersonalProfileHeader: React.FC<PersonalProfileHeaderProps> = ({ user, isEditing, onEditClick }) => {
    return (
        <div className="profile-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            {/* Gradient Banner Background */}
            <div style={{
                height: '140px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                position: 'relative'
            }}>
                {/* Header Edit Action Button */}
                {!isEditing && (
                    /* [VISUAL STATE]: View Mode Action. 'Edit Profile' button over banner. */
                    <button
                        onClick={onEditClick}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'background 0.2s'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Info Container (overlapping banner) */}
            <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '-30px', // Adjusted overlap
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {/* User Avatar Circle */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#ffffff', // White border effect
                        padding: '4px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        flexShrink: 0
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: '#bfdbfe', // Lighter blue for avatar bg
                            color: '#1e40af', // Dark blue text
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {user?.fullName ? user.fullName.charAt(0) : 'U'}
                        </div>
                    </div>

                    {/* User Details (Name, Email, Role) */}
                    <div style={{ paddingTop: '1.5rem' }}>
                        <h1 style={{
                            fontSize: '1.875rem',
                            fontWeight: 700,
                            color: '#1e293b',
                            margin: '0 0 0.25rem 0',
                            lineHeight: 1.2
                        }}>
                            {user?.fullName || 'User Name'}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{user?.email}</span>
                            <span className="role-tag">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalProfileHeader;
