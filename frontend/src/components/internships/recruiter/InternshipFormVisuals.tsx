// Form UI for creating or editing an internship posting.
import React from 'react';
import '../../../styles/internships/recruiter/internship-form.css';

export interface InternshipFormData {
    title: string;
    description: string;
    domain: string;
    city: string;
    state: string;
    internshipType: 'REMOTE' | 'ONSITE' | 'HYBRID';
    durationValue: number;
    durationUnit: 'MONTHS' | 'WEEKS';
    stipendMin: number | null;
    stipendMax: number | null;
    openings: number;
    applicationDeadline: string;
    startDate?: string; // Added for visual match
    skills: string;
    requirements: string;
    responsibilities: string;
    status: 'DRAFT' | 'LIVE' | 'CLOSED';
}

interface InternshipFormVisualsProps {
    formData: InternshipFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleTypeChange: (type: 'REMOTE' | 'ONSITE' | 'HYBRID') => void;
    handleDurationChange: (value: number | 'CUSTOM') => void;
    isCustomDuration: boolean;
    handleCustomDurationValueChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDurationUnitChange?: (unit: 'MONTHS' | 'WEEKS') => void;
    handleSubmit: (status: 'DRAFT' | 'LIVE') => void;
    onCancel: () => void;
    isPaid: boolean;
    setIsPaid: (val: boolean) => void;
    formError: string | null;
    loading?: boolean;
    isEdit?: boolean;
}

