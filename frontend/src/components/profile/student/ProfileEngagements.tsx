import React from 'react';
import { type Engagement } from '@/hooks/profile/student/useStudentProfile';

interface ProfileEngagementsProps {
    items: Engagement[];
    isAdding: boolean;
    isManaging: boolean;
    editingId: string | null;
    onToggleAdd: () => void;
    onToggleManage: () => void;
    newEngage: any;
    onNewEngageChange: (val: any) => void;
    onSave: () => void;
    onDelete: (id: string) => void;
    onStartEdit: (item: Engagement) => void;
    error?: string | null;
    readOnly?: boolean;
}

export const ProfileEngagements: React.FC<ProfileEngagementsProps> = ({
    items, isAdding, isManaging, editingId, onToggleAdd, onToggleManage: _onToggleManage, newEngage, onNewEngageChange, onSave, onDelete, onStartEdit, error, readOnly = false
}) => (
    <div className="profile-card animate-fade-in">
        <div className="section-header">
            <h2 className="section-title">Engagements</h2>
            {!readOnly && (
                <button
                    onClick={onToggleAdd}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#2D72FF',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1d5fe8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#2D72FF'}
                >
                    <span style={{ fontSize: '1.125rem', lineHeight: 1 }}>+</span>
                    Add New
                </button>
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
                        <label>Engagement / Workshop Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Advanced React Workshop"
                            value={newEngage.title}
                            onChange={(e) => onNewEngageChange({ ...newEngage, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Detail / Duration</label>
                        <input
                            type="text"
                            placeholder="e.g. Completed 12 hours intensive training"
                            value={newEngage.detail}
                            onChange={(e) => onNewEngageChange({ ...newEngage, detail: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Type / Tag</label>
                        <select
                            value={newEngage.tag}
                            onChange={(e) => onNewEngageChange({ ...newEngage, tag: e.target.value })}
                        >
                            <option value="CERTIFIED">CERTIFIED</option>
                            <option value="ACHIEVEMENT">ACHIEVEMENT</option>
                            <option value="PARTICIPATION">PARTICIPATION</option>
                            <option value="WORKSHOP">WORKSHOP</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Icon</label>
                        <select
                            value={newEngage.icon}
                            onChange={(e) => onNewEngageChange({ ...newEngage, icon: e.target.value })}
                        >
                            <option value="school">Education / Workshop</option>
                            <option value="terminal">Code / Hackathon</option>
                            <option value="groups">Group / Collaboration</option>
                            <option value="volunteer_activism">Volunteer / Social</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="save-profile-btn" onClick={onSave}>{editingId ? 'Save Changes' : 'Save Engagement'}</button>
                    <button className="edit-btn" onClick={onToggleAdd}>Cancel</button>
                </div>
            </div>
        )}

        <div className="engagements-grid">
            {items.map((item, i) => (
                <div key={item.id} className="animate-fade-in" style={{
                    animationDelay: `${i * 0.1}s`,
                    background: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '24px',
                    padding: '1.25rem',
                    position: 'relative',
                    transition: 'all 0.2s'
                }}>
                    <div style={{ marginBottom: '0.875rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.875rem'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#2D72FF' }}>
                                {item.icon}
                            </span>
                        </div>
                        {!readOnly && isManaging && (
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
                                <button
                                    onClick={() => onStartEdit(item)}
                                    title="Edit"
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#64748b' }}>edit</span>
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    title="Delete"
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #fee2e2',
                                        background: '#fef2f2',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#ef4444' }}>delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        margin: '0 0 0.5rem 0'
                    }}>
                        {item.title}
                    </h4>
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        margin: '0 0 0.875rem 0',
                        lineHeight: '1.5'
                    }}>
                        {item.detail}
                    </p>
                    <span style={{
                        display: 'inline-block',
                        background: item.tag === 'CERTIFIED' ? '#dbeafe' : '#f3f4f6',
                        color: item.tag === 'CERTIFIED' ? '#2D72FF' : '#64748b',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '0.375rem 0.75rem',
                        borderRadius: '6px',
                        letterSpacing: '0.025em'
                    }}>
                        {item.tag}
                    </span>
                </div>
            ))}

            {items.length === 0 && !isAdding && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 2rem', opacity: 0.5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>hub</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>Add your engagements</h3>
                    <p className="timeline-desc">Workshops, Hackathons, and more. Show your active journey!</p>
                </div>
            )}
        </div>
    </div>
);
