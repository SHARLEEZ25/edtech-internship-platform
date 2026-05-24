import React, { useState } from 'react';

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: {
        startTime: string; // ISO string
        duration: number; // in minutes
        mode: 'VIRTUAL' | 'IN_PERSON' | 'PHONE';
        linkOrLocation: string;
        notes?: string;
    }) => Promise<void>;
    isSubmitting: boolean;
    candidateName?: string;
    candidateRole?: string;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    candidateName = "Candidate",
    candidateRole = "Internship Applicant"
}) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [mode, setMode] = useState<'VIRTUAL' | 'IN_PERSON' | 'PHONE'>('VIRTUAL');
    const [linkOrLocation, setLinkOrLocation] = useState('');
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert("Invalid date or time");
            return;
        }

        if (end <= start) {
            alert("End time must be after start time");
            return;
        }

        const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

        await onSubmit({
            startTime: start.toISOString(),
            duration: durationMinutes,
            mode,
            linkOrLocation,
            notes
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">

                {/* 1. Header & Candidate Details */}
                <div className="bg-slate-50 p-6 border-b border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Schedule Interview</h2>
                            <p className="text-slate-500 text-sm mt-1">Set interview details for the selected applicant</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Candidate Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {candidateName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">{candidateName}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <span className="material-symbols-outlined text-[14px]">code</span>
                                    <span>{candidateRole}</span>
                                </div>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                            SHORTLISTED
                        </span>
                    </div>
                </div>

                {/* 2. Form Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="schedule-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Date & Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Interview Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Start Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        required
                                        className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">End Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        required
                                        className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mode & Link Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Interview Mode</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">videocam</span>
                                    <select
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white text-sm appearance-none"
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value as any)}
                                    >
                                        <option value="VIRTUAL">Virtual (Video Call)</option>
                                        <option value="IN_PERSON">In-Person Meeting</option>
                                        <option value="PHONE">Phone Call</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-[16px] pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">
                                    {mode === 'VIRTUAL' ? 'Meeting Link' : mode === 'PHONE' ? 'Phone Number' : 'Address'}
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">link</span>
                                    <input
                                        type="text"
                                        required
                                        placeholder={mode === 'VIRTUAL' ? 'https://meet.google.com/...' : 'Enter details...'}
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        value={linkOrLocation}
                                        onChange={(e) => setLinkOrLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">
                                Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Enter any specific instructions for the candidate..."
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm placeholder:text-slate-400"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                    </form>
                </div>

                {/* 3. Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="schedule-form" // Links to form submit
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Scheduling...' : (
                            <>
                                Schedule Interview
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
