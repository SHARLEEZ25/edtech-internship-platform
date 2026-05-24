import React from 'react';
import type { Application } from '@/api/internships.api';

interface ApplicationActionsProps {
    application: Application;
    updating: boolean;
    remarks: string;
    savingRemarks: boolean;
    onStatusUpdate: (status: string) => void;
    onRemarksChange: (value: string) => void;
    onRemarksSave: () => void;
}

export const ApplicationActions: React.FC<ApplicationActionsProps> = ({
    application,
    updating,
    remarks,
    savingRemarks,
    onStatusUpdate,
    onRemarksChange,
    onRemarksSave
}) => {

    const getPrimaryAction = () => {
        const status = application?.status;
        switch (status) {
            case 'APPLIED':
            case 'UNDER_REVIEW':
                return {
                    label: 'Shortlist Candidate',
                    nextStatus: 'SHORTLISTED',
                    className: 'btn-shortlist',
                    icon: 'check_circle'
                };
            case 'SHORTLISTED':
                return {
                    label: 'Schedule Interview',
                    nextStatus: 'INTERVIEW',
                    className: 'btn-schedule-interview',
                    icon: 'calendar_month'
                };
            case 'INTERVIEW':
                return {
                    label: 'Select Candidate',
                    nextStatus: 'SELECTED',
                    className: 'btn-select-candidate',
                    icon: 'verified'
                };
            default:
                return null;
        }
    };

    const primaryAction = getPrimaryAction();

    return (
        <div className="app-actions-area">
            <div className="btn-actions-row">
                {primaryAction && (
                    <button
                        className={`btn-status-action ${primaryAction.className}`}
                        onClick={() => onStatusUpdate(primaryAction.nextStatus)}
                        disabled={updating}
                    >
                        <span className="material-symbols-outlined">{primaryAction.icon}</span>
                        {primaryAction.label}
                    </button>
                )}
                <button
                    className="btn-status-action btn-reject"
                    onClick={() => onStatusUpdate('REJECTED')}
                    disabled={updating || application.status === 'REJECTED'}
                >
                    <span className="material-symbols-outlined">cancel</span>
                    Reject Application
                </button>
            </div>

            <div className="remarks-section">
                <div className="remarks-header-row">
                    <div className="flex flex-col gap-1">
                        <label className="remarks-label">Remarks (Optional)</label>
                        <span className="text-xs text-slate-400 italic mb-2">
                            <span className="material-symbols-outlined text-[12px] align-middle mr-1">lock</span>
                            Private note: Only visible to you. Not shown to the student.
                        </span>
                    </div>
                    <button
                        className="btn-save-remarks"
                        onClick={onRemarksSave}
                        disabled={savingRemarks || !remarks.trim() || remarks === (application?.remarks || '')}
                    >
                        {savingRemarks ? 'Saving...' : 'Save Note'}
                    </button>
                </div>
                <textarea
                    className="remarks-textarea"
                    placeholder="Add any internal notes about this decision..."
                    value={remarks}
                    onChange={(e) => onRemarksChange(e.target.value)}
                    maxLength={500}
                />
                <div className="word-count">{remarks.length}/500</div>
            </div>
        </div>
    );
};
