import React from 'react';
import { type Achievement } from '@/hooks/profile/student/useStudentProfile';

interface ProfileAchievementsProps {
    items: Achievement[];
    isAdding: boolean;
    isManaging: boolean;
    editingId: string | null;
    onToggleAdd: () => void;
    onToggleManage: () => void;
    newAch: any;
    onNewAchChange: (val: any) => void;
    onSave: () => void;
    onDelete: (id: string) => void;
    onStartEdit: (ach: Achievement) => void;
    error?: string | null;
    readOnly?: boolean;
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
    items, isAdding, isManaging, editingId, onToggleAdd, onToggleManage, newAch, onNewAchChange, onSave, onDelete, onStartEdit, error, readOnly = false
}) => (
    <div className="profile-card animate-fade-in">
        <div className="section-header">
            <h2 className="section-title">Achievements</h2>
            {!readOnly && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {items.length > 0 && !isAdding && (
                        <button className="edit-btn" onClick={onToggleManage}>
                            {isManaging ? 'Done' : 'Edit'}
                        </button>
                    )}
                    <button className="edit-btn" onClick={onToggleAdd} style={{ background: isAdding ? 'rgba(239, 68, 68, 0.05)' : '', color: isAdding ? '#ef4444' : '' }}>
                        {isAdding ? 'Discard' : '+ Add'}
                    </button>
                </div>
            )}
        </div>

        {isAdding && (
            <div className="experience-form animate-fade-in">
                {error && (
                    <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        fontWeight: 500,
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '6px',
                        borderLeft: '3px solid #ef4444'
                    }}>
                        {error}
                    </div>
                )}
                <div className="form-grid">
                    <div className="form-group">
                        <label>Achievement Title</label>
                        <input
                            type="text"
                            placeholder="e.g. AWS Certified Developer"
                            value={newAch.title}
                            onChange={(e) => onNewAchChange({ ...newAch, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Issuer / Details</label>
                        <input
                            type="text"
                            placeholder="e.g. Amazon Web Services (2024)"
                            value={newAch.issuer}
                            onChange={(e) => onNewAchChange({ ...newAch, issuer: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category Icon</label>
                        <select
                            value={newAch.icon}
                            onChange={(e) => onNewAchChange({ ...newAch, icon: e.target.value })}
                        >
                            <option value="workspace_premium">Premium / Certificate</option>
                            <option value="verified">Verified / Badge</option>
                            <option value="military_tech">Award / Trophy</option>
                            <option value="star">Star / recognition</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="save-profile-btn" onClick={onSave}>{editingId ? 'Save Changes' : 'Add Achievement'}</button>
                    <button className="edit-btn" onClick={onToggleAdd}>Cancel</button>
                </div>
            </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((ach, i) => {
                // Define icon colors based on icon type
                const getIconColor = (icon: string) => {
                    if (icon === 'workspace_premium') return { bg: '#fef3c7', color: '#f59e0b' }; // Yellow
                    if (icon === 'verified') return { bg: '#dbeafe', color: '#3b82f6' }; // Blue
                    if (icon === 'military_tech') return { bg: '#e9d5ff', color: '#a855f7' }; // Purple
                    return { bg: '#fef3c7', color: '#f59e0b' }; // Default yellow
                };

                const iconStyle = getIconColor(ach.icon);

                return (
                    <div
                        key={ach.id}
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            animationDelay: `${i * 0.1}s`,
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: iconStyle.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '24px',
                                    color: iconStyle.color
                                }}
                            >
                                {ach.icon}
                            </span>
                        </div>
                        <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                            <h5 style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                margin: '0 0 0.25rem 0'
                            }}>
                                {ach.title}
                            </h5>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                margin: 0
                            }}>
                                {ach.issuer}
                            </p>
                        </div>
                        {!readOnly && isManaging && (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                    className="manage-control-btn manage-btn-edit"
                                    onClick={() => onStartEdit(ach)}
                                    title="Edit"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#64748b' }}>edit</span>
                                </button>
                                <button
                                    className="manage-control-btn manage-btn-delete"
                                    onClick={() => onDelete(ach.id)}
                                    title="Delete"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '6px',
                                        border: '1px solid #fee2e2',
                                        background: '#fef2f2',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#ef4444' }}>delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
            {items.length === 0 && !isAdding && (
                <div style={{ textAlign: 'center', padding: '1.5rem 1rem', opacity: 0.5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#FACC15' }}>military_tech</span>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#1e293b' }}>Add achievements</h4>
                    <p className="timeline-desc" style={{ fontSize: '0.8rem' }}>Showcase your biggest wins!</p>
                </div>
            )}

            {!readOnly && !isAdding && (
                <button
                    onClick={onToggleAdd}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '0.5rem',
                        border: '1px dashed #e2e8f0',
                        borderRadius: '24px',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2D72FF';
                        e.currentTarget.style.color = '#2D72FF';
                        e.currentTarget.style.background = 'rgba(45, 114, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span>
                    Add Achievement
                </button>
            )}
        </div>
    </div>
);
