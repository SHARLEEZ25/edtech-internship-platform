import React from 'react';
import { type Experience } from '@/hooks/profile/student/useStudentProfile';

interface ProfileExperienceProps {
    items: Experience[];
    isAdding: boolean;
    isManaging: boolean;
    editingId: string | null;
    onToggleAdd: () => void;
    onToggleManage: () => void;
    newExp: any;
    onNewExpChange: (val: any) => void;
    onSave: () => void;
    onDelete: (id: string) => void;
    onStartEdit: (exp: Experience) => void;
    error?: string | null;
    readOnly?: boolean;
}

export const ProfileExperience: React.FC<ProfileExperienceProps> = ({
    items, isAdding, isManaging, editingId, onToggleAdd, onToggleManage: _onToggleManage, newExp, onNewExpChange, onSave, onDelete, onStartEdit, error, readOnly = false
}) => (
    <div className="profile-card animate-fade-in">
        <div className="info-section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Experience</h3>
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
                        <label>Role / Professional Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Frontend Developer"
                            value={newExp.title}
                            onChange={(e) => onNewExpChange({ ...newExp, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Organization / Company</label>
                        <input
                            type="text"
                            placeholder="e.g. Google"
                            value={newExp.company}
                            onChange={(e) => onNewExpChange({ ...newExp, company: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Started at</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                style={{ flex: 1 }}
                                value={newExp.startDate ? newExp.startDate.split(' ')[0] : ''}
                                onChange={(e) => {
                                    const year = newExp.startDate ? newExp.startDate.split(' ')[1] : new Date().getFullYear();
                                    onNewExpChange({ ...newExp, startDate: `${e.target.value} ${year}` });
                                }}
                            >
                                <option value="" disabled>Month</option>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <select
                                style={{ flex: 1 }}
                                value={newExp.startDate ? newExp.startDate.split(' ')[1] : ''}
                                onChange={(e) => {
                                    const month = newExp.startDate ? newExp.startDate.split(' ')[0] : 'Jan';
                                    onNewExpChange({ ...newExp, startDate: `${month} ${e.target.value}` });
                                }}
                            >
                                <option value="" disabled>Year</option>
                                {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Ended at</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                style={{ flex: 1 }}
                                disabled={newExp.isCurrent}
                                value={!newExp.isCurrent && newExp.endDate ? newExp.endDate.split(' ')[0] : ''}
                                onChange={(e) => {
                                    const year = newExp.endDate ? newExp.endDate.split(' ')[1] : new Date().getFullYear();
                                    onNewExpChange({ ...newExp, endDate: `${e.target.value} ${year}` });
                                }}
                            >
                                <option value="" disabled>Month</option>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <select
                                style={{ flex: 1 }}
                                disabled={newExp.isCurrent}
                                value={!newExp.isCurrent && newExp.endDate ? newExp.endDate.split(' ')[1] : ''}
                                onChange={(e) => {
                                    const month = newExp.endDate ? newExp.endDate.split(' ')[0] : 'Jan';
                                    onNewExpChange({ ...newExp, endDate: `${month} ${e.target.value}` });
                                }}
                            >
                                <option value="" disabled>Year</option>
                                {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <div className="checkbox-container" onClick={() => onNewExpChange({ ...newExp, isCurrent: !newExp.isCurrent })}>
                            <div className={`modern-checkbox ${newExp.isCurrent ? 'modern-checkbox-active' : ''}`}>
                                {newExp.isCurrent && <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color: 'white' }}>check</span>}
                            </div>
                            <span className="checkbox-label-text">I am currently working in this role</span>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Description (Optional)</label>
                        <textarea
                            placeholder="Briefly describe your responsibilities..."
                            value={newExp.description}
                            onChange={(e) => onNewExpChange({ ...newExp, description: e.target.value })}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className="save-profile-btn"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                        onClick={onSave}
                    >
                        {editingId ? 'Save Changes' : 'Save Experience'}
                    </button>
                    <button
                        className="edit-btn"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                        onClick={onToggleAdd}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((exp, i) => (
                <div key={exp.id} className="animate-fade-in" style={{
                    display: 'flex',
                    gap: '1rem',
                    animationDelay: `${i * 0.1}s`,
                    position: 'relative'
                }}>
                    {/* Timeline dot */}
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: exp.isCurrent ? '#2D72FF' : '#cbd5e1',
                        marginTop: '0.375rem',
                        flexShrink: 0
                    }} />

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    margin: '0 0 0.375rem 0'
                                }}>
                                    {exp.title}
                                </h4>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#2D72FF',
                                    marginBottom: '0.25rem',
                                    fontWeight: 500
                                }}>
                                    {exp.company} • {exp.duration}
                                </div>
                            </div>
                            {exp.isCurrent && (
                                <span style={{
                                    background: '#d1fae5',
                                    color: '#059669',
                                    fontSize: '0.6875rem',
                                    fontWeight: 700,
                                    padding: '0.25rem 0.625rem',
                                    borderRadius: '4px',
                                    letterSpacing: '0.025em'
                                }}>
                                    CURRENT
                                </span>
                            )}
                            {!readOnly && isManaging && (
                                <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '0.5rem' }}>
                                    <button
                                        onClick={() => onStartEdit(exp)}
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
                                        onClick={() => onDelete(exp.id)}
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
                        <p style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            color: '#64748b',
                            margin: 0
                        }}>
                            {exp.description}
                        </p>
                    </div>
                </div>
            ))}
            {items.length === 0 && !isAdding && (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', opacity: 0.5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>history_edu</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>Add your experience</h3>
                    <p className="timeline-desc">Share your internship or work history to stand out!</p>
                </div>
            )}
        </div>
    </div >
);