export const InternshipFormVisuals: React.FC<InternshipFormVisualsProps> = ({
    formData,
    handleChange,
    handleTypeChange,
    handleDurationChange,
    isCustomDuration,
    handleSubmit,
    onCancel,
    isPaid,
    setIsPaid,
    formError,
    loading = false,
    isEdit = false
}) => {
    return (
        <form className="int-form" onSubmit={(e) => e.preventDefault()}>
            {formError && (
                <div className="int-form-error-banner animate-fade-in">
                    <span className="material-symbols-outlined">error</span>
                    <p>{formError}</p>
                </div>
            )}

            {/* [VISUAL STATE]: Form Container. Main scrolling area. */}
            <div className="int-form-card">

                {/* Section 1: Basic Internship Details */}
                <div className="int-form-section">
                    <div className="int-section-header">
                        <div className="int-section-icon-box">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <h3 className="int-section-title">Basic Internship Details</h3>
                    </div>

                    <div className="int-form-grid">
                        {/* Title - Full Width */}
                        <div className="int-form-group full-width">
                            <label className="int-form-label">Internship Title</label>
                            <input
                                type="text"
                                name="title"
                                className="int-form-input"
                                placeholder="e.g. UX Design Intern"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="int-form-group full-width">
                            <label className="int-form-label">Location</label>
                            <input
                                type="text"
                                name="city"
                                className="int-form-input"
                                placeholder="e.g. Chennai"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Domain */}
                        <div className="int-form-group">
                            <label className="int-form-label">Internship Domain</label>
                            <select
                                name="domain"
                                className="int-form-select"
                                value={formData.domain}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select domain</option>
                                <option value="Design">Design</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>

                        {/* Location */}


                        {/* Internship Type - Full Width to match flow or maybe constrained if needed */}
                        <div className="int-form-group full-width">
                            <label className="int-form-label">Internship Type</label>
                            <div className="int-form-tabs type-tabs">
                                <button
                                    type="button"
                                    className={`int-tab-btn ${formData.internshipType === 'REMOTE' ? 'active' : ''}`}
                                    onClick={() => handleTypeChange('REMOTE')}
                                >
                                    <span className="material-symbols-outlined">wifi</span>
                                    Remote
                                </button>
                                <button
                                    type="button"
                                    className={`int-tab-btn ${formData.internshipType === 'ONSITE' ? 'active' : ''}`}
                                    onClick={() => handleTypeChange('ONSITE')}
                                >
                                    <span className="material-symbols-outlined">apartment</span>
                                    Onsite
                                </button>
                                <button
                                    type="button"
                                    className={`int-tab-btn ${formData.internshipType === 'HYBRID' ? 'active' : ''}`}
                                    onClick={() => handleTypeChange('HYBRID')}
                                >
                                    <span className="material-symbols-outlined">shuffle</span>
                                    Hybrid
                                </button>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="int-form-group full-width">
                            <label className="int-form-label">Duration</label>
                            <div className="int-form-tabs duration-tabs">
                                {[1, 3, 6].map(months => (
                                    <button
                                        key={months}
                                        type="button"
                                        className={`int-tab-btn ${formData.durationValue === months && !isCustomDuration ? 'active' : ''}`}
                                        onClick={() => handleDurationChange(months)}
                                    >
                                        {months} {months === 1 ? 'Month' : 'Months'}
                                    </button>
                                ))}
                                {/* Hidden Custom option to match exact screenshot design which only shows 1, 3, 6 */}
                                {/* But keeping functionality accessible if needed via code, just layout prioritized */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Stipend & Availability */}
                <div className="int-form-section">
                    <div className="int-section-header">
                        <div className="int-section-icon-box">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <h3 className="int-section-title">Stipend & Availability</h3>
                    </div>

                    {/* Unpaid/Paid Toggle */}
                    <div className="int-stipend-container">
                        <span className={`int-toggle-text ${!isPaid ? 'active' : ''}`}>Unpaid</span>
                        <label className="int-switch">
                            <input
                                type="checkbox"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                            />
                            <span className="int-slider"></span>
                        </label>
                        <span className={`int-toggle-text ${isPaid ? 'active' : ''}`}>Paid</span>
                    </div>

                    <div className="int-form-grid">
                        {/* Stipend Amount */}
                        <div className="int-form-group">
                            <label className="int-form-label">Stipend Amount</label>
                            <div className="int-input-icon-wrapper stipend-wrapper">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    name="stipendMin"
                                    className="int-form-input stipend-input"
                                    placeholder="10,000"
                                    value={formData.stipendMin || ''}
                                    onChange={handleChange}
                                    disabled={!isPaid}
                                    required={isPaid}
                                />
                                <span className="period-suffix">/month</span>
                            </div>
                        </div>

                        {/* Number of Openings */}
                        <div className="int-form-group">
                            <label className="int-form-label">Number of Openings</label>
                            <input
                                type="number"
                                name="openings"
                                className="int-form-input"
                                placeholder="e.g. 5"
                                value={formData.openings}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        {/* Start Date */}
                        <div className="int-form-group full-width">
                            <label className="int-form-label">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                className="int-form-input"
                                value={formData.startDate || ''} // Using new field
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Details Section (Description, Skills, etc. moved here to preserve functionality but match top visual) */}
                <div className="int-form-section">
                    <div className="int-section-header">
                        <div className="int-section-icon-box">
                            <span className="material-symbols-outlined">notes</span>
                        </div>
                        <h3 className="int-section-title">Additional Details</h3>
                    </div>

                    <div className="int-form-grid">
                        <div className="int-form-group full-width">
                            <label className="int-form-label">Internship Description</label>
                            <textarea
                                name="description"
                                className="int-form-input int-form-textarea"
                                placeholder="Describe the roles..."
                                value={formData.description}
                                onChange={handleChange as any}
                            />
                        </div>

                        <div className="int-form-group full-width">
                            <label className="int-form-label">Application Deadline</label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                className="int-form-input"
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.applicationDeadline}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <label className="int-form-label">Required Skills</label>
                        <textarea
                            name="skills"
                            className="int-form-input int-form-textarea"
                            placeholder="List skills (e.g. Figma, React, Communication)..."
                            value={formData.skills}
                            onChange={handleChange as any}
                            rows={2}
                        />
                    </div>

                    <div className="int-form-group full-width">
                        <label className="int-form-label">Requirements / Eligibility</label>
                        <textarea
                            name="requirements"
                            className="int-form-input int-form-textarea"
                            placeholder="List eligibility criteria (e.g. Final year student, available for 6 months)..."
                            value={formData.requirements}
                            onChange={handleChange as any}
                            rows={3}
                        />
                    </div>

                    <div className="int-form-group full-width">
                        <label className="int-form-label">Key Responsibilities</label>
                        <textarea
                            name="responsibilities"
                            className="int-form-input int-form-textarea"
                            placeholder="List day-to-day responsibilities..."
                            value={formData.responsibilities}
                            onChange={handleChange as any}
                            rows={3}
                        />
                    </div>
                </div>
            </div>



            {/* Footer Actions */}
            <div className="int-form-actions">
                <button type="button" className="int-btn int-btn-cancel" onClick={onCancel} disabled={loading}>
                    Cancel
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {!isEdit && (
                        <button
                            type="button"
                            className="int-btn int-btn-secondary"
                            onClick={() => handleSubmit('DRAFT')}
                            disabled={loading}
                        >
                            Save as Draft
                        </button>
                    )}
                    <button
                        type="button"
                        className="int-btn int-btn-submit"
                        onClick={() => handleSubmit('LIVE')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : isEdit ? 'Save Changes' : 'Publish Internship'}
                    </button>
                </div>
            </div>
        </form >
    );
};
