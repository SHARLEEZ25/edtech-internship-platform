// UI for the internship application form.
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ApplyFormState } from '@/hooks/internships/student/useApplyInternship';
import '@/styles/internships/student/apply-internship.css';

interface ApplyInternshipVisualsProps {
    form: ApplyFormState;
    updateForm: (updates: Partial<ApplyFormState>) => void;
    onFileChange: (file: File) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    uploading: boolean;
    error: string | null;
    success: boolean;
    internshipTitle: string;
}

export const ApplyInternshipVisuals: React.FC<ApplyInternshipVisualsProps> = ({
    form,
    updateForm,
    onFileChange,
    onSubmit,
    loading,
    uploading,
    error,
    internshipTitle,
    success
}) => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (success) {
        return (
            /* [VISUAL STATE]: Success State. Shown after successful submission. */
            <div className="apply-container animate-fade-in">
                <div className="success-card">
                    <div className="success-icon-wrapper">
                        <span className="material-symbols-outlined success-icon">thumb_up</span>
                    </div>
                    <h2 className="success-title">Application Submitted Successfully!</h2>
                    <p className="success-subtitle">Internship Title: {internshipTitle}</p>

                    <div className="success-actions">
                        <button className="btn-secondary" onClick={() => navigate('/dashboard/student')}>
                            Back to Dashboard
                        </button>
                        <button className="btn-primary" onClick={() => navigate('/dashboard/student/applications')}>
                            View Applications
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="apply-container animate-fade-in">
            <div className="apply-header">
                <h1 className="apply-title">Apply for Internship</h1>
                <p className="apply-subtitle">Submit your application for the {internshipTitle} role.</p>
            </div>

            {error && (
                /* [VISUAL STATE]: Error Banner. Shown on submission failure. */
                <div className="error-message">
                    <span className="material-symbols-outlined error-icon">error</span>
                    {error}
                </div>
            )}

            {/* [VISUAL STATE]: Form Fields. Personal info inputs. */}
            <form className="apply-form" onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={form.fullName}
                            onChange={(e) => updateForm({ fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input form-input-disabled"
                            placeholder="Enter your email address"
                            value={form.email}
                            onChange={(e) => updateForm({ email: e.target.value })}
                            required
                            disabled
                            title="Email is linked to your profile"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-input"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) => updateForm({ phone: e.target.value })}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">LinkedIn Profile URL <span>(Optional)</span></label>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={form.linkedinUrl}
                            onChange={(e) => updateForm({ linkedinUrl: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Portfolio / GitHub URL <span>(Optional)</span></label>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="https://github.com/yourprofile"
                            value={form.githubUrl}
                            onChange={(e) => updateForm({ githubUrl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Upload Resume</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf"
                        className="hidden-file-input"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onFileChange(e.target.files[0]);
                            }
                        }}
                    />

                    {!form.resumeFile ? (
                        <div
                            className="upload-zone"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="upload-icon">
                                <span className="material-symbols-outlined">upload_file</span>
                            </div>
                            <p className="upload-text">
                                <span className="upload-link">Click to upload</span> or drag and drop your resume
                            </p>
                            <p className="upload-hint">Supported: PDF (Max 5MB)</p>
                        </div>
                    ) : (
                        <div className="file-selected">
                            <span className="material-symbols-outlined">description</span>
                            <span>{form.resumeFile.name} ({(form.resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button
                                type="button"
                                className="remove-file"
                                onClick={() => updateForm({ resumeFile: null })}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Cover Letter</label>
                    <textarea
                        className="form-input form-textarea"
                        placeholder="Tell us why you're a great fit for this role..."
                        value={form.coverLetter}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateForm({ coverLetter: e.target.value })}
                    ></textarea>
                </div>

                <div className="form-actions">
                    {/* [VISUAL STATE]: Primary Action. Submit Application button. */}
                    <button type="submit" className="submit-btn" disabled={loading || uploading}>
                        {uploading ? 'Uploading Resume...' : (loading ? 'Submitting...' : 'Submit Application')}
                    </button>
                </div>
                <br />
                

            </form>
        </div>
    );
};
