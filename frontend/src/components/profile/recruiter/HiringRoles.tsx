// Component: HiringRoles
// Purpose: Lists the types of roles the company frequently hires for. Supports tagging interface.
import React, { useState } from 'react';

interface HiringRolesProps {
    roles: string[];
    isEditing?: boolean;
    isSaving?: boolean;
    onSave?: (roles: string[]) => void;
    onEditTrigger?: () => void;
    onCancel?: () => void;
}

const HiringRoles: React.FC<HiringRolesProps> = ({ roles, isEditing, isSaving, onSave, onEditTrigger, onCancel }) => {
    const [tempRoles, setTempRoles] = useState<string[]>(roles);
    const [newRole, setNewRole] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sync temp state when roles change and we are not editing
    React.useEffect(() => {
        if (!isEditing) {
            setTempRoles(roles);
        }
    }, [roles, isEditing]);

    const handleAddRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRole.trim() && !tempRoles.includes(newRole.trim())) {
            const updated = [...tempRoles, newRole.trim()];
            setTempRoles(updated);
            setNewRole('');
        }
    };

    const handleRemoveRole = (roleToRemove: string) => {
        const updated = tempRoles.filter(r => r !== roleToRemove);
        setTempRoles(updated);
    };

    const handleSave = () => {
        if (onSave) onSave(tempRoles);
    };

    React.useEffect(() => {
        if (isEditing && inputRef.current && (roles.length === 0)) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isEditing, roles]);

    // LOGIC: Check for existing data.
    const hasRoles = tempRoles.length > 0;

    return (
        <div className="profile-card focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
            {/* Section Header */}
            <div className="info-section-header" style={{ marginBottom: '1rem', justifyContent: 'space-between' }}>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined icon-blue">work</span>
                    <h3>Other Hiring Roles</h3>
                </div>
                {!isEditing && (
                    <button className="section-edit-trigger" onClick={onEditTrigger} title="Edit roles">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                )}
                {isEditing && (
                    <div className="flex gap-2">
                        <button className="btn-save-inline" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Roles'}
                        </button>
                        <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={onCancel} disabled={isSaving}>Cancel</button>
                    </div>
                )}
            </div>

            {!hasRoles && !isEditing ? (
                /* [VISUAL STATE]: First Time User / Empty State. Shown when 'roles' array is empty. */
                <div className="empty-state-cta" onClick={onEditTrigger}>
                    <span className="material-symbols-outlined">work</span>
                    <p>What are you looking for?</p>
                    <span className="cta-subtitle">List the roles you're actively hiring for to attract the right candidates.</span>
                    <button className="btn-add-brand">+ Add Roles</button>
                </div>
            ) : (
                /* [VISUAL STATE]: Repeated User / View Mode. List of role tags. */
                <div className={`roles-tags ${!isEditing ? 'clickable-view' : ''}`} onClick={!isEditing ? onEditTrigger : undefined}>
                    {tempRoles.map(role => (
                        <span key={role} className={`role-tag ${isEditing ? 'edit-mode' : ''}`}>
                            {role}
                            {isEditing && (
                                <button
                                    className="btn-remove-tag"
                                    onClick={(e) => { e.stopPropagation(); handleRemoveRole(role); }}
                                    disabled={isSaving}
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}
                    {!isEditing && roles.length > 5 && (
                        <span className="role-tag role-tag-more">More +</span>
                    )}
                </div>
            )}

            {isEditing && (
                /* [VISUAL STATE]: Edit Mode. New Role Input Form. */
                <form onSubmit={handleAddRole} className="mt-4 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="e.g. Sales, Marketing, HR"
                        className="profile-input"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={isSaving}
                    />
                    <button type="submit" className="add-skill-btn" style={{ padding: '0.4rem 0.8rem' }} disabled={isSaving}>
                        Add
                    </button>
                </form>
            )}
        </div>
    );
};

export default HiringRoles;
