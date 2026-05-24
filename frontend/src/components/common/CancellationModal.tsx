import React, { useState } from 'react';
import '@/styles/common/confirm-modal.css';

interface CancellationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    placeholder?: string;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    placeholder = 'Provide a reason (optional)...'
}) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    const handleCancel = () => {
        setReason('');
        onCancel();
    };

    return (
        <div className="confirm-modal-overlay" onClick={handleCancel}>
            <div className="confirm-modal-card" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-icon" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                    <span className="material-symbols-outlined">event_busy</span>
                </div>
                <h3 className="confirm-modal-title">{title}</h3>
                <p className="confirm-modal-message">{message}</p>

                <div style={{ width: '100%', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>
                        Reason for Cancellation
                    </label>
                    <textarea
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            minHeight: '100px',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                        placeholder={placeholder}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className="confirm-modal-actions">
                    <button className="confirm-btn confirm-btn-cancel" onClick={handleCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className="confirm-btn confirm-btn-danger"
                        style={{ backgroundColor: '#e11d48' }}
                        onClick={handleConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
